package com.bizsahayak.citizen.controller;

import com.bizsahayak.citizen.dto.CitizenDashboardDto;
import com.bizsahayak.citizen.service.CitizenDashboardService;
import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.scheme.dto.SchemeFilterRequest;
import com.bizsahayak.scheme.service.SchemeService;
import com.bizsahayak.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
@Tag(name = "Citizen Portal", description = "Dashboard, New Schemes & Citizen Account Operations")
public class CitizenDashboardController {

    private final CitizenDashboardService citizenDashboardService;
    private final SchemeService schemeService;

    @GetMapping("/dashboard")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get aggregated Citizen Dashboard data")
    public ResponseEntity<ApiResponse<CitizenDashboardDto>> getCitizenDashboard(@AuthenticationPrincipal UserPrincipal user) {
        CitizenDashboardDto dashboard = citizenDashboardService.getCitizenDashboard(user.getId());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/new-schemes")
    @Operation(summary = "Get newly published government schemes ordered newest first")
    public ResponseEntity<ApiResponse<PageResponse<SchemeDto>>> getNewSchemes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        SchemeFilterRequest filter = SchemeFilterRequest.builder()
                .page(page)
                .size(size)
                .sortBy("createdAt")
                .sortDir("DESC")
                .build();
        PageResponse<SchemeDto> schemes = schemeService.getPublicSchemes(filter);
        return ResponseEntity.ok(ApiResponse.success(schemes));
    }
}
