package com.bizsahayak.tender.dto;

import com.bizsahayak.tender.TenderStatus;
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
public class TenderDto {
    private Long id;

    @NotBlank(message = "Tender title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Tender number is required")
    private String tenderNumber;

    @NotBlank(message = "Organization is required")
    private String organization;

    private String department;
    private Long categoryId;
    private String categoryName;

    @NotBlank(message = "Description is required")
    private String description;

    private String location;

    @NotBlank(message = "State is required")
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

    private TenderStatus status;
    private boolean featured;

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
