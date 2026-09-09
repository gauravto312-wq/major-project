package com.bizsahayak.tender.dto;

import com.bizsahayak.tender.TenderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenderFilterRequest {
    private String keyword;
    private String state;
    private String district;
    private String organization;
    private Long categoryId;
    private TenderStatus status;
    private Boolean featured;
    @Builder.Default
    private int page = 0;
    @Builder.Default
    private int size = 12;
    @Builder.Default
    private String sortBy = "createdAt";
    @Builder.Default
    private String sortDir = "DESC";
}
