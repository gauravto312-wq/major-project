package com.bizsahayak.government.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.government.dto.ApiTestResultDto;
import com.bizsahayak.government.dto.GovernmentSourceDto;
import com.bizsahayak.government.dto.GovernmentSyncLogDto;
import com.bizsahayak.government.dto.SyncResultDto;
import com.bizsahayak.government.service.GovernmentSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/government-sources")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Government Data Sources", description = "Management, Connectivity Testing and Synchronization of Government Sources & Feeds")
public class AdminGovernmentSourceController {

    private final GovernmentSyncService syncService;

    @GetMapping
    @Operation(summary = "Get all configured government data sources")
    public ResponseEntity<ApiResponse<List<GovernmentSourceDto>>> getAllSources() {
        List<GovernmentSourceDto> sources = syncService.getAllSources();
        return ResponseEntity.ok(ApiResponse.success(sources));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a specific government data source")
    public ResponseEntity<ApiResponse<GovernmentSourceDto>> getSourceById(@PathVariable Long id) {
        GovernmentSourceDto source = syncService.getSourceById(id);
        return ResponseEntity.ok(ApiResponse.success(source));
    }

    @PostMapping
    @Operation(summary = "Configure a new government data source / API")
    public ResponseEntity<ApiResponse<GovernmentSourceDto>> createSource(@Valid @RequestBody GovernmentSourceDto dto) {
        GovernmentSourceDto created = syncService.createSource(dto);
        return new ResponseEntity<>(ApiResponse.success(created, "Government source configured successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing government source / API configuration")
    public ResponseEntity<ApiResponse<GovernmentSourceDto>> updateSource(
            @PathVariable Long id,
            @Valid @RequestBody GovernmentSourceDto dto) {
        GovernmentSourceDto updated = syncService.updateSource(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Government source updated successfully"));
    }

    @PostMapping("/{id}/test")
    @Operation(summary = "Test connectivity, HTTP status code and response payload for a government source API")
    public ResponseEntity<ApiResponse<ApiTestResultDto>> testSourceApi(@PathVariable Long id) {
        ApiTestResultDto result = syncService.testSourceApi(id);
        return ResponseEntity.ok(ApiResponse.success(result, result.isWorking() ? "API Test Successful" : "API Test Failed"));
    }

    @PostMapping("/{id}/sync")
    @Operation(summary = "Trigger immediate manual synchronization for a government source")
    public ResponseEntity<ApiResponse<SyncResultDto>> triggerSync(@PathVariable Long id) {
        SyncResultDto result = syncService.triggerSync(id);
        return ResponseEntity.ok(ApiResponse.success(result, "Synchronization cycle completed"));
    }

    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate a government source for synchronization")
    public ResponseEntity<ApiResponse<GovernmentSourceDto>> activateSource(@PathVariable Long id) {
        GovernmentSourceDto source = syncService.updateSourceStatus(id, true);
        return ResponseEntity.ok(ApiResponse.success(source, "Source activated successfully"));
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a government source")
    public ResponseEntity<ApiResponse<GovernmentSourceDto>> deactivateSource(@PathVariable Long id) {
        GovernmentSourceDto source = syncService.updateSourceStatus(id, false);
        return ResponseEntity.ok(ApiResponse.success(source, "Source deactivated successfully"));
    }

    @GetMapping("/{id}/sync-logs")
    @Operation(summary = "Get sync history logs for a specific government source")
    public ResponseEntity<ApiResponse<List<GovernmentSyncLogDto>>> getSyncLogs(@PathVariable Long id) {
        List<GovernmentSyncLogDto> logs = syncService.getSyncLogsForSource(id);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
