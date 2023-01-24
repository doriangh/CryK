package ro.uaic.info.ontologicalpirates.priceservice.service;

import com.binance.connector.client.impl.SpotClientImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.uaic.info.ontologicalpirates.priceservice.env.EnvVariables;
import ro.uaic.info.ontologicalpirates.priceservice.model.BinanceExchangeData;
import ro.uaic.info.ontologicalpirates.priceservice.model.CoinSymbol;
import ro.uaic.info.ontologicalpirates.priceservice.util.ExchangePair;
import ro.uaic.info.ontologicalpirates.priceservice.model.api.request.GetCoinExchangeRequest;
import ro.uaic.info.ontologicalpirates.priceservice.model.api.response.GetCoinExchangeResponse;
import ro.uaic.info.ontologicalpirates.priceservice.util.BinanceUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ExchangeService {

    private static final ObjectMapper SERIALIZER = new ObjectMapper();
    private static final String DEFAULT_PRICE = "1";
    private static final String SYMBOLS_KEY = "symbols";
    private static final String USDT = "USDT";
    private static final String UNKNOWN_EXCHANGE = "#UNKNOWN#";
    private final SpotClientImpl spotClient;
    @Autowired
    public ExchangeService(EnvVariables environment) {
        this.spotClient = new SpotClientImpl(environment.getAccessKey(), environment.getSecretKey());
    }

    public GetCoinExchangeResponse getExchange(GetCoinExchangeRequest coinExchangeRequest)
            throws JsonProcessingException {
        List<BinanceExchangeData> result = new ArrayList<>();
        result.addAll(getRedundantEntries(coinExchangeRequest));
        result.addAll(computeWitUSDTAndGetExchange(coinExchangeRequest));

        ArrayList<String> symbolParams = coinExchangeRequest.getCoinExchanges()
                .stream()
                .filter(coinExchange -> coinExchange.getFromSymbol() != coinExchange.getToSymbol())
                .filter(this::isPairRegisteredWithBinanceOrderBook)
                .map(ExchangePair::getBinanceExchangeSymbol)
                .collect(Collectors.toCollection(ArrayList::new));

        if (!symbolParams.isEmpty()) {
            result.addAll(executeTickerPriceRequest(symbolParams));
        }

        return GetCoinExchangeResponse.builder()
                .exchangeData(result)
                .serverUtcDate(Instant.now().toString())
                .build();
    }

    private List<BinanceExchangeData> getRedundantEntries(GetCoinExchangeRequest request) {
        return request.getCoinExchanges()
                .stream()
                .filter(exchangePair -> exchangePair.getFromSymbol() == exchangePair.getToSymbol())
                .map(exchangePair -> new BinanceExchangeData(exchangePair.getFromSymbol().name(), DEFAULT_PRICE))
                .collect(Collectors.toList());
    }

    private List<BinanceExchangeData> computeWitUSDTAndGetExchange(GetCoinExchangeRequest request)
            throws JsonProcessingException {
        List<ExchangePair> pairs = request.getCoinExchanges()
                .stream()
                .filter(exchangePair -> exchangePair.getFromSymbol() != exchangePair.getToSymbol())
                .filter(exchangePair -> !isPairRegisteredWithBinanceOrderBook(exchangePair))
                .toList();

        if (pairs.isEmpty()) {
            return Collections.emptyList();
        }

        List<ExchangePair> intermediaryFromUSDT = pairs
                .stream()
                .map(exchangePair -> new ExchangePair(exchangePair.getFromSymbol(), CoinSymbol.USDT))
                .filter(exchangePair -> isPairRegisteredWithBinanceOrderBook(exchangePair)
                        || exchangePair.getFromSymbol().name().equals(USDT))
                .toList();

        List<ExchangePair> intermediaryToUSDT = pairs
                .stream()
                .map(exchangePair -> new ExchangePair(exchangePair.getToSymbol(), CoinSymbol.USDT))
                .filter(exchangePair -> isPairRegisteredWithBinanceOrderBook(exchangePair)
                        || exchangePair.getToSymbol().name().equals(USDT))
                .toList();

        List<BinanceExchangeData> fromSymbolsToUSDT = new ArrayList<>();
        if (!intermediaryFromUSDT.isEmpty()) {
            fromSymbolsToUSDT = executeTickerPriceRequest(intermediaryFromUSDT
                    .stream()
                    .map(ExchangePair::getBinanceExchangeSymbol)
                    .collect(Collectors.toList())
            );
        }

        List<BinanceExchangeData> toSymbolsToUSDT = new ArrayList<>();
        if (!intermediaryToUSDT.isEmpty()) {
            toSymbolsToUSDT = executeTickerPriceRequest(
                    intermediaryToUSDT.stream()
                            .map(ExchangePair::getBinanceExchangeSymbol)
                            .collect(Collectors.toList())
            );
        }

        List<BinanceExchangeData> result = new ArrayList<>();
        for (ExchangePair pair : pairs) {
            Optional<BinanceExchangeData> fromSymbolToUSDTPair = fromSymbolsToUSDT.stream()
                    .filter(data -> data.getSymbol().equals(pair.getFromSymbolToUSDT()))
                    .findFirst();

            if (fromSymbolToUSDTPair.isEmpty()) {
                result.add(new BinanceExchangeData(pair.getBinanceExchangeSymbol(), UNKNOWN_EXCHANGE));
                continue;
            }

            Optional<BinanceExchangeData> toSymbolToUSDTPair = toSymbolsToUSDT.stream()
                    .filter(data -> data.getSymbol().equals(pair.getToSymbolToUSDT()))
                    .findFirst();

            if (toSymbolToUSDTPair.isEmpty()) {
                result.add(new BinanceExchangeData(pair.getBinanceExchangeSymbol(), UNKNOWN_EXCHANGE));
                continue;
            }

            Double fromPrice = Double.parseDouble(fromSymbolToUSDTPair.get().getPrice());
            Double toPrice = Double.parseDouble(toSymbolToUSDTPair.get().getPrice());

            result.add(new BinanceExchangeData(pair.getBinanceExchangeSymbol(), String.valueOf(fromPrice / toPrice)));
        }
        return result;
    }

    private List<BinanceExchangeData> executeTickerPriceRequest(List<String> binanceExchangeSymbols)
            throws JsonProcessingException {
        Optional<String> usdtExchange = binanceExchangeSymbols.stream()
                .filter(symbol -> symbol.equals(USDT + USDT)).findFirst();

        usdtExchange.ifPresent(binanceExchangeSymbols::remove);

        LinkedHashMap<String, Object> params = new LinkedHashMap<>();
        params.put(SYMBOLS_KEY, binanceExchangeSymbols);
        log.info(String.valueOf(params));
        List<BinanceExchangeData> result = new ArrayList<>();
        if (!binanceExchangeSymbols.isEmpty()) {
            result = fromRawResponse(spotClient.createMarket().tickerSymbol(params));
        }
        if (usdtExchange.isPresent()) {
            result.add(new BinanceExchangeData(USDT + USDT, "1"));
        }
        return result;
    }

    private boolean isPairRegisteredWithBinanceOrderBook(ExchangePair exchangePair) {
        return BinanceUtils.EXCHANGE_PAIRS.contains(exchangePair.getFromSymbol().name()
                + exchangePair.getToSymbol().name());
    }

    private List<BinanceExchangeData> fromRawResponse(String response) throws JsonProcessingException {
        TypeReference<List<BinanceExchangeData>> binanceExchangeDataType = new TypeReference<>(){};
        return SERIALIZER.readValue(response, binanceExchangeDataType);
    }
}
