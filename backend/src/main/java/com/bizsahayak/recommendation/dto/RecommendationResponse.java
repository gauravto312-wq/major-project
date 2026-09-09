package com.bizsahayak.recommendation.dto;

import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.tender.dto.TenderDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {

    private String opportunityType; // "SCHEME" or "TENDER"
    private int matchScore; // Percentage 0 - 100
    private List<String> matchReasons;
    private SchemeDto scheme;
    private TenderDto tender;
}
