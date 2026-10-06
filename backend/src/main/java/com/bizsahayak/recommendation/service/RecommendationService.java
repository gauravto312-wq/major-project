package com.bizsahayak.recommendation.service;

import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.business.service.BusinessService;
import com.bizsahayak.notification.NotificationService;
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
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final BusinessService businessService;
    private final SchemeRepository schemeRepository;
    private final TenderRepository tenderRepository;
    private final SchemeService schemeService;
    private final TenderService tenderService;
    private final NotificationService notificationService;

    public static final int MATCH_SCORE_THRESHOLD = 70; // 70% to 100% threshold
    public static final int MAX_RECOMMENDATIONS_COUNT = 4; // Top 3-4 results

    @Transactional
    public List<RecommendationResponse> getRecommendedSchemes(Long userId) {
        BusinessProfile profile = businessService.getEntityByUserId(userId);
        List<SchemeStatus> activeStatuses = List.of(SchemeStatus.PUBLISHED, SchemeStatus.ACTIVE);

        // Database-side scoping: retrieve active schemes
        List<Scheme> candidateSchemes = schemeRepository.findByStatusIn(activeStatuses, org.springframework.data.domain.Pageable.unpaged()).getContent();

        List<RecommendationResponse> recommendations = new ArrayList<>();

        for (Scheme scheme : candidateSchemes) {
            int score = 0;
            List<String> reasons = new ArrayList<>();

            // 1. Industry match (+35%)
            if (scheme.getTargetIndustries() == null || scheme.getTargetIndustries().isBlank()) {
                score += 25;
                reasons.add("✓ Open to All Industries");
            } else if (matchesTokenBoundary(scheme.getTargetIndustries(), profile.getIndustry())) {
                score += 35;
                reasons.add("✓ Exact Industry Alignment: " + profile.getIndustry());
            }

            // 2. Business Type match (+25%)
            if (scheme.getTargetBusinessTypes() == null || scheme.getTargetBusinessTypes().isBlank()) {
                score += 20;
                reasons.add("✓ Open to All Entity Types");
            } else if (matchesTokenBoundary(scheme.getTargetBusinessTypes(), profile.getBusinessType())) {
                score += 25;
                reasons.add("✓ Business Entity Type Match: " + profile.getBusinessType());
            }

            // 3. Location/State match (+25%)
            if (scheme.getState() == null || scheme.getState().equalsIgnoreCase("All India") ||
                scheme.getState().equalsIgnoreCase(profile.getState())) {
                score += 25;
                reasons.add("✓ Region Eligible: " + (scheme.getState() == null || scheme.getState().equalsIgnoreCase("All India") ? "Pan-India Scheme" : profile.getState()));
            }

            // 4. Active Verified Scheme (+15%)
            score += 15;
            reasons.add("✓ Active Verified Opportunity");

            // Strict threshold: >= 70%
            if (score >= MATCH_SCORE_THRESHOLD) {
                recommendations.add(RecommendationResponse.builder()
                        .opportunityType("SCHEME")
                        .matchScore(score)
                        .matchReasons(reasons)
                        .scheme(schemeService.mapToDto(scheme))
                        .build());

                // Trigger deduplicated notification if top match
                try {
                    notificationService.createRecommendationNotificationIfAbsent(profile.getUser(), scheme, score);
                } catch (Exception e) {
                    log.warn("Failed to generate recommendation notification: {}", e.getMessage());
                }
            }
        }

        // Sort by score descending and return top 3-4 recommendations
        return recommendations.stream()
                .sorted(Comparator.comparingInt(RecommendationResponse::getMatchScore).reversed())
                .limit(MAX_RECOMMENDATIONS_COUNT)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getRecommendedTenders(Long userId) {
        BusinessProfile profile = businessService.getEntityByUserId(userId);
        List<TenderStatus> activeStatuses = List.of(TenderStatus.PUBLISHED, TenderStatus.ACTIVE);

        List<Tender> candidateTenders = tenderRepository.findByStatusIn(activeStatuses, org.springframework.data.domain.Pageable.unpaged()).getContent();

        List<RecommendationResponse> recommendations = new ArrayList<>();

        for (Tender tender : candidateTenders) {
            int score = 0;
            List<String> reasons = new ArrayList<>();

            // 1. Industry match (+35%)
            if (tender.getTargetIndustries() == null || tender.getTargetIndustries().isBlank()) {
                score += 25;
                reasons.add("✓ Open Procurement Opportunity");
            } else if (matchesTokenBoundary(tender.getTargetIndustries(), profile.getIndustry())) {
                score += 35;
                reasons.add("✓ Industry Match: " + profile.getIndustry());
            }

            // 2. Business Type match (+25%)
            if (tender.getTargetBusinessTypes() == null || tender.getTargetBusinessTypes().isBlank()) {
                score += 20;
                reasons.add("✓ Open to All Business Entities");
            } else if (matchesTokenBoundary(tender.getTargetBusinessTypes(), profile.getBusinessType())) {
                score += 25;
                reasons.add("✓ Entity Match: " + profile.getBusinessType());
            }

            // 3. Location/State match (+25%)
            if (tender.getState() == null || tender.getState().equalsIgnoreCase("All India") ||
                tender.getState().equalsIgnoreCase(profile.getState())) {
                score += 25;
                reasons.add("✓ Location Eligible: " + (tender.getState() == null || tender.getState().equalsIgnoreCase("All India") ? "Pan India" : profile.getState()));
            }

            // 4. Active Verified Opportunity (+15%)
            score += 15;
            reasons.add("✓ Verified Procurement Opportunity");

            // Strict threshold: >= 70%
            if (score >= MATCH_SCORE_THRESHOLD) {
                recommendations.add(RecommendationResponse.builder()
                        .opportunityType("TENDER")
                        .matchScore(score)
                        .matchReasons(reasons)
                        .tender(tenderService.mapToDto(tender))
                        .build());
            }
        }

        return recommendations.stream()
                .sorted(Comparator.comparingInt(RecommendationResponse::getMatchScore).reversed())
                .limit(MAX_RECOMMENDATIONS_COUNT)
                .toList();
    }

    /**
     * Fixes naive substring matching bug (e.g. IT matching Hospitality/Sanitation/Security).
     * Performs token splitting and word boundary regex matching.
     */
    public static boolean matchesTokenBoundary(String sourceList, String targetTerm) {
        if (sourceList == null || sourceList.isBlank() || targetTerm == null || targetTerm.isBlank()) {
            return false;
        }

        String cleanTarget = targetTerm.trim().toLowerCase();
        String[] tokens = sourceList.toLowerCase().split("[,;]");

        for (String token : tokens) {
            String trimmedToken = token.trim();
            if (trimmedToken.isEmpty()) continue;

            if (trimmedToken.equalsIgnoreCase(cleanTarget)) {
                return true;
            }

            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(cleanTarget) + "\\b", Pattern.CASE_INSENSITIVE);
            if (pattern.matcher(trimmedToken).find()) {
                return true;
            }
        }

        return false;
    }
}
