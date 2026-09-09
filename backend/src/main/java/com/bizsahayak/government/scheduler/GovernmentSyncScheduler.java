package com.bizsahayak.government.scheduler;

import com.bizsahayak.government.model.GovernmentSource;
import com.bizsahayak.government.repository.GovernmentSourceRepository;
import com.bizsahayak.government.service.GovernmentSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class GovernmentSyncScheduler {

    private final GovernmentSourceRepository sourceRepository;
    private final GovernmentSyncService syncService;

    @Scheduled(cron = "${app.government.sync-cron:0 0 */6 * * *}")
    public void runScheduledSync() {
        log.info("Starting scheduled government data synchronization task...");
        List<GovernmentSource> activeSources = sourceRepository.findByActiveTrue();

        for (GovernmentSource source : activeSources) {
            try {
                log.info("Executing scheduled sync for source: {} (ID: {})", source.getName(), source.getId());
                syncService.triggerSync(source.getId());
            } catch (Exception ex) {
                log.error("Scheduled sync failed for source ID {}: {}", source.getId(), ex.getMessage());
            }
        }
        log.info("Scheduled government data synchronization task completed.");
    }
}
