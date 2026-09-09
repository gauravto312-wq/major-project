package com.bizsahayak.business.controller;

import com.bizsahayak.business.dto.BusinessProfileDto;
import com.bizsahayak.business.service.BusinessService;
import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
@Tag(name = "Business Profile", description = "Business & MSME Profile Endpoints")
public class BusinessController {

    private final BusinessService businessService;

    @GetMapping("/profile")
    @Operation(summary = "Get current business profile")
    @PreAuthorize("hasAnyRole('BUSINESS', 'ADMIN')")
    public ResponseEntity<ApiResponse<BusinessProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        BusinessProfileDto dto = businessService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/profile")
    @Operation(summary = "Create or update business profile")
    @PreAuthorize("hasAnyRole('BUSINESS', 'ADMIN')")
    public ResponseEntity<ApiResponse<BusinessProfileDto>> saveProfile(
            @Valid @RequestBody BusinessProfileDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        BusinessProfileDto saved = businessService.createOrUpdateProfile(currentUser.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success(saved, "Business profile saved successfully"));
    }

    @PostMapping("/submit-verification")
    @Operation(summary = "Submit business profile and documents for verification")
    @PreAuthorize("hasAnyRole('BUSINESS', 'ADMIN')")
    public ResponseEntity<ApiResponse<BusinessProfileDto>> submitForVerification(@AuthenticationPrincipal UserPrincipal currentUser) {
        BusinessProfileDto updated = businessService.submitForVerification(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(updated, "Submitted for verification"));
    }
}
