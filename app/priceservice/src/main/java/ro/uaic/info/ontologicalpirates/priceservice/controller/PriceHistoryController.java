package ro.uaic.info.ontologicalpirates.priceservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.uaic.info.ontologicalpirates.priceservice.model.BinanceKLineData;
import ro.uaic.info.ontologicalpirates.priceservice.model.CoinSymbol;
import ro.uaic.info.ontologicalpirates.priceservice.model.api.response.GetPriceHistoryResponse;
import ro.uaic.info.ontologicalpirates.priceservice.service.ExchangeService;
import ro.uaic.info.ontologicalpirates.priceservice.service.PriceHistoryService;
import ro.uaic.info.ontologicalpirates.priceservice.util.BinanceUtils;
import ro.uaic.info.ontologicalpirates.priceservice.util.ExchangePair;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/historic")
@RequiredArgsConstructor
public class PriceHistoryController {

    private final PriceHistoryService priceHistoryService;

    @GetMapping
    public ResponseEntity<GetPriceHistoryResponse> getPriceHistory(
            @RequestParam("symbol") CoinSymbol fromSymbol,
            @RequestParam(name = "to", required = false) CoinSymbol toSymbol,
            @RequestParam(name = "interval", required = false) String interval,
            @RequestParam(name = "startTimeUTC", required = false) Long startTimeUTC,
            @RequestParam(name = "endTimeUTC", required = false) Long endTimeUTC
    ) throws JsonProcessingException {
        if (toSymbol == null) {
            toSymbol = CoinSymbol.USDT;
        }

        ExchangePair exchangePair = new ExchangePair(fromSymbol, toSymbol);
        if (!BinanceUtils.EXCHANGE_PAIRS.contains(exchangePair.getBinanceExchangeSymbol())) {
            return ResponseEntity.badRequest().body(GetPriceHistoryResponse.builder()
                            .errorMessage("Cannot compute exchange from " + fromSymbol + " to " + toSymbol)
                    .build());
        }

        return ResponseEntity.ok()
                .body(priceHistoryService.getPriceHistory(exchangePair.getBinanceExchangeSymbol(), interval,
                        startTimeUTC, endTimeUTC));
    }
}
