package com.bizsahayak.government.repository;

import com.bizsahayak.government.model.GovernmentSyncLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GovernmentSyncLogRepository extends JpaRepository<GovernmentSyncLog, Long> {
    List<GovernmentSyncLog> findBySourceIdOrderByStartedAtDesc(Long sourceId);
    List<GovernmentSyncLog> findTop20ByOrderByStartedAtDesc();
}
