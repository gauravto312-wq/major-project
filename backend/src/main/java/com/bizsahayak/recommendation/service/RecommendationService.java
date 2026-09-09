package com.bizsahayak.recommendation.service;

import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.business.service.BusinessService;
import com.bizsahayak.recommendation.dto.RecommendationResponse;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.scheme.SchemeStatus;
import com.bizsahayak.scheme.service.SchemeService;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.tender.TenderRepository;
import com.bizsahayak.tender.TenderStatus;
import com.bizsahayak.tender.service.TenderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final BusinessService businessService;
    private final SchemeRepository schemeRepository;
    private final TenderRepository tenderRepository;
    private final SchemeService schemeService;
    private final TenderService tenderService;

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getRecommendedSchemes(Long userId) {
        BusinessProfile profile = businessService.getEntityByUserId(userId);
        List<SchemeStatus> activeStatuses = List.of(SchemeStatus.PUBLISHED, SchemeStatus.ACTIVE);
        List<Scheme> allSchemes = schemeRepository.findAll().stream()
                .filter(s -> activeStatuses.contains(s.getStatus()))
                .toList();

        List<RecommendationResponse> recommendations = new ArrayList<>();

        for (Scheme scheme : allSchemes) {
            int score = 0;
            List<String> reasons = new ArrayList<>();

            // 1. Industry match (+35%)
            if (scheme.getTargetIndustries() == null || scheme.getTargetIndustries().isBlank() ||
                containsIgnoreCase(scheme.getTargetIndustries(), profile.getIndustry())) {
                score += 35;
                reasons.add("✓ Industry Match: " + profile.getIndustry());
            }

            // 2. Business Type match (+25%)
            if (scheme.getTargetBusinessTypes() == null || scheme.getTargetBusinessTypes().isBlank() ||
                containsIgnoreCase(scheme.getTargetBusinessTypes(), profile.getBusinessType())) {
                score += 25;
                reasons.add("✓ Business Type Match: " + profile.getBusinessType());
            }

            // 3. Location/State match (+25%)
            if (scheme.getState() == null || scheme.getState().equalsIgnoreCase("All India") ||
                scheme.getState().equalsIgnoreCase(profile.getState())) {
                score += 25;
                reasons.add("✓ Region Eligible: " + (scheme.getState().equalsIgnoreCase("All India") ? "All India Scheme" : profile.getState()));
            }

            // 4. Base Active Eligibility (+15%)
            score += 15;
            reasons.add("✓ Active Government Opportunity");

            if (score >= 40) { // Return relevant matches
                recommendations.add(RecommendationResponse.builder()
                        .opportunityType("SCHEME")
                        .matchScore(score)
                        .matchReasons(reasons)
                        .scheme(schemeService.mapToDto(scheme))
                        .build());
            }
        }

        recommendations.sort(Comparator.comparingInt(RecommendationResponse::getMatchScore).reversed());
        return recommendations;
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getRecommendedTenders(Long userId) {
        BusinessProfile profile = businessService.getEntityByUserId(userId);
        List<TenderStatus> activeStatuses = List.of(TenderStatus.PUBLISHED, TenderStatus.ACTIVE);
        List<Tender> allTenders = tenderRepository.findAll().stream()
                .filter(t -> activeStatuses.contains(t.getStatus()))
                .toList();

        List<RecommendationResponse> recommendations = new ArrayList<>();

        for (Tender tender : allTenders) {
            int score = 0;
            List<String> reasons = new ArrayList<>();

            // 1. Industry match (+35%)
            if (tender.getTargetIndustries() == null || tender.getTargetIndustries().isBlank() ||
                containsIgnoreCase(tender.getTargetIndustries(), profile.getIndustry())) {
                score += 35;
                reasons.add("✓ Industry Alignment: " + profile.getIndustry());
            }

            // 2. Business Type match (+25%)
            if (tender.getTargetBusinessTypes() == null || tender.getTargetBusinessTypes().isBlank() ||
                containsIgnoreCase(tender.getTargetBusinessTypes(), profile.getBusinessType())) {
                score += 25;
                reasons.add("✓ Entity Criteria Met: " + profile.getBusinessType());
            }

            // 3. Location/State match (+25%)
            if (tender.getState() == null || tender.getState().equalsIgnoreCase("All India") ||
                tender.getState().equalsIgnoreCase(profile.getState())) {
                score += 25;
                reasons.add("✓ Tender Location Match: " + (tender.getState().equalsIgnoreCase("All India") ? "Pan India" : profile.getState()));
            }

            // 4. Base Active Eligibility (+15%)
            score += 15;
            reasons.add("✓ Verified Procurement Opportunity");

            if (score >= 40) {
                recommendations.add(RecommendationResponse.builder()
                        .opportunityType("TENDER")
                        .matchScore(score)
                        .matchReasons(reasons)
                        .tender(tenderService.mapToDto(tender))
                        .build());
            }
        }

        recommendations.sort(Comparator.comparingInt(RecommendationResponse::getMatchScore).reversed());
        return recommendations;
    }

    private boolean containsIgnoreCase(String source, String target) {
        if (source == null || target == null) return false;
        return source.toLowerCase().contains(target.toLowerCase());
    }
}
