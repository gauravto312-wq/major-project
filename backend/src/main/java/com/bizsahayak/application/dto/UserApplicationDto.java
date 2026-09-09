package com.bizsahayak.application.dto;

import com.bizsahayak.application.ApplicationStatus;
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
public class UserApplicationDto {
    private Long id;
    private Long userId;
    private Long schemeId;
    private String schemeTitle;
    private Long tenderId;
    private String tenderTitle;

    @NotBlank(message = "Title is required")
    private String title;

    private String applicationNumber;
    private ApplicationStatus status;
    private LocalDate applicationDate;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
