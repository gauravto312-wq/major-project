package com.bizsahayak.admin.controller;

import com.bizsahayak.admin.AuditLog;
import com.bizsahayak.admin.AuditLogService;
import com.bizsahayak.admin.dto.DashboardStatsDto;
import com.bizsahayak.business.BusinessProfileRepository;
import com.bizsahayak.business.VerificationStatus;
import com.bizsahayak.business.dto.BusinessProfileDto;
import com.bizsahayak.business.dto.VerificationReviewDto;
import com.bizsahayak.business.service.BusinessService;
import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.document.BusinessDocumentRepository;
import com.bizsahayak.document.DocumentStatus;
import com.bizsahayak.document.dto.DocumentDto;
import com.bizsahayak.document.service.DocumentService;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.scheme.SchemeStatus;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.tender.TenderRepository;
import com.bizsahayak.tender.TenderStatus;
import com.bizsahayak.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Operations", description = "Dashboard Statistics, Business Verifications & Audit Logs")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final SchemeRepository schemeRepository;
    private final TenderRepository tenderRepository;
    private final BusinessDocumentRepository documentRepository;
    private final BusinessService businessService;
    private final DocumentService documentService;
    private final AuditLogService auditLogService;

    @GetMapping("/stats")
    @Operation(summary = "Get overall platform analytics & database statistics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalBusinesses(businessProfileRepository.count())
                .pendingBusinesses(businessProfileRepository.countByVerificationStatus(VerificationStatus.PENDING))
                .verifiedBusinesses(businessProfileRepository.countByVerificationStatus(VerificationStatus.VERIFIED))
                .totalSchemes(schemeRepository.count())
                .activeSchemes(schemeRepository.countByStatus(SchemeStatus.ACTIVE) + schemeRepository.countByStatus(SchemeStatus.PUBLISHED))
                .draftSchemes(schemeRepository.countByStatus(SchemeStatus.DRAFT))
                .totalTenders(tenderRepository.count())
                .activeTenders(tenderRepository.countByStatus(TenderStatus.ACTIVE) + tenderRepository.countByStatus(TenderStatus.PUBLISHED))
                .closedTenders(tenderRepository.countByStatus(TenderStatus.CLOSED))
                .pendingDocuments(documentRepository.countByStatus(DocumentStatus.PENDING))
                .build();

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/businesses/pending")
    @Operation(summary = "Get businesses with PENDING verification status")
    public ResponseEntity<ApiResponse<PageResponse<BusinessProfileDto>>> getPendingBusinesses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PageResponse<BusinessProfileDto> pending = businessService.getPendingVerifications(page, size);
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @GetMapping("/businesses")
    @Operation(summary = "Get all registered business profiles")
    public ResponseEntity<ApiResponse<PageResponse<BusinessProfileDto>>> getAllBusinesses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PageResponse<BusinessProfileDto> all = businessService.getAllBusinesses(page, size);
        return ResponseEntity.ok(ApiResponse.success(all));
    }

    @GetMapping("/businesses/{id}")
    @Operation(summary = "Get single business details with documents for review")
    public ResponseEntity<ApiResponse<BusinessProfileDto>> getBusinessById(@PathVariable Long id) {
        BusinessProfileDto dto = businessService.getBusinessProfileById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/businesses/{id}/documents")
    @Operation(summary = "Get documents for a specific business")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getBusinessDocuments(@PathVariable Long id) {
        List<DocumentDto> docs = documentService.getDocumentsByBusinessId(id);
        return ResponseEntity.ok(ApiResponse.success(docs));
    }

    @PatchMapping("/businesses/{id}/approve")
    @Operation(summary = "Approve business verification application")
    public ResponseEntity<ApiResponse<BusinessProfileDto>> approveBusiness(
            @PathVariable Long id,
            @RequestBody(required = false) VerificationReviewDto reviewDto,
            @AuthenticationPrincipal UserPrincipal admin) {
        BusinessProfileDto approved = businessService.approveBusiness(id, admin, reviewDto);
        return ResponseEntity.ok(ApiResponse.success(approved, "Business verification approved"));
    }

    @PatchMapping("/businesses/{id}/reject")
    @Operation(summary = "Reject business verification application")
    public ResponseEntity<ApiResponse<BusinessProfileDto>> rejectBusiness(
            @PathVariable Long id,
            @RequestBody(required = false) VerificationReviewDto reviewDto,
            @AuthenticationPrincipal UserPrincipal admin) {
        BusinessProfileDto rejected = businessService.rejectBusiness(id, admin, reviewDto);
        return ResponseEntity.ok(ApiResponse.success(rejected, "Business verification rejected"));
    }

    @PatchMapping("/businesses/{id}/request-correction")
    @Operation(summary = "Request corrections for business verification")
    public ResponseEntity<ApiResponse<BusinessProfileDto>> requestCorrection(
            @PathVariable Long id,
            @RequestBody(required = false) VerificationReviewDto reviewDto,
            @AuthenticationPrincipal UserPrincipal admin) {
        BusinessProfileDto updated = businessService.requestCorrection(id, admin, reviewDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Correction request sent to business"));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get system audit logs")
    public ResponseEntity<ApiResponse<PageResponse<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<AuditLog> logs = auditLogService.getAuditLogs(page, size);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
