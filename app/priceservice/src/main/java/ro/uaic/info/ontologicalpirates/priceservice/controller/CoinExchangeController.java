package ro.uaic.info.ontologicalpirates.priceservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.uaic.info.ontologicalpirates.priceservice.util.ExchangePair;
import ro.uaic.info.ontologicalpirates.priceservice.model.CoinSymbol;
import ro.uaic.info.ontologicalpirates.priceservice.model.api.request.GetCoinExchangeRequest;
import ro.uaic.info.ontologicalpirates.priceservice.model.api.response.GetCoinExchangeResponse;
import ro.uaic.info.ontologicalpirates.priceservice.service.ExchangeService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/exchange")
@RequiredArgsConstructor
@Slf4j
public class CoinExchangeController {

    private static final ObjectMapper SERIALIZER = new ObjectMapper();

    private final ExchangeService exchangeService;

    @GetMapping
    public ResponseEntity<GetCoinExchangeResponse> getCoinExchange(
            @RequestParam(name = "symbols", required = false) String symbolPairs,
            @RequestParam(name = "from", required = false) CoinSymbol fromSymbol,
            @RequestParam(name = "to", required = false) CoinSymbol toSymbol

    ) throws JsonProcessingException {
        if (symbolPairs != null && fromSymbol != null && toSymbol != null) {

            return ResponseEntity.badRequest().body(GetCoinExchangeResponse.builder()
                    .errorMessage("Either symbols param must be provided or both from and to params" +
                            " must be provided").build());
        }
        if (symbolPairs != null) {
            log.info("Symbols list provided {}", symbolPairs);
            List<List<CoinSymbol>> symbols = fromRawSymbolPairs(symbolPairs);
            return getCoinExchange(new GetCoinExchangeRequest(
                    symbols.stream().map(ExchangePair::new).collect(Collectors.toList())));
        }
        if (fromSymbol == null || toSymbol == null) {
            log.info("Single symbol pair provided {} {}", fromSymbol, toSymbol);
            return ResponseEntity.badRequest().body(GetCoinExchangeResponse.builder()
                    .errorMessage("Either symbols param must be provided or both from and to params" +
                            " must be provided").build());
        }
        return getCoinExchange(new GetCoinExchangeRequest(List.of(ExchangePair.builder()
                        .fromSymbol(fromSymbol)
                        .toSymbol(toSymbol)
                .build())));
    }

    private ResponseEntity<GetCoinExchangeResponse> getCoinExchange(GetCoinExchangeRequest coinExchangeRequest)
            throws JsonProcessingException {
        log.info(String.valueOf(coinExchangeRequest));
        return ResponseEntity.ok(exchangeService.getExchange(coinExchangeRequest));
    }

    private List<List<CoinSymbol>> fromRawSymbolPairs(String symbolPairs) throws JsonProcessingException {
        TypeReference<List<List<CoinSymbol>>> listOfPairsType = new TypeReference<>(){};
        return SERIALIZER.readValue(symbolPairs, listOfPairsType);
    }
}
