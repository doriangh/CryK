package ro.uaic.info.ontologicalpirates.priceservice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
@Slf4j
public class PriceServiceApplication {

	public static void main(String[] args) {
		log.info("Starting application");
		SpringApplication.run(PriceServiceApplication.class, args);
	}
}
