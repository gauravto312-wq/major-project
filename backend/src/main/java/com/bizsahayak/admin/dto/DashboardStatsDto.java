package com.bizsahayak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalUsers;
    private long totalBusinesses;
    private long pendingBusinesses;
    private long verifiedBusinesses;

    private long totalSchemes;
    private long activeSchemes;
    private long draftSchemes;

    private long totalTenders;
    private long activeTenders;
    private long closedTenders;

    private long pendingDocuments;
}
