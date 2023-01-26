package ro.uaic.info.ontologicalpirates.coinstoreupdater.task;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import ro.uaic.info.ontologicalpirates.coinstoreupdater.service.PriceService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class UpdatePricesTask implements Runnable {

    private final PriceService priceService;

    @Override
    public void run() {
        try {
            priceService.updatePrices();
        } catch (IOException e) {
            throw new RuntimeException("Unable to update prices");
        }
    }
}
