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
public class RawTenderDto {
    private String sourceReferenceId;
    private String title;
    private String tenderNumber;
    private String organization;
    private String department;
    private String description;
    private String location;
    private String state;
    private String district;
    private Double estimatedValue;
    private LocalDate publishDate;
    private LocalDate closingDate;
    private String eligibility;
    private String requiredDocuments;
    private String requirements;
    private String officialTenderUrl;
    private String officialSourceUrl;
    private String categorySlug;
    private String targetIndustries;
    private String targetBusinessTypes;
    private LocalDateTime sourceLastUpdatedAt;
}
