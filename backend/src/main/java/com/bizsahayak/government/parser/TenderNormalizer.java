package com.bizsahayak.government.parser;

import com.bizsahayak.category.Category;
import com.bizsahayak.category.CategoryRepository;
import com.bizsahayak.government.dto.RawTenderDto;
import com.bizsahayak.government.model.GovernmentSource;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.tender.TenderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class TenderNormalizer {

    private final CategoryRepository categoryRepository;

    public Tender normalize(RawTenderDto raw, GovernmentSource source) {
        if (raw == null || !StringUtils.hasText(raw.getTitle())) {
            throw new IllegalArgumentException("Tender title cannot be empty");
        }

        String slug = generateSlug(raw.getTitle(), raw.getTenderNumber());

        Category category = null;
        if (StringUtils.hasText(raw.getCategorySlug())) {
            category = categoryRepository.findBySlug(raw.getCategorySlug()).orElse(null);
        }
        if (category == null) {
            category = categoryRepository.findBySlug("it-software-procurement").orElse(null);
        }

        return Tender.builder()
                .title(raw.getTitle().trim())
                .slug(slug)
                .tenderNumber(StringUtils.hasText(raw.getTenderNumber()) ? raw.getTenderNumber().trim() : "TND-" + System.currentTimeMillis())
                .organization(StringUtils.hasText(raw.getOrganization()) ? raw.getOrganization().trim() : "Government Procurement Portal")
                .department(StringUtils.hasText(raw.getDepartment()) ? raw.getDepartment().trim() : "Public Procurement Division")
                .category(category)
                .description(raw.getDescription() != null ? raw.getDescription().trim() : raw.getTitle())
                .location(StringUtils.hasText(raw.getLocation()) ? raw.getLocation().trim() : "India")
                .state(StringUtils.hasText(raw.getState()) ? raw.getState().trim() : "All India")
                .district(StringUtils.hasText(raw.getDistrict()) ? raw.getDistrict().trim() : "Central Region")
                .estimatedValue(raw.getEstimatedValue())
                .publishDate(raw.getPublishDate())
                .closingDate(raw.getClosingDate())
                .eligibility(raw.getEligibility())
                .requiredDocuments(raw.getRequiredDocuments())
                .requirements(raw.getRequirements())
                .officialTenderUrl(raw.getOfficialTenderUrl())
                .officialSourceUrl(StringUtils.hasText(raw.getOfficialSourceUrl()) ? raw.getOfficialSourceUrl() : source.getBaseUrl())
                .status(TenderStatus.PENDING_REVIEW)
                .featured(false)
                .targetIndustries(StringUtils.hasText(raw.getTargetIndustries()) ? raw.getTargetIndustries() : "IT Services, Manufacturing, Infrastructure")
                .targetBusinessTypes(StringUtils.hasText(raw.getTargetBusinessTypes()) ? raw.getTargetBusinessTypes() : "MSME, Private Limited, Partnership")
                .source(source)
                .sourceReferenceId(raw.getSourceReferenceId())
                .sourceLastUpdatedAt(raw.getSourceLastUpdatedAt() != null ? raw.getSourceLastUpdatedAt() : LocalDateTime.now())
                .lastSyncedAt(LocalDateTime.now())
                .build();
    }

    private String generateSlug(String title, String tenderNum) {
        String base = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
        if (base.length() > 140) {
            base = base.substring(0, 140);
        }
        if (StringUtils.hasText(tenderNum)) {
            base += "-" + tenderNum.toLowerCase().replaceAll("[^a-z0-9]", "");
        }
        return base;
    }
}
