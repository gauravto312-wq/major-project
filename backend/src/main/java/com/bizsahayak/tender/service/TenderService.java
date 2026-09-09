package com.bizsahayak.tender.service;

import com.bizsahayak.admin.AuditLogService;
import com.bizsahayak.category.Category;
import com.bizsahayak.category.CategoryRepository;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.tender.TenderRepository;
import com.bizsahayak.tender.TenderStatus;
import com.bizsahayak.tender.dto.TenderDto;
import com.bizsahayak.tender.dto.TenderFilterRequest;
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
public class TenderService {

    private final TenderRepository tenderRepository;
    private final CategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public TenderDto createTender(TenderDto dto, UserPrincipal admin) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }

        String baseSlug = dto.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        String slug = baseSlug;
        int count = 1;
        while (tenderRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count++;
        }

        TenderStatus initialStatus = (dto.getStatus() != null) ? dto.getStatus() : TenderStatus.DRAFT;

        Tender tender = Tender.builder()
                .title(dto.getTitle())
                .slug(slug)
                .tenderNumber(dto.getTenderNumber())
                .organization(dto.getOrganization())
                .department(dto.getDepartment())
                .category(category)
                .description(dto.getDescription())
                .location(dto.getLocation())
                .state(dto.getState())
                .district(dto.getDistrict())
                .estimatedValue(dto.getEstimatedValue())
                .publishDate(dto.getPublishDate())
                .closingDate(dto.getClosingDate())
                .eligibility(dto.getEligibility())
                .requiredDocuments(dto.getRequiredDocuments())
                .requirements(dto.getRequirements())
                .officialTenderUrl(dto.getOfficialTenderUrl())
                .officialSourceUrl(dto.getOfficialSourceUrl())
                .status(initialStatus)
                .featured(dto.isFeatured())
                .targetIndustries(dto.getTargetIndustries())
                .targetBusinessTypes(dto.getTargetBusinessTypes())
                .publishedAt(initialStatus == TenderStatus.PUBLISHED || initialStatus == TenderStatus.ACTIVE ? LocalDateTime.now() : null)
                .build();

        Tender saved = tenderRepository.save(tender);
        log.info("Created tender {} with status {}", saved.getId(), saved.getStatus());

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "CREATE_TENDER",
                "TENDER",
                saved.getId(),
                "Created tender: " + saved.getTitle() + " (" + saved.getTenderNumber() + ")"
        );

        return mapToDto(saved);
    }

    @Transactional
    public TenderDto updateTender(Long id, TenderDto dto, UserPrincipal admin) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", id));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            tender.setCategory(category);
        }

        tender.setTitle(dto.getTitle());
        tender.setTenderNumber(dto.getTenderNumber());
        tender.setOrganization(dto.getOrganization());
        tender.setDepartment(dto.getDepartment());
        tender.setDescription(dto.getDescription());
        tender.setLocation(dto.getLocation());
        tender.setState(dto.getState());
        tender.setDistrict(dto.getDistrict());
        tender.setEstimatedValue(dto.getEstimatedValue());
        tender.setPublishDate(dto.getPublishDate());
        tender.setClosingDate(dto.getClosingDate());
        tender.setEligibility(dto.getEligibility());
        tender.setRequiredDocuments(dto.getRequiredDocuments());
        tender.setRequirements(dto.getRequirements());
        tender.setOfficialTenderUrl(dto.getOfficialTenderUrl());
        tender.setOfficialSourceUrl(dto.getOfficialSourceUrl());
        tender.setFeatured(dto.isFeatured());
        tender.setTargetIndustries(dto.getTargetIndustries());
        tender.setTargetBusinessTypes(dto.getTargetBusinessTypes());

        if (dto.getStatus() != null && dto.getStatus() != tender.getStatus()) {
            tender.setStatus(dto.getStatus());
            if ((dto.getStatus() == TenderStatus.PUBLISHED || dto.getStatus() == TenderStatus.ACTIVE) && tender.getPublishedAt() == null) {
                tender.setPublishedAt(LocalDateTime.now());
            }
        }

        Tender saved = tenderRepository.save(tender);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "UPDATE_TENDER",
                "TENDER",
                saved.getId(),
                "Updated tender: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional
    public TenderDto publishTender(Long id, UserPrincipal admin) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", id));
        tender.setStatus(TenderStatus.PUBLISHED);
        if (tender.getPublishedAt() == null) {
            tender.setPublishedAt(LocalDateTime.now());
        }
        Tender saved = tenderRepository.save(tender);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "PUBLISH_TENDER",
                "TENDER",
                saved.getId(),
                "Published tender: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional
    public TenderDto closeTender(Long id, UserPrincipal admin) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", id));
        tender.setStatus(TenderStatus.CLOSED);
        Tender saved = tenderRepository.save(tender);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "CLOSE_TENDER",
                "TENDER",
                saved.getId(),
                "Closed tender: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional
    public TenderDto archiveTender(Long id, UserPrincipal admin) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", id));
        tender.setStatus(TenderStatus.ARCHIVED);
        Tender saved = tenderRepository.save(tender);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "ARCHIVE_TENDER",
                "TENDER",
                saved.getId(),
                "Archived tender: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional
    public TenderDto toggleFeatured(Long id, UserPrincipal admin) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", id));
        tender.setFeatured(!tender.isFeatured());
        Tender saved = tenderRepository.save(tender);

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "TOGGLE_FEATURED_TENDER",
                "TENDER",
                saved.getId(),
                "Toggled featured status for tender: " + saved.getTitle()
        );

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<TenderDto> getPublicTenders(TenderFilterRequest filter) {
        Sort sort = Sort.by(Sort.Direction.fromString(filter.getSortDir()), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        List<TenderStatus> publicStatuses = List.of(TenderStatus.PUBLISHED, TenderStatus.ACTIVE);

        Page<Tender> page = tenderRepository.filterPublicTenders(
                publicStatuses,
                filter.getKeyword(),
                filter.getState(),
                filter.getCategoryId(),
                pageable
        );

        return PageResponse.from(page, page.getContent().stream().map(this::mapToDto).toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<TenderDto> getAllTendersAdmin(TenderFilterRequest filter) {
        Sort sort = Sort.by(Sort.Direction.fromString(filter.getSortDir()), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        Page<Tender> page = tenderRepository.findAll(pageable);
        return PageResponse.from(page, page.getContent().stream().map(this::mapToDto).toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<TenderDto> getPendingReviewTenders(TenderFilterRequest filter) {
        Sort sort = Sort.by(Sort.Direction.fromString(filter.getSortDir()), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        Page<Tender> page = tenderRepository.findByStatus(TenderStatus.PENDING_REVIEW, pageable);
        return PageResponse.from(page, page.getContent().stream().map(this::mapToDto).toList());
    }

    @Transactional
    public TenderDto approveTender(Long id, UserPrincipal admin) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", id));
        tender.setStatus(TenderStatus.PUBLISHED);
        if (tender.getPublishedAt() == null) {
            tender.setPublishedAt(LocalDateTime.now());
        }
        Tender saved = tenderRepository.save(tender);
        auditLogService.logAction(admin.getId(), admin.getEmail(), "APPROVE_TENDER", "TENDER", saved.getId(), "Approved tender for publication: " + saved.getTitle());
        return mapToDto(saved);
    }

    @Transactional
    public TenderDto rejectTender(Long id, UserPrincipal admin) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", id));
        tender.setStatus(TenderStatus.REJECTED);
        Tender saved = tenderRepository.save(tender);
        auditLogService.logAction(admin.getId(), admin.getEmail(), "REJECT_TENDER", "TENDER", saved.getId(), "Rejected tender: " + saved.getTitle());
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<TenderDto> getFeaturedTenders() {
        List<TenderStatus> publicStatuses = List.of(TenderStatus.PUBLISHED, TenderStatus.ACTIVE);
        return tenderRepository.findTop6ByStatusInAndFeaturedTrueOrderByCreatedAtDesc(publicStatuses)
                .stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<TenderDto> getLatestTenders() {
        List<TenderStatus> publicStatuses = List.of(TenderStatus.PUBLISHED, TenderStatus.ACTIVE);
        return tenderRepository.findTop6ByStatusInOrderByCreatedAtDesc(publicStatuses)
                .stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public TenderDto getTenderBySlug(String slug) {
        Tender tender = tenderRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "slug", slug));
        return mapToDto(tender);
    }

    @Transactional(readOnly = true)
    public TenderDto getTenderById(Long id) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", id));
        return mapToDto(tender);
    }

    public TenderDto mapToDto(Tender entity) {
        return TenderDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .tenderNumber(entity.getTenderNumber())
                .organization(entity.getOrganization())
                .department(entity.getDepartment())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .description(entity.getDescription())
                .location(entity.getLocation())
                .state(entity.getState())
                .district(entity.getDistrict())
                .estimatedValue(entity.getEstimatedValue())
                .publishDate(entity.getPublishDate())
                .closingDate(entity.getClosingDate())
                .eligibility(entity.getEligibility())
                .requiredDocuments(entity.getRequiredDocuments())
                .requirements(entity.getRequirements())
                .officialTenderUrl(entity.getOfficialTenderUrl())
                .officialSourceUrl(entity.getOfficialSourceUrl())
                .status(entity.getStatus())
                .featured(entity.isFeatured())
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
