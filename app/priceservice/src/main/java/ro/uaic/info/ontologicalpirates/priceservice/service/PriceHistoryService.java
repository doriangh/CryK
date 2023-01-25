package ro.uaic.info.ontologicalpirates.priceservice.service;

import com.binance.connector.client.impl.SpotClientImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.uaic.info.ontologicalpirates.priceservice.env.EnvVariables;
import ro.uaic.info.ontologicalpirates.priceservice.model.BinanceKLineData;
import ro.uaic.info.ontologicalpirates.priceservice.model.api.response.GetPriceHistoryResponse;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class PriceHistoryService {

    private static final ObjectMapper SERIALIZER = new ObjectMapper();
    private static final Long ONE_MINUTE = 60000L;
    private static final Long ONE_HOUR = ONE_MINUTE * 60;
    private static final Long ONE_DAY = ONE_HOUR * 24;
    private static final String DEFAULT_INTERVAL = "1d";
    private static final Set<String> INTERVALS = Set.of("1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h",
            "6h", "8h", "12h", "1d", "3d", "1w", "1M");
    private static final Map<String, Long> INTERVAL_EPOCHS = Map.of(
            "1m", ONE_MINUTE, "3m", 3 * ONE_MINUTE, "5m", 5 * ONE_MINUTE,
            "30m", 30 * ONE_MINUTE, "1h", ONE_HOUR, "6h", 6 * ONE_HOUR, "12h", 12 * ONE_HOUR,
            "1d", ONE_DAY, "1w", 7 * ONE_DAY, "1M", 30 * ONE_DAY
    );

    private final SpotClientImpl spotClient;

    @Autowired
    public PriceHistoryService(EnvVariables environment) {
        this.spotClient = new SpotClientImpl(environment.getAccessKey(), environment.getSecretKey());
    }

    public GetPriceHistoryResponse getPriceHistory(String symbol) throws JsonProcessingException {
        return getPriceHistory(symbol, DEFAULT_INTERVAL);
    }

    public GetPriceHistoryResponse getPriceHistory(String symbol, String interval) throws JsonProcessingException {
        if (!INTERVALS.contains(interval)) {
            throw new IllegalArgumentException("Unknown interval");
        }
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
                .dates(getDatesByInterval(startTime, endTime, INTERVAL_EPOCHS.get(interval)))
                .serverUtcDate(Instant.now().toString())
                .build();
    }

    private List<Long> getDatesByInterval(Long startTime, Long endTime, Long interval) {
        List<Long> dates = new ArrayList<>();
        for (long timestamp = startTime; timestamp <= endTime; timestamp += interval) {
            dates.add(timestamp);
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
