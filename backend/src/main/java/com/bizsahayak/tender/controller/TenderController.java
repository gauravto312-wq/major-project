package com.bizsahayak.tender.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.tender.dto.TenderDto;
import com.bizsahayak.tender.dto.TenderFilterRequest;
import com.bizsahayak.tender.service.TenderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenders")
@RequiredArgsConstructor
@Tag(name = "Public Tenders", description = "Public Government Tenders Discovery Endpoint")
public class TenderController {

    private final TenderService tenderService;

    @GetMapping
    @Operation(summary = "Search & filter public published tenders")
    public ResponseEntity<ApiResponse<PageResponse<TenderDto>>> getTenders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        TenderFilterRequest filter = TenderFilterRequest.builder()
                .keyword(keyword)
                .state(state)
                .categoryId(categoryId)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDir(sortDir)
                .build();

        PageResponse<TenderDto> response = tenderService.getPublicTenders(filter);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured public tenders")
    public ResponseEntity<ApiResponse<List<TenderDto>>> getFeaturedTenders() {
        List<TenderDto> list = tenderService.getFeaturedTenders();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest published public tenders")
    public ResponseEntity<ApiResponse<List<TenderDto>>> getLatestTenders() {
        List<TenderDto> list = tenderService.getLatestTenders();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get tender details by unique slug")
    public ResponseEntity<ApiResponse<TenderDto>> getTenderBySlug(@PathVariable String slug) {
        TenderDto dto = tenderService.getTenderBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tender details by ID")
    public ResponseEntity<ApiResponse<TenderDto>> getTenderById(@PathVariable Long id) {
        TenderDto dto = tenderService.getTenderById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
