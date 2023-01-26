package ro.uaic.info.ontologicalpirates.coinstoreupdater.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BinanceExchangeData {
    private String symbol;
    private String price;
}
