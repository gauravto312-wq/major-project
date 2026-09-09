package com.bizsahayak.scheme.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.scheme.dto.SchemeFilterRequest;
import com.bizsahayak.scheme.service.SchemeService;
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
@RequestMapping("/api/admin/schemes")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Schemes", description = "Admin CRUD & Scheme Lifecycle Endpoints")
public class AdminSchemeController {

    private final SchemeService schemeService;

    @GetMapping
    @Operation(summary = "Get all schemes for admin management (includes DRAFT, INACTIVE, ARCHIVED)")
    public ResponseEntity<ApiResponse<PageResponse<SchemeDto>>> getAllSchemes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        SchemeFilterRequest filter = SchemeFilterRequest.builder()
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDir(sortDir)
                .build();

        PageResponse<SchemeDto> response = schemeService.getAllSchemesAdmin(filter);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/pending-review")
    @Operation(summary = "Get schemes pending admin review")
    public ResponseEntity<ApiResponse<PageResponse<SchemeDto>>> getPendingReviewSchemes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        SchemeFilterRequest filter = SchemeFilterRequest.builder().page(page).size(size).build();
        PageResponse<SchemeDto> response = schemeService.getPendingReviewSchemes(filter);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/approve")
    @Operation(summary = "Approve an imported scheme for publication")
    public ResponseEntity<ApiResponse<SchemeDto>> approveScheme(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        SchemeDto approved = schemeService.approveScheme(id, admin);
        return ResponseEntity.ok(ApiResponse.success(approved, "Scheme approved and published successfully"));
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Reject an imported scheme")
    public ResponseEntity<ApiResponse<SchemeDto>> rejectScheme(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        SchemeDto rejected = schemeService.rejectScheme(id, admin);
        return ResponseEntity.ok(ApiResponse.success(rejected, "Scheme rejected successfully"));
    }

    @PostMapping
    @Operation(summary = "Create a new government scheme")
    public ResponseEntity<ApiResponse<SchemeDto>> createScheme(
            @Valid @RequestBody SchemeDto dto,
            @AuthenticationPrincipal UserPrincipal admin) {
        SchemeDto created = schemeService.createScheme(dto, admin);
        return new ResponseEntity<>(ApiResponse.success(created, "Scheme created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing government scheme")
    public ResponseEntity<ApiResponse<SchemeDto>> updateScheme(
            @PathVariable Long id,
            @Valid @RequestBody SchemeDto dto,
            @AuthenticationPrincipal UserPrincipal admin) {
        SchemeDto updated = schemeService.updateScheme(id, dto, admin);
        return ResponseEntity.ok(ApiResponse.success(updated, "Scheme updated successfully"));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish a draft/inactive scheme")
    public ResponseEntity<ApiResponse<SchemeDto>> publishScheme(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        SchemeDto published = schemeService.publishScheme(id, admin);
        return ResponseEntity.ok(ApiResponse.success(published, "Scheme published successfully"));
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate an active scheme")
    public ResponseEntity<ApiResponse<SchemeDto>> deactivateScheme(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        SchemeDto deactivated = schemeService.deactivateScheme(id, admin);
        return ResponseEntity.ok(ApiResponse.success(deactivated, "Scheme deactivated successfully"));
    }

    @PatchMapping("/{id}/archive")
    @Operation(summary = "Archive a scheme")
    public ResponseEntity<ApiResponse<SchemeDto>> archiveScheme(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        SchemeDto archived = schemeService.archiveScheme(id, admin);
        return ResponseEntity.ok(ApiResponse.success(archived, "Scheme archived successfully"));
    }

    @PatchMapping("/{id}/feature")
    @Operation(summary = "Toggle scheme featured status")
    public ResponseEntity<ApiResponse<SchemeDto>> toggleFeatured(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal admin) {
        SchemeDto updated = schemeService.toggleFeatured(id, admin);
        return ResponseEntity.ok(ApiResponse.success(updated, "Featured status toggled"));
    }
}
