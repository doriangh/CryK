package ro.uaic.info.ontologicalpirates.priceservice.service;

import com.binance.connector.client.impl.SpotClientImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.uaic.info.ontologicalpirates.priceservice.env.EnvVariables;

import java.time.Instant;
import java.util.LinkedHashMap;

@Service
public class PriceHistoryService {

    private static final long ONE_MINUTE = 60000;
    private final SpotClientImpl spotClient;

    @Autowired
    public PriceHistoryService(EnvVariables environment) {
        this.spotClient = new SpotClientImpl(environment.getAccessKey(), environment.getSecretKey());
    }

    public String getPriceHistory(String symbol) {
        long currentTime = Instant.now().toEpochMilli();
        long endTime = currentTime - currentTime % (ONE_MINUTE * 60);
        long startTime = endTime - ONE_MINUTE * 60;
        LinkedHashMap<String, Object> params = new LinkedHashMap<>();
        params.put("symbol", symbol);
        params.put("interval", "1m");
        params.put("startTime", startTime);
        params.put("endTime", endTime);
        return spotClient.createMarket().klines(params);
    }
}
