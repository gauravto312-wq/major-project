package com.bizsahayak.government.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.government.dto.GovernmentSourceDto;
import com.bizsahayak.government.dto.GovernmentSyncLogDto;
import com.bizsahayak.government.dto.SyncResultDto;
import com.bizsahayak.government.service.GovernmentSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/government-sources")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Government Data Sources", description = "Management and Synchronization of Government Sources & Feeds")
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
