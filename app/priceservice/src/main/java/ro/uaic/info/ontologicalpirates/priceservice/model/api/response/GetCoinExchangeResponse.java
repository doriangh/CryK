package ro.uaic.info.ontologicalpirates.priceservice.model.api.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import ro.uaic.info.ontologicalpirates.priceservice.model.BinanceExchangeData;

import java.util.List;

@Builder
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetCoinExchangeResponse {
    private String serverUtcDate;
    List<BinanceExchangeData> exchangeData;
    private String errorMessage;
}
