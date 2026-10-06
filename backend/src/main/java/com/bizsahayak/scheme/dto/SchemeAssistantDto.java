package com.bizsahayak.scheme.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeAssistantDto {
    private Long schemeId;
    private String schemeTitle;
    private String slug;
    private String department;
    private String ministry;
    private String schemeType;
    private String categoryName;
    private String officialApplicationUrl;
    private String officialSourceUrl;

    private String eligibilityRating; // ELIGIBLE, LIKELY_ELIGIBLE, NEEDS_VERIFICATION, NOT_ELIGIBLE

    private List<EligibilityCheckItem> eligibilityChecks;
    private List<RequiredDocumentItem> requiredDocumentsList;
    private List<String> applicationSteps;
    private String rawApplicationProcess;

    private String applicationMode; // ONLINE, OFFLINE, BOTH, UNKNOWN
    private String applicationDestinationStatus; // DIRECT_APPLICATION, APPLICATION_LOGIN, PORTAL_REQUIRES_NAVIGATION, OFFICIAL_INFORMATION_ONLY, UNAVAILABLE
    private LocalDate deadline;
    private Long daysRemaining;

    private String currentTrackerStatus; // INTERESTED, PREPARING, APPLIED, COMPLETED, NOT_TRACKED

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class EligibilityCheckItem {
        private String criterion;
        private String value;
        private boolean passed;
        private String message;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RequiredDocumentItem {
        private String documentName;
        private boolean required; // true if mandatory, false if optional
        private String notes;     // why required / preparation instructions
    }

    // Deprecated vault fields kept for backwards compatibility if needed
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class DocumentCheckItem {
        private String documentName;
        private boolean available;
        private String vaultStatus;
    }
}
