package ro.uaic.info.ontologicalpirates.priceservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.uaic.info.ontologicalpirates.priceservice.service.PriceHistoryService;

@RestController
@RequestMapping("/historic")
@RequiredArgsConstructor
public class PriceHistoryController {

    private final PriceHistoryService priceHistoryService;

    @GetMapping
    public String getPriceHistory(@RequestParam("symbol") String symbol) {
        return priceHistoryService.getPriceHistory(symbol);
    }
}
