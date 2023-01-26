package ro.uaic.info.ontologicalpirates.coinstoreupdater.scheduler;

import org.springframework.context.annotation.Configuration;
import ro.uaic.info.ontologicalpirates.coinstoreupdater.task.UpdatePricesTask;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Configuration
public class UpdateDataScheduler {

    @Resource
    private UpdatePricesTask updatePricesTask;
    private ScheduledExecutorService executorService;

    @PostConstruct
    private void init() {
        executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(updatePricesTask, 5, 30, TimeUnit.SECONDS);
    }
}
