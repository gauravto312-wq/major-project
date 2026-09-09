package com.bizsahayak.government.dto;

import com.bizsahayak.government.model.SyncStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncResultDto {
    private String source;
    private SyncStatus status;
    private int recordsFetched;
    private int recordsCreated;
    private int recordsUpdated;
    private int recordsSkipped;
    private int recordsFailed;
    private String message;
}
