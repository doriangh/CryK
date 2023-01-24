package ro.uaic.info.ontologicalpirates.priceservice.service;

import com.binance.connector.client.impl.SpotClientImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.uaic.info.ontologicalpirates.priceservice.env.EnvVariables;
import ro.uaic.info.ontologicalpirates.priceservice.model.BinanceExchangeData;
import ro.uaic.info.ontologicalpirates.priceservice.model.BinanceKLineData;
import ro.uaic.info.ontologicalpirates.priceservice.model.api.response.GetPriceHistoryResponse;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PriceHistoryService {

    private static final ObjectMapper SERIALIZER = new ObjectMapper();
    private static final SimpleDateFormat DAILY_DATE_FORMAT = new SimpleDateFormat("dd MMM yyyy");
    private static final long ONE_MINUTE = 60000;
    private static final long ONE_HOUR = ONE_MINUTE * 60;
    private static final long ONE_DAY = ONE_HOUR * 24;
    private static final String DEFAULT_INTERVAL = "1d";

    private final SpotClientImpl spotClient;

    @Autowired
    public PriceHistoryService(EnvVariables environment) {
        this.spotClient = new SpotClientImpl(environment.getAccessKey(), environment.getSecretKey());
    }

    public GetPriceHistoryResponse getPriceHistory(String symbol) throws JsonProcessingException {
        return getPriceHistory(symbol, DEFAULT_INTERVAL);
    }

    public GetPriceHistoryResponse getPriceHistory(String symbol, String interval) throws JsonProcessingException {
        long currentTime = Instant.now().toEpochMilli();
        long endTime = currentTime - currentTime % ONE_HOUR;
        long startTime = endTime - ONE_DAY * 60;
        return getPriceHistory(symbol, interval, startTime, endTime);
    }

    public GetPriceHistoryResponse getPriceHistory(String symbol, String interval, Long startTime, Long endTime)
            throws JsonProcessingException {
        if (interval == null && startTime == null && endTime == null) {
            return getPriceHistory(symbol);
        }

        if (startTime == null && endTime == null) {
            return getPriceHistory(symbol, interval);
        }

        LinkedHashMap<String, Object> params = new LinkedHashMap<>();
        params.put("symbol", symbol);
        params.put("interval", interval);
        params.put("startTime", startTime);
        params.put("endTime", endTime);
        List<BinanceKLineData> klineData = fromRawResponse(spotClient.createMarket().klines(params));

        return GetPriceHistoryResponse.builder()
                .kline(klineData)
                .prices(klineData.stream().map(BinanceKLineData::getHighPrice).toList())
                .dates(getDailyDates(startTime, endTime))
                .serverUtcDate(Instant.now().toString())
                .build();
    }

    private List<String> getDailyDates(Long startTime, Long endTime) {
        List<String> dates = new ArrayList<>();
        for (long timestamp = startTime; timestamp <= endTime; timestamp += ONE_DAY) {
            dates.add(DAILY_DATE_FORMAT.format(new Date(timestamp)));
        }
        return dates;
    }

    private List<BinanceKLineData> fromRawResponse(String response) throws JsonProcessingException {
        TypeReference<List<List<Object>>> binanceExchangeDataType = new TypeReference<>(){};
        List<List<Object>> rawData = SERIALIZER.readValue(response, binanceExchangeDataType);

        return rawData.stream()
                .map(data -> new BinanceKLineData(
                        (String) (data.get(1)),
                        (String) (data.get(2)),
                        (String) (data.get(3)),
                        (String) (data.get(4))))
                .toList();
    }
}
