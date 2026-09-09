package com.bizsahayak.recommendation.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.recommendation.dto.RecommendationResponse;
import com.bizsahayak.recommendation.service.RecommendationService;
import com.bizsahayak.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/business/recommendations")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('BUSINESS', 'ADMIN')")
@Tag(name = "Business Recommendations", description = "Rule-Based Opportunity Matching Engine")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/schemes")
    @Operation(summary = "Get personalized scheme recommendations for business profile")
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getRecommendedSchemes(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<RecommendationResponse> list = recommendationService.getRecommendedSchemes(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/tenders")
    @Operation(summary = "Get personalized tender recommendations for business profile")
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getRecommendedTenders(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<RecommendationResponse> list = recommendationService.getRecommendedTenders(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
