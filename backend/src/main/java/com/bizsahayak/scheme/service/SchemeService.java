package com.bizsahayak.scheme.service;

import com.bizsahayak.admin.AuditLogService;
import com.bizsahayak.application.UserApplication;
import com.bizsahayak.application.UserApplicationRepository;
import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.business.BusinessProfileRepository;
import com.bizsahayak.category.Category;
import com.bizsahayak.category.CategoryRepository;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.document.BusinessDocument;
import com.bizsahayak.document.BusinessDocumentRepository;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.scheme.SchemeStatus;
import com.bizsahayak.scheme.dto.SchemeAssistantDto;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.scheme.dto.SchemeFilterRequest;
import com.bizsahayak.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchemeService {

    private final SchemeRepository schemeRepository;
    private final CategoryRepository categoryRepository;
    private final AuditLogService auditLogService;
    private final BusinessProfileRepository businessProfileRepository;
    private final BusinessDocumentRepository businessDocumentRepository;
    private final UserApplicationRepository userApplicationRepository;
    private final NotificationService notificationService;

    @Transactional
    public SchemeDto createScheme(SchemeDto dto, UserPrincipal admin) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }

        String baseSlug = dto.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        String slug = baseSlug;
        int count = 1;
        while (schemeRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count++;
        }

        SchemeStatus initialStatus = (dto.getStatus() != null) ? dto.getStatus() : SchemeStatus.DRAFT;

        Scheme scheme = Scheme.builder()
                .title(dto.getTitle())
                .slug(slug)
                .description(dto.getDescription())
                .shortDescription(dto.getShortDescription())
                .department(dto.getDepartment())
                .ministry(dto.getMinistry())
                .category(category)
                .schemeType(dto.getSchemeType())
                .state(dto.getState())
                .district(dto.getDistrict())
                .benefits(dto.getBenefits())
                .eligibility(dto.getEligibility())
                .requiredDocuments(dto.getRequiredDocuments())
                .applicationProcess(dto.getApplicationProcess())
                .startDate(dto.getStartDate())
                .deadline(dto.getDeadline())
                .officialApplicationUrl(dto.getOfficialApplicationUrl())
                .officialSourceUrl(dto.getOfficialSourceUrl())
                .status(initialStatus)
                .featured(dto.isFeatured())
                .minInvestment(dto.getMinInvestment())
                .maxInvestment(dto.getMaxInvestment())
                .minTurnover(dto.getMinTurnover())
                .maxTurnover(dto.getMaxTurnover())
                .targetIndustries(dto.getTargetIndustries())
                .targetBusinessTypes(dto.getTargetBusinessTypes())
                .publishedAt(initialStatus == SchemeStatus.PUBLISHED || initialStatus == SchemeStatus.ACTIVE ? LocalDateTime.now() : null)
                .build();

        Scheme saved = schemeRepository.save(scheme);
        log.info("Created scheme {} with status {}", saved.getId(), saved.getStatus());

        if (saved.getStatus() == SchemeStatus.PUBLISHED || saved.getStatus() == SchemeStatus.ACTIVE) {
            notificationService.createNewSchemeNotificationForCitizens(saved);
        }

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "CREATE_SCHEME",
                "SCHEME",
                saved.getId(),
                "Created scheme: " + saved.getTitle() + " (Status: " + saved.getStatus() + ")"
        );

        return mapToDto(saved);
    }

    @Transactional
    public SchemeDto updateScheme(Long id, SchemeDto dto, UserPrincipal admin) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", id));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            scheme.setCategory(category);
        }

        scheme.setTitle(dto.getTitle());
        scheme.setDescription(dto.getDescription());
        scheme.setShortDescription(dto.getShortDescription());
        scheme.setDepartment(dto.getDepartment());
        scheme.setMinistry(dto.getMinistry());
        scheme.setSchemeType(dto.getSchemeType());
        scheme.setState(dto.getState());
        scheme.setDistrict(dto.getDistrict());
        scheme.setBenefits(dto.getBenefits());
        scheme.setEligibility(dto.getEligibility());
        scheme.setRequiredDocuments(dto.getRequiredDocuments());
        scheme.setApplicationProcess(dto.getApplicationProcess());
        scheme.setStartDate(dto.getStartDate());
        scheme.setDeadline(dto.getDeadline());
        scheme.setOfficialApplicationUrl(dto.getOfficialApplicationUrl());
        scheme.setOfficialSourceUrl(dto.getOfficialSourceUrl());
        scheme.setFeatured(dto.isFeatured());
        scheme.setMinInvestment(dto.getMinInvestment());
        scheme.setMaxInvestment(dto.getMaxInvestment());
        scheme.setMinTurnover(dto.getMinTurnover());
        scheme.setMaxTurnover(dto.getMaxTurnover());
        scheme.setTargetIndustries(dto.getTargetIndustries());
        scheme.setTargetBusinessTypes(dto.getTargetBusinessTypes());

        if (dto.getStatus() != null && dto.getStatus() != scheme.getStatus()) {
            scheme.setStatus(dto.getStatus());
            if ((dto.getStatus() == SchemeStatus.PUBLISHED || dto.getStatus() == SchemeStatus.ACTIVE) && scheme.getPublishedAt() == null) {
                scheme.setPublishedAt(LocalDateTime.now());
            }
        }

        Scheme saved = schemeRepository.save(scheme);
        if (saved.getStatus() == SchemeStatus.PUBLISHED || saved.getStatus() == SchemeStatus.ACTIVE) {
            notificationService.createNewSchemeNotificationForCitizens(saved);
        }

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "UPDATE_SCHEME",
                "SCHEME",
                saved.getId(),
                "Updated scheme details for: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional
    public SchemeDto publishScheme(Long id, UserPrincipal admin) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", id));
        scheme.setStatus(SchemeStatus.PUBLISHED);
        if (scheme.getPublishedAt() == null) {
            scheme.setPublishedAt(LocalDateTime.now());
        }
        Scheme saved = schemeRepository.save(scheme);
        notificationService.createNewSchemeNotificationForCitizens(saved);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "PUBLISH_SCHEME",
                "SCHEME",
                saved.getId(),
                "Published scheme: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional
    public SchemeDto deactivateScheme(Long id, UserPrincipal admin) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", id));
        scheme.setStatus(SchemeStatus.INACTIVE);
        Scheme saved = schemeRepository.save(scheme);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "DEACTIVATE_SCHEME",
                "SCHEME",
                saved.getId(),
                "Deactivated scheme: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional
    public SchemeDto archiveScheme(Long id, UserPrincipal admin) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", id));
        scheme.setStatus(SchemeStatus.ARCHIVED);
        Scheme saved = schemeRepository.save(scheme);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "ARCHIVE_SCHEME",
                "SCHEME",
                saved.getId(),
                "Archived scheme: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional
    public SchemeDto toggleFeatured(Long id, UserPrincipal admin) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", id));
        scheme.setFeatured(!scheme.isFeatured());
        Scheme saved = schemeRepository.save(scheme);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "TOGGLE_FEATURED_SCHEME",
                "SCHEME",
                saved.getId(),
                "Toggled featured status for scheme: " + saved.getTitle() + " to " + saved.isFeatured()
        );

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<SchemeDto> getPublicSchemes(SchemeFilterRequest filter) {
        Sort sort = Sort.by(Sort.Direction.fromString(filter.getSortDir()), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        List<SchemeStatus> publicStatuses = List.of(SchemeStatus.PUBLISHED, SchemeStatus.ACTIVE);

        org.springframework.data.jpa.domain.Specification<Scheme> spec = com.bizsahayak.scheme.SchemeSpecification.filterPublicSchemes(
                publicStatuses,
                filter.getKeyword(),
                filter.getState(),
                filter.getSchemeType(),
                filter.getCategoryId()
        );

        if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
            // Fetch candidate matching schemes from DB, then rank by relevance score
            List<Scheme> candidates = schemeRepository.findAll(spec);
            List<Scheme> ranked = com.bizsahayak.scheme.search.SchemeSearchEngine.rankSchemes(candidates, filter.getKeyword());

            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), ranked.size());
            List<Scheme> pageContent = start < ranked.size() ? ranked.subList(start, end) : List.of();

            Page<Scheme> rankedPage = new org.springframework.data.domain.PageImpl<>(
                    pageContent, pageable, ranked.size()
            );

            return PageResponse.from(rankedPage, rankedPage.getContent().stream().map(this::mapToDto).toList());
        }

        Page<Scheme> page = schemeRepository.findAll(spec, pageable);
        return PageResponse.from(page, page.getContent().stream().map(this::mapToDto).toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<SchemeDto> getAllSchemesAdmin(SchemeFilterRequest filter) {
        Sort sort = Sort.by(Sort.Direction.fromString(filter.getSortDir()), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        Page<Scheme> page = schemeRepository.findAll(pageable);
        return PageResponse.from(page, page.getContent().stream().map(this::mapToDto).toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<SchemeDto> getPendingReviewSchemes(SchemeFilterRequest filter) {
        Sort sort = Sort.by(Sort.Direction.fromString(filter.getSortDir()), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        Page<Scheme> page = schemeRepository.findByStatus(SchemeStatus.PENDING_REVIEW, pageable);
        return PageResponse.from(page, page.getContent().stream().map(this::mapToDto).toList());
    }

    @Transactional
    public SchemeDto approveScheme(Long id, UserPrincipal admin) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", id));
        scheme.setStatus(SchemeStatus.PUBLISHED);
        if (scheme.getPublishedAt() == null) {
            scheme.setPublishedAt(LocalDateTime.now());
        }
        Scheme saved = schemeRepository.save(scheme);
        notificationService.createNewSchemeNotificationForCitizens(saved);
        auditLogService.logAction(admin.getId(), admin.getEmail(), "APPROVE_SCHEME", "SCHEME", saved.getId(), "Approved scheme for publication: " + saved.getTitle());
        return mapToDto(saved);
    }

    @Transactional
    public SchemeDto rejectScheme(Long id, UserPrincipal admin) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", id));
        scheme.setStatus(SchemeStatus.REJECTED);
        Scheme saved = schemeRepository.save(scheme);
        auditLogService.logAction(admin.getId(), admin.getEmail(), "REJECT_SCHEME", "SCHEME", saved.getId(), "Rejected scheme: " + saved.getTitle());
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<SchemeDto> getFeaturedSchemes() {
        List<SchemeStatus> publicStatuses = List.of(SchemeStatus.PUBLISHED, SchemeStatus.ACTIVE);
        return schemeRepository.findTop6ByStatusInAndFeaturedTrueOrderByCreatedAtDesc(publicStatuses)
                .stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<SchemeDto> getLatestSchemes() {
        List<SchemeStatus> publicStatuses = List.of(SchemeStatus.PUBLISHED, SchemeStatus.ACTIVE);
        return schemeRepository.findTop6ByStatusInOrderByCreatedAtDesc(publicStatuses)
                .stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public SchemeDto getSchemeBySlug(String slug) {
        Scheme scheme = schemeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "slug", slug));
        return mapToDto(scheme);
    }

    @Transactional(readOnly = true)
    public SchemeDto getSchemeById(Long id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", id));
        return mapToDto(scheme);
    }

    public static String normalizeUrl(String url) {
        if (url == null || url.isBlank()) return null;
        String trimmed = url.trim();
        String lower = trimmed.toLowerCase();
        if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("file:")) {
            return null;
        }
        if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
            return "https://" + trimmed;
        }
        return trimmed;
    }

    @Transactional(readOnly = true)
    public SchemeAssistantDto getAssistantSummary(Long schemeId, Long userId) {
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", schemeId));
        return buildAssistantDto(scheme, userId);
    }

    @Transactional(readOnly = true)
    public SchemeAssistantDto getAssistantSummaryBySlug(String slug, Long userId) {
        Scheme scheme = schemeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "slug", slug));
        return buildAssistantDto(scheme, userId);
    }

    private SchemeAssistantDto buildAssistantDto(Scheme scheme, Long userId) {
        BusinessProfile profile = (userId != null) ? businessProfileRepository.findByUserId(userId).orElse(null) : null;
        Optional<UserApplication> trackerApp = (userId != null) ? userApplicationRepository.findByUserIdAndSchemeId(userId, scheme.getId()) : Optional.empty();

        // 1. Eligibility Checks
        List<SchemeAssistantDto.EligibilityCheckItem> eligibilityChecks = new ArrayList<>();
        int passedEligibility = 0;
        int totalEligibility = 0;

        // Industry Check
        totalEligibility++;
        boolean industryMatch = (scheme.getTargetIndustries() == null || scheme.getTargetIndustries().isBlank()) ||
                (profile != null && matchesTokenBoundary(scheme.getTargetIndustries(), profile.getIndustry()));
        if (industryMatch) passedEligibility++;
        eligibilityChecks.add(SchemeAssistantDto.EligibilityCheckItem.builder()
                .criterion("Industry Sector")
                .value(profile != null ? profile.getIndustry() : "Not specified")
                .passed(industryMatch)
                .message(industryMatch ? "Target industry aligns with scheme eligibility." : "Scheme prioritizes: " + scheme.getTargetIndustries())
                .build());

        // State Check
        totalEligibility++;
        boolean stateMatch = (scheme.getState() == null || scheme.getState().equalsIgnoreCase("All India")) ||
                (profile != null && scheme.getState().equalsIgnoreCase(profile.getState()));
        if (stateMatch) passedEligibility++;
        eligibilityChecks.add(SchemeAssistantDto.EligibilityCheckItem.builder()
                .criterion("Regional State Jurisdiction")
                .value(profile != null ? profile.getState() : "Not specified")
                .passed(stateMatch)
                .message(stateMatch ? "Region is fully eligible." : "Scheme restricted to state: " + scheme.getState())
                .build());

        // Business Entity Type Check
        totalEligibility++;
        boolean typeMatch = (scheme.getTargetBusinessTypes() == null || scheme.getTargetBusinessTypes().isBlank()) ||
                (profile != null && matchesTokenBoundary(scheme.getTargetBusinessTypes(), profile.getBusinessType()));
        if (typeMatch) passedEligibility++;
        eligibilityChecks.add(SchemeAssistantDto.EligibilityCheckItem.builder()
                .criterion("Business Entity Type")
                .value(profile != null ? profile.getBusinessType() : "Not specified")
                .passed(typeMatch)
                .message(typeMatch ? "Entity type matches scheme guidelines." : "Scheme targets: " + scheme.getTargetBusinessTypes())
                .build());

        String rating;
        if (profile == null) {
            rating = "NEEDS_VERIFICATION";
        } else if (passedEligibility == totalEligibility) {
            rating = "ELIGIBLE";
        } else if (passedEligibility >= 2) {
            rating = "LIKELY_ELIGIBLE";
        } else {
            rating = "NOT_ELIGIBLE";
        }

        // 2. Informational Required Documents (No Document Vault dependency)
        List<String> rawDocs = parseRequiredDocuments(scheme.getRequiredDocuments());
        List<SchemeAssistantDto.RequiredDocumentItem> requiredDocumentsList = new ArrayList<>();
        for (String docName : rawDocs) {
            boolean isOptional = docName.toLowerCase().contains("optional");
            String cleanName = docName.replaceAll("(?i)\\(optional\\)", "").trim();
            requiredDocumentsList.add(SchemeAssistantDto.RequiredDocumentItem.builder()
                    .documentName(cleanName)
                    .required(!isOptional)
                    .notes(isOptional ? "Optional supporting document." : "Mandatory document required by official portal.")
                    .build());
        }

        // 3. Step-by-Step Application Process Guide (Data-Driven)
        List<String> applicationSteps = parseApplicationSteps(scheme.getApplicationProcess());

        // URLs: Strict Separation of Official Website vs Direct Application Page
        String safeSourceUrl = normalizeUrl(scheme.getOfficialSourceUrl());
        if (safeSourceUrl == null && scheme.getSource() != null) {
            safeSourceUrl = normalizeUrl(scheme.getSource().getBaseUrl());
        }

        String safeAppUrl = normalizeUrl(scheme.getOfficialApplicationUrl());

        Long daysRemaining = null;
        if (scheme.getDeadline() != null) {
            daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), scheme.getDeadline());
        }

        String appMode = "ONLINE";
        if (scheme.getSchemeType() != null && scheme.getSchemeType().toLowerCase().contains("offline")) {
            appMode = "OFFLINE";
        } else if (scheme.getApplicationProcess() != null && scheme.getApplicationProcess().toLowerCase().contains("offline")) {
            appMode = "BOTH";
        }

        String destinationStatus;
        if (safeAppUrl != null && !safeAppUrl.isBlank()) {
            String appUrlLower = safeAppUrl.toLowerCase();
            String titleLower = scheme.getTitle() != null ? scheme.getTitle().toLowerCase() : "";
            if (appUrlLower.contains("login") || appUrlLower.contains("register") || appUrlLower.contains("beneficiary") || appUrlLower.contains("standupmitra") || appUrlLower.contains("vidyalakshmi") || titleLower.contains("stand up") || titleLower.contains("vidya lakshmi")) {
                destinationStatus = "APPLICATION_LOGIN";
            } else if (appUrlLower.contains("ngoportal") || appUrlLower.contains("champions")) {
                destinationStatus = "PORTAL_REQUIRES_NAVIGATION";
            } else {
                destinationStatus = "DIRECT_APPLICATION";
            }
        } else if (safeSourceUrl != null && !safeSourceUrl.isBlank()) {
            destinationStatus = "OFFICIAL_INFORMATION_ONLY";
        } else {
            destinationStatus = "UNAVAILABLE";
        }

        return SchemeAssistantDto.builder()
                .schemeId(scheme.getId())
                .schemeTitle(scheme.getTitle())
                .slug(scheme.getSlug())
                .department(scheme.getDepartment())
                .ministry(scheme.getMinistry())
                .schemeType(scheme.getSchemeType())
                .categoryName(scheme.getCategory() != null ? scheme.getCategory().getName() : null)
                .officialApplicationUrl(safeAppUrl)
                .officialSourceUrl(safeSourceUrl)
                .eligibilityRating(rating)
                .eligibilityChecks(eligibilityChecks)
                .requiredDocumentsList(requiredDocumentsList)
                .applicationSteps(applicationSteps)
                .rawApplicationProcess(scheme.getApplicationProcess())
                .applicationMode(appMode)
                .applicationDestinationStatus(destinationStatus)
                .deadline(scheme.getDeadline())
                .daysRemaining(daysRemaining)
                .currentTrackerStatus(trackerApp.map(app -> app.getStatus().name()).orElse("NOT_TRACKED"))
                .build();
    }

    private List<String> parseApplicationSteps(String processText) {
        if (processText != null && !processText.isBlank()) {
            List<String> steps = Arrays.stream(processText.split("\\r?\\n+"))
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .toList();
            if (!steps.isEmpty()) {
                return steps;
            }
        }
        // Safe generic fallback steps if scheme-specific detailed steps are missing
        return List.of(
                "Visit the official government application portal.",
                "Create an account / login using the credentials required by the government portal.",
                "Select the relevant scheme/application service.",
                "Fill in the applicant/business details.",
                "Upload the required documents.",
                "Review the application carefully.",
                "Submit the application on the official government portal.",
                "Save the application/reference number.",
                "Return to BizSahayak and update your application tracker."
        );
    }

    private List<String> parseRequiredDocuments(String docsString) {
        if (docsString == null || docsString.isBlank()) {
            return List.of("PAN Card", "Aadhaar Card", "UDYAM Registration");
        }
        return Arrays.stream(docsString.split("[,;\\n]+"))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
    }

    private boolean matchesTokenBoundary(String target, String candidate) {
        if (target == null || candidate == null || candidate.isBlank()) return false;
        Pattern pattern = Pattern.compile("\\b" + Pattern.quote(candidate.trim()) + "\\b", Pattern.CASE_INSENSITIVE);
        return pattern.matcher(target).find();
    }

    public SchemeDto mapToDto(Scheme entity) {
        String safeSourceUrl = normalizeUrl(entity.getOfficialSourceUrl());
        if (safeSourceUrl == null && entity.getSource() != null) {
            safeSourceUrl = normalizeUrl(entity.getSource().getBaseUrl());
        }

        String safeAppUrl = normalizeUrl(entity.getOfficialApplicationUrl());

        return SchemeDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .shortDescription(entity.getShortDescription())
                .department(entity.getDepartment())
                .ministry(entity.getMinistry())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .schemeType(entity.getSchemeType())
                .state(entity.getState())
                .district(entity.getDistrict())
                .benefits(entity.getBenefits())
                .eligibility(entity.getEligibility())
                .requiredDocuments(entity.getRequiredDocuments())
                .applicationProcess(entity.getApplicationProcess())
                .startDate(entity.getStartDate())
                .deadline(entity.getDeadline())
                .officialApplicationUrl(safeAppUrl)
                .officialSourceUrl(safeSourceUrl)
                .status(entity.getStatus())
                .featured(entity.isFeatured())
                .minInvestment(entity.getMinInvestment())
                .maxInvestment(entity.getMaxInvestment())
                .minTurnover(entity.getMinTurnover())
                .maxTurnover(entity.getMaxTurnover())
                .targetIndustries(entity.getTargetIndustries())
                .targetBusinessTypes(entity.getTargetBusinessTypes())
                .sourceName(entity.getSource() != null ? entity.getSource().getName() : null)
                .sourceReferenceId(entity.getSourceReferenceId())
                .sourceLastUpdatedAt(entity.getSourceLastUpdatedAt())
                .lastSyncedAt(entity.getLastSyncedAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .publishedAt(entity.getPublishedAt())
                .build();
    }
}
