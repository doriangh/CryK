package ro.uaic.info.ontologicalpirates.priceservice.env;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class EnvVariables {

    private final String accessKey;
    private final String secretKey;

    public EnvVariables() {
        this.accessKey = System.getenv("ak");
        this.secretKey = System.getenv("sk");
    }
}
