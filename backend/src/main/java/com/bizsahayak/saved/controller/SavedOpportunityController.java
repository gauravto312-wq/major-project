package com.bizsahayak.saved.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.saved.service.SavedOpportunityService;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.tender.dto.TenderDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved")
@RequiredArgsConstructor
@Tag(name = "Saved Opportunities", description = "Bookmark Schemes & Tenders")
public class SavedOpportunityController {

    private final SavedOpportunityService savedOpportunityService;

    @PostMapping("/schemes/{schemeId}")
    @Operation(summary = "Bookmark a scheme")
    public ResponseEntity<ApiResponse<Void>> saveScheme(@PathVariable Long schemeId, @AuthenticationPrincipal UserPrincipal currentUser) {
        savedOpportunityService.saveScheme(currentUser.getId(), schemeId);
        return ResponseEntity.ok(ApiResponse.success(null, "Scheme saved successfully"));
    }

    @DeleteMapping("/schemes/{schemeId}")
    @Operation(summary = "Remove bookmark for a scheme")
    public ResponseEntity<ApiResponse<Void>> unsaveScheme(@PathVariable Long schemeId, @AuthenticationPrincipal UserPrincipal currentUser) {
        savedOpportunityService.unsaveScheme(currentUser.getId(), schemeId);
        return ResponseEntity.ok(ApiResponse.success(null, "Scheme removed from saved list"));
    }

    @GetMapping("/schemes")
    @Operation(summary = "Get user's saved schemes")
    public ResponseEntity<ApiResponse<List<SchemeDto>>> getSavedSchemes(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<SchemeDto> list = savedOpportunityService.getSavedSchemes(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/tenders/{tenderId}")
    @Operation(summary = "Bookmark a tender")
    public ResponseEntity<ApiResponse<Void>> saveTender(@PathVariable Long tenderId, @AuthenticationPrincipal UserPrincipal currentUser) {
        savedOpportunityService.saveTender(currentUser.getId(), tenderId);
        return ResponseEntity.ok(ApiResponse.success(null, "Tender saved successfully"));
    }

    @DeleteMapping("/tenders/{tenderId}")
    @Operation(summary = "Remove bookmark for a tender")
    public ResponseEntity<ApiResponse<Void>> unsaveTender(@PathVariable Long tenderId, @AuthenticationPrincipal UserPrincipal currentUser) {
        savedOpportunityService.unsaveTender(currentUser.getId(), tenderId);
        return ResponseEntity.ok(ApiResponse.success(null, "Tender removed from saved list"));
    }

    @GetMapping("/tenders")
    @Operation(summary = "Get user's saved tenders")
    public ResponseEntity<ApiResponse<List<TenderDto>>> getSavedTenders(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<TenderDto> list = savedOpportunityService.getSavedTenders(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
