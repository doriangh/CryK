package ro.uaic.info.ontologicalpirates.coinstoreupdater.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.jena.ext.com.google.common.io.Resources;
import org.apache.jena.sparql.exec.http.UpdateExecutionHTTP;
import org.apache.jena.update.UpdateRequest;
import org.springframework.stereotype.Service;
import ro.uaic.info.ontologicalpirates.coinstoreupdater.model.BinanceExchangeData;
import ro.uaic.info.ontologicalpirates.coinstoreupdater.model.ExchangeDataBulkRead;
import ro.uaic.info.ontologicalpirates.coinstoreupdater.util.ListedCoin;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.StringJoiner;

@Service
public class PriceService {

    private static final String UPDATE_COIN_PRICE_TEMPLATE = loadCoinPriceUpdateTemplate();
    private static final String LIST_ALL_PRICES_REQUEST_URL = buildListPricesRequestUrl();
    private static final ObjectMapper SERIALIZER = new ObjectMapper();
    private static final String COIN_IRI_PREFIX = "http://purl.org/net/bel-epa/doacc#";
    private static final String COIN_PRICE_PREFIX = "http://www.ontologicalpirates.ro/resource#";
    private static final String EXCHANGE_COIN_DEFAULT = "http://purl.org/net/bel-epa/doacc#USDT";
    private static final String EXCHANGE_COIN_DEFAULT_SYMBOL = "USDT";
    private static final String COIN_TO_UPDATE_IRI = "COIN_TO_UPDATE_IRI";
    private static final String COIN_PRICE_IRI = "COIN_PRICE_IRI";
    private static final String PRICE_VALUE_LITERAL = "PRICE_VALUE_LITERAL";
    private static final String UPDATE_DATE_LITERAL = "UPDATE_DATE_LITERAL";
    private static final String COIN_EXCHANGE_IRI = "COIN_EXCHANGE_IRI";
    private static final String PRICE_SERVICE_HOST = "http://localhost:8081/exchange";

    private final CloseableHttpClient httpclient;

    public PriceService() {
        this.httpclient = HttpClients.createDefault();
    }


    public void updatePrices() throws IOException {
        UpdateRequest updateRequest = new UpdateRequest();

        ExchangeDataBulkRead exchangeDataBulkRead = getAllPrices();
        for (BinanceExchangeData exchangeDataItem : exchangeDataBulkRead.getExchangeData()) {
            String symbol = exchangeDataItem.getSymbol().split(EXCHANGE_COIN_DEFAULT_SYMBOL)[0];
            updateRequest.add(updateCoinPriceQuery(symbol, exchangeDataItem.getPrice()));
        }

        System.out.println(updateRequest.toString());
        UpdateExecutionHTTP.service("http://localhost:3332/ds/update").update(updateRequest).build().execute();
    }

    private static String loadCoinPriceUpdateTemplate() {
        try {
            return Resources.toString(Resources.getResource("sparql/update/updatePrice.sparql"),
                    StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Unexpected error trying to load coin price update template.");
        }
    }

    private String updateCoinPriceQuery(String coinToUpdateSymbol, String price) {
        return UPDATE_COIN_PRICE_TEMPLATE.replace(COIN_TO_UPDATE_IRI, COIN_IRI_PREFIX + coinToUpdateSymbol)
                .replace(COIN_PRICE_IRI, COIN_PRICE_PREFIX + coinToUpdateSymbol + "_PRICE")
                .replace(PRICE_VALUE_LITERAL, price)
                .replace(UPDATE_DATE_LITERAL, Instant.now().toString())
                .replace(COIN_EXCHANGE_IRI, EXCHANGE_COIN_DEFAULT);
    }

    private ExchangeDataBulkRead getAllPrices() throws IOException {
        HttpGet newListPricesRequest = new HttpGet(LIST_ALL_PRICES_REQUEST_URL);
        System.out.println(LIST_ALL_PRICES_REQUEST_URL);
        CloseableHttpResponse response = httpclient.execute(newListPricesRequest);
        return SERIALIZER.readValue(response.getEntity().getContent(), ExchangeDataBulkRead.class);
    }

    private static String buildListPricesRequestUrl() {
        StringJoiner queryParameterList = new StringJoiner(",");
        String exchangeParamTemplate = "[\"%s\",\"%s\"]";
        for (ListedCoin listedCoin : ListedCoin.values()) {
            queryParameterList.add(String.format(exchangeParamTemplate, listedCoin.name(),
                    EXCHANGE_COIN_DEFAULT_SYMBOL));
        }
        String queryParameterValue = URLEncoder.encode(String.format("[%s]", queryParameterList),
                StandardCharsets.UTF_8);
        String queryParameter = String.format("symbols=%s", queryParameterValue);
        return String.format("%s/?%s", PRICE_SERVICE_HOST, queryParameter);
    }
}
