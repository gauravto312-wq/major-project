package com.bizsahayak.tender.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.tender.dto.TenderDto;
import com.bizsahayak.tender.dto.TenderFilterRequest;
import com.bizsahayak.tender.service.TenderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tenders")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Tenders", description = "Admin CRUD & Tender Lifecycle Endpoints")
public class AdminTenderController {

    private final TenderService tenderService;

    @GetMapping
    @Operation(summary = "Get all tenders for admin management")
    public ResponseEntity<ApiResponse<PageResponse<TenderDto>>> getAllTenders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        TenderFilterRequest filter = TenderFilterRequest.builder()
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDir(sortDir)
                .build();

        PageResponse<TenderDto> response = tenderService.getAllTendersAdmin(filter);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/pending-review")
    @Operation(summary = "Get tenders pending admin review")
    public ResponseEntity<ApiResponse<PageResponse<TenderDto>>> getPendingReviewTenders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        TenderFilterRequest filter = TenderFilterRequest.builder().page(page).size(size).build();
        PageResponse<TenderDto> response = tenderService.getPendingReviewTenders(filter);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/approve")
    @Operation(summary = "Approve an imported tender for publication")
    public ResponseEntity<ApiResponse<TenderDto>> approveTender(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        TenderDto approved = tenderService.approveTender(id, admin);
        return ResponseEntity.ok(ApiResponse.success(approved, "Tender approved and published successfully"));
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Reject an imported tender")
    public ResponseEntity<ApiResponse<TenderDto>> rejectTender(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        TenderDto rejected = tenderService.rejectTender(id, admin);
        return ResponseEntity.ok(ApiResponse.success(rejected, "Tender rejected successfully"));
    }

    @PostMapping
    @Operation(summary = "Create a new government tender")
    public ResponseEntity<ApiResponse<TenderDto>> createTender(
            @Valid @RequestBody TenderDto dto,
            @AuthenticationPrincipal UserPrincipal admin) {
        TenderDto created = tenderService.createTender(dto, admin);
        return new ResponseEntity<>(ApiResponse.success(created, "Tender created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing tender")
    public ResponseEntity<ApiResponse<TenderDto>> updateTender(
            @PathVariable Long id,
            @Valid @RequestBody TenderDto dto,
            @AuthenticationPrincipal UserPrincipal admin) {
        TenderDto updated = tenderService.updateTender(id, dto, admin);
        return ResponseEntity.ok(ApiResponse.success(updated, "Tender updated successfully"));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish a draft/inactive tender")
    public ResponseEntity<ApiResponse<TenderDto>> publishTender(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        TenderDto published = tenderService.publishTender(id, admin);
        return ResponseEntity.ok(ApiResponse.success(published, "Tender published successfully"));
    }

    @PatchMapping("/{id}/close")
    @Operation(summary = "Mark tender as closed")
    public ResponseEntity<ApiResponse<TenderDto>> closeTender(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        TenderDto closed = tenderService.closeTender(id, admin);
        return ResponseEntity.ok(ApiResponse.success(closed, "Tender closed successfully"));
    }

    @PatchMapping("/{id}/archive")
    @Operation(summary = "Archive a tender")
    public ResponseEntity<ApiResponse<TenderDto>> archiveTender(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        TenderDto archived = tenderService.archiveTender(id, admin);
        return ResponseEntity.ok(ApiResponse.success(archived, "Tender archived successfully"));
    }

    @PatchMapping("/{id}/feature")
    @Operation(summary = "Toggle tender featured status")
    public ResponseEntity<ApiResponse<TenderDto>> toggleFeatured(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        TenderDto updated = tenderService.toggleFeatured(id, admin);
        return ResponseEntity.ok(ApiResponse.success(updated, "Featured status toggled"));
    }
}
