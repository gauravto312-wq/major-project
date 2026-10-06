package com.bizsahayak.recommendation;

import com.bizsahayak.recommendation.service.RecommendationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RecommendationServiceTest {

    @Test
    @DisplayName("Verify token boundary matching prevents IT matching Hospitality, Sanitation, or Security")
    void testMatchesTokenBoundaryBugFix() {
        String hospitality = "Hospitality, Tourism, Hotel Management";
        String sanitation = "Sanitation, Municipal Services, Waste";
        String security = "Security Systems, Electronics, CCTV";
        String itIndustry = "IT, Software, Cloud Computing";

        assertFalse(RecommendationService.matchesTokenBoundary(hospitality, "IT"), "IT must NOT match Hospitality");
        assertFalse(RecommendationService.matchesTokenBoundary(sanitation, "IT"), "IT must NOT match Sanitation");
        assertFalse(RecommendationService.matchesTokenBoundary(security, "IT"), "IT must NOT match Security");

        assertTrue(RecommendationService.matchesTokenBoundary(itIndustry, "IT"), "IT MUST match IT Software");
        assertTrue(RecommendationService.matchesTokenBoundary(hospitality, "Hospitality"), "Hospitality MUST match Hospitality");
    }

    @Test
    @DisplayName("Verify score threshold is configured to 70%")
    void testScoreThreshold() {
        assertEquals(70, RecommendationService.MATCH_SCORE_THRESHOLD, "Match score threshold must be at least 70%");
    }

    @Test
    @DisplayName("Verify maximum recommendations count is capped at 4")
    void testMaxRecommendationsCount() {
        assertEquals(4, RecommendationService.MAX_RECOMMENDATIONS_COUNT, "Max recommendations returned must be capped at 4");
    }
}
