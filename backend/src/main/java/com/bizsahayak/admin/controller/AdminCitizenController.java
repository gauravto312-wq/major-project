package com.bizsahayak.admin.controller;

import com.bizsahayak.admin.dto.CitizenDto;
import com.bizsahayak.admin.service.AdminCitizenService;
import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.common.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/citizens")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Citizen Management", description = "Endpoints for managing Citizen/User accounts")
public class AdminCitizenController {

    private final AdminCitizenService adminCitizenService;

    @GetMapping
    @Operation(summary = "Get paginated list of citizen accounts with optional search query")
    public ResponseEntity<ApiResponse<PageResponse<CitizenDto>>> getCitizens(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PageResponse<CitizenDto> response = adminCitizenService.getCitizens(query, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single citizen account details")
    public ResponseEntity<ApiResponse<CitizenDto>> getCitizenById(@PathVariable Long id) {
        CitizenDto citizen = adminCitizenService.getCitizenById(id);
        return ResponseEntity.ok(ApiResponse.success(citizen));
    }
}
