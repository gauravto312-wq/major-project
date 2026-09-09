package com.bizsahayak.government.dto;

import com.bizsahayak.government.model.SyncStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GovernmentSyncLogDto {
    private Long id;
    private Long sourceId;
    private String sourceName;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private SyncStatus status;
    private int recordsFetched;
    private int recordsCreated;
    private int recordsUpdated;
    private int recordsSkipped;
    private int recordsFailed;
    private String errorMessage;
}
