package ro.uaic.info.ontologicalpirates.priceservice.model.api.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import ro.uaic.info.ontologicalpirates.priceservice.model.BinanceKLineData;

import java.util.List;

@Builder
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetPriceHistoryResponse {
    private String serverUtcDate;
    private List<BinanceKLineData> kline;
    private List<Double> prices;
    private List<String> dates;
    private String errorMessage;
}
