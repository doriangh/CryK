package ro.uaic.info.ontologicalpirates.priceservice.model.api.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;
import ro.uaic.info.ontologicalpirates.priceservice.util.ExchangePair;

import java.util.List;

@Data
@AllArgsConstructor
@ToString
public class GetCoinExchangeRequest {
    private List<ExchangePair> coinExchanges;

    public GetCoinExchangeRequest(ExchangePair exchangePair) {
        this(List.of(exchangePair));
    }
}
