package com.bizsahayak.government.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawSchemeDto {
    private String sourceReferenceId;
    private String title;
    private String description;
    private String shortDescription;
    private String department;
    private String ministry;
    private String schemeType;
    private String state;
    private String district;
    private String benefits;
    private String eligibility;
    private String requiredDocuments;
    private String applicationProcess;
    private LocalDate startDate;
    private LocalDate deadline;
    private String officialApplicationUrl;
    private String officialSourceUrl;
    private String categorySlug;
    private String targetIndustries;
    private String targetBusinessTypes;
    private LocalDateTime sourceLastUpdatedAt;
}
