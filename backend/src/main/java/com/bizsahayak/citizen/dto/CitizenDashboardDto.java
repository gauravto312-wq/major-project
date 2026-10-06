package com.bizsahayak.citizen.dto;

import com.bizsahayak.notification.Notification;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.tender.dto.TenderDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenDashboardDto {
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String createdAt;

    // KPI Summary
    private long savedSchemesCount;
    private long savedTendersCount;
    private long totalTrackedApplicationsCount;
    private long unreadNotificationsCount;

    // Sections
    private List<SchemeDto> newSchemes;
    private Map<String, Long> trackedStatusCounts;
    private List<SchemeDto> upcomingDeadlines;
    private List<Notification> recentNotifications;
    private List<SchemeDto> savedSchemes;
    private List<TenderDto> savedTenders;
}
