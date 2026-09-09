package com.bizsahayak.scheme.service;

import com.bizsahayak.admin.AuditLogService;
import com.bizsahayak.category.Category;
import com.bizsahayak.category.CategoryRepository;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.scheme.SchemeStatus;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.scheme.dto.SchemeFilterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchemeService {

    private final SchemeRepository schemeRepository;
    private final CategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

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

        Page<Scheme> page = schemeRepository.filterPublicSchemes(
                publicStatuses,
                filter.getKeyword(),
                filter.getState(),
                filter.getSchemeType(),
                filter.getCategoryId(),
                pageable
        );

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

    public SchemeDto mapToDto(Scheme entity) {
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
                .officialApplicationUrl(entity.getOfficialApplicationUrl())
                .officialSourceUrl(entity.getOfficialSourceUrl())
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
