package com.bizsahayak.scheme.dto;

import com.bizsahayak.scheme.SchemeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeFilterRequest {
    private String keyword;
    private String state;
    private String district;
    private String schemeType;
    private Long categoryId;
    private SchemeStatus status;
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
