package ro.uaic.info.ontologicalpirates.coinstoreupdater.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeDataBulkRead {
    private String serverUtcDate;
    private List<BinanceExchangeData> exchangeData;
}
