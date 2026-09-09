package com.bizsahayak.scheme.dto;

import com.bizsahayak.scheme.SchemeStatus;
import jakarta.validation.constraints.NotBlank;
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
public class SchemeDto {
    private Long id;

    @NotBlank(message = "Scheme title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Description is required")
    private String description;

    private String shortDescription;

    @NotBlank(message = "Department is required")
    private String department;

    private String ministry;
    private Long categoryId;
    private String categoryName;

    @NotBlank(message = "Scheme type is required")
    private String schemeType;

    @NotBlank(message = "State is required")
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

    private SchemeStatus status;
    private boolean featured;

    private Double minInvestment;
    private Double maxInvestment;
    private Double minTurnover;
    private Double maxTurnover;
    private String targetIndustries;
    private String targetBusinessTypes;

    private String sourceName;
    private String sourceReferenceId;
    private LocalDateTime sourceLastUpdatedAt;
    private LocalDateTime lastSyncedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}
