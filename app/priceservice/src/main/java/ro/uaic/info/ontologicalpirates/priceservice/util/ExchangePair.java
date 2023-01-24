package ro.uaic.info.ontologicalpirates.priceservice.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import ro.uaic.info.ontologicalpirates.priceservice.model.CoinSymbol;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ExchangePair {

    private static final String BASE_EXCHANGE = "USDT";
    private CoinSymbol fromSymbol;
    private CoinSymbol toSymbol;

    public ExchangePair(List<CoinSymbol> symbolsPair) {
        if (symbolsPair.size() != 2) {
            throw new IllegalArgumentException("Each exchange pair should have exactly 2 coin symbols");
        }
        this.fromSymbol = symbolsPair.get(0);
        this.toSymbol = symbolsPair.get(1);
        if (fromSymbol == null || toSymbol == null) {
            throw new IllegalArgumentException("Symbols must be valid values not nulls");
        }
    }

    public String getBinanceExchangeSymbol() {
        return fromSymbol.name() + toSymbol.name();
    }

    public String getFromSymbolToUSDT() {
        return fromSymbol.name() + BASE_EXCHANGE;
    }

    public String getToSymbolToUSDT() {
        return toSymbol.name() + BASE_EXCHANGE;
    }
}
