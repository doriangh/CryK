package ro.uaic.info.ontologicalpirates.priceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BinanceKLineData {
    private Double openPrice;
    private Double highPrice;
    private Double lowPrice;
    private Double closePrice;

    public BinanceKLineData(String openPrice, String highPrice, String lowPrice, String closePrice) {
        this.openPrice = Double.parseDouble(openPrice);
        this.highPrice = Double.parseDouble(highPrice);
        this.lowPrice = Double.parseDouble(lowPrice);
        this.closePrice = Double.parseDouble(closePrice);
    }
}
