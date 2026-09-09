package com.bizsahayak.government.parser;

import com.bizsahayak.category.Category;
import com.bizsahayak.category.CategoryRepository;
import com.bizsahayak.government.dto.RawSchemeDto;
import com.bizsahayak.government.model.GovernmentSource;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class SchemeNormalizer {

    private final CategoryRepository categoryRepository;

    public Scheme normalize(RawSchemeDto raw, GovernmentSource source) {
        if (raw == null || !StringUtils.hasText(raw.getTitle())) {
            throw new IllegalArgumentException("Scheme title cannot be empty");
        }

        String slug = generateSlug(raw.getTitle(), raw.getSourceReferenceId());

        Category category = null;
        if (StringUtils.hasText(raw.getCategorySlug())) {
            category = categoryRepository.findBySlug(raw.getCategorySlug()).orElse(null);
        }
        if (category == null) {
            category = categoryRepository.findBySlug("msme-small-business").orElse(null);
        }

        return Scheme.builder()
                .title(sanitize(raw.getTitle(), 195))
                .slug(slug)
                .shortDescription(raw.getShortDescription() != null ? sanitize(raw.getShortDescription(), 480) : sanitize(raw.getDescription(), 480))
                .description(raw.getDescription() != null ? raw.getDescription().trim() : raw.getTitle())
                .department(StringUtils.hasText(raw.getDepartment()) ? sanitize(raw.getDepartment(), 145) : "Ministry of MSME")
                .ministry(StringUtils.hasText(raw.getMinistry()) ? sanitize(raw.getMinistry(), 145) : "Government of India")
                .category(category)
                .schemeType(StringUtils.hasText(raw.getSchemeType()) ? sanitize(raw.getSchemeType(), 95) : "Subsidy")
                .state(StringUtils.hasText(raw.getState()) ? sanitize(raw.getState(), 95) : "All India")
                .district(StringUtils.hasText(raw.getDistrict()) ? sanitize(raw.getDistrict(), 95) : "All Districts")
                .benefits(raw.getBenefits())
                .eligibility(raw.getEligibility())
                .requiredDocuments(raw.getRequiredDocuments())
                .applicationProcess(raw.getApplicationProcess())
                .startDate(raw.getStartDate())
                .deadline(raw.getDeadline())
                .officialApplicationUrl(raw.getOfficialApplicationUrl())
                .officialSourceUrl(StringUtils.hasText(raw.getOfficialSourceUrl()) ? raw.getOfficialSourceUrl() : source.getBaseUrl())
                .status(SchemeStatus.PENDING_REVIEW) // Default to admin review queue
                .featured(false)
                .targetIndustries(StringUtils.hasText(raw.getTargetIndustries()) ? sanitize(raw.getTargetIndustries(), 245) : "MSME, Manufacturing, Agriculture")
                .targetBusinessTypes(StringUtils.hasText(raw.getTargetBusinessTypes()) ? sanitize(raw.getTargetBusinessTypes(), 245) : "MSME, Proprietorship, Private Limited")
                .source(source)
                .sourceReferenceId(raw.getSourceReferenceId())
                .sourceLastUpdatedAt(raw.getSourceLastUpdatedAt() != null ? raw.getSourceLastUpdatedAt() : LocalDateTime.now())
                .lastSyncedAt(LocalDateTime.now())
                .build();
    }

    private String generateSlug(String title, String refId) {
        String base = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
        if (base.length() > 150) {
            base = base.substring(0, 150);
        }
        if (StringUtils.hasText(refId)) {
            base += "-" + refId.toLowerCase().replaceAll("[^a-z0-9]", "");
        }
        return base;
    }

    private String sanitize(String text, int maxLength) {
        if (!StringUtils.hasText(text)) return "";
        String trimmed = text.trim();
        return trimmed.length() <= maxLength ? trimmed : trimmed.substring(0, maxLength) + "...";
    }
}
