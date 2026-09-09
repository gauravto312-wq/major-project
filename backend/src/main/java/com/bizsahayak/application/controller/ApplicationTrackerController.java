package com.bizsahayak.application.controller;

import com.bizsahayak.application.ApplicationStatus;
import com.bizsahayak.application.dto.UserApplicationDto;
import com.bizsahayak.application.service.ApplicationTrackerService;
import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Application Tracker", description = "Internal Application Tracking Endpoints")
public class ApplicationTrackerController {

    private final ApplicationTrackerService trackerService;

    @GetMapping
    @Operation(summary = "Get list of tracked applications for current user")
    public ResponseEntity<ApiResponse<List<UserApplicationDto>>> getUserApplications(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<UserApplicationDto> list = trackerService.getUserApplications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    @Operation(summary = "Start tracking a new scheme/tender application")
    public ResponseEntity<ApiResponse<UserApplicationDto>> trackApplication(
            @Valid @RequestBody UserApplicationDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserApplicationDto tracked = trackerService.trackApplication(currentUser.getId(), dto);
        return new ResponseEntity<>(ApiResponse.success(tracked, "Application record added"), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update status of tracked application")
    public ResponseEntity<ApiResponse<UserApplicationDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String notes,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserApplicationDto updated = trackerService.updateStatus(id, currentUser.getId(), status, notes);
        return ResponseEntity.ok(ApiResponse.success(updated, "Status updated"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tracked application record")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        trackerService.deleteApplication(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Application record deleted"));
    }
}
