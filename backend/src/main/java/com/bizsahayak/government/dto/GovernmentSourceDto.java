package com.bizsahayak.government.dto;

import com.bizsahayak.government.model.GovernmentContentType;
import com.bizsahayak.government.model.GovernmentSourceType;
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
public class GovernmentSourceDto {
    private Long id;
    private String name;
    private String description;
    private String providerCode;
    private GovernmentSourceType sourceType;
    private GovernmentContentType contentType;
    private String baseUrl;
    private String apiUrl;
    private String documentationUrl;
    private String termsUrl;
    private String authenticationType;
    private String credentialReference;
    private boolean active;
    private String syncFrequency;
    private String rateLimitNotes;
    private LocalDateTime lastSyncAt;
    private SyncStatus lastSyncStatus;
    private LocalDateTime createdAt;
}
