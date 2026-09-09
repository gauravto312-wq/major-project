package com.bizsahayak.scheme.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.scheme.dto.SchemeFilterRequest;
import com.bizsahayak.scheme.service.SchemeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
@Tag(name = "Public Schemes", description = "Public Government Schemes & Subsidies Discovery Endpoint")
public class SchemeController {

    private final SchemeService schemeService;

    @GetMapping
    @Operation(summary = "Search & filter public published schemes")
    public ResponseEntity<ApiResponse<PageResponse<SchemeDto>>> getSchemes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String schemeType,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        SchemeFilterRequest filter = SchemeFilterRequest.builder()
                .keyword(keyword)
                .state(state)
                .schemeType(schemeType)
                .categoryId(categoryId)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDir(sortDir)
                .build();

        PageResponse<SchemeDto> response = schemeService.getPublicSchemes(filter);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured public schemes")
    public ResponseEntity<ApiResponse<List<SchemeDto>>> getFeaturedSchemes() {
        List<SchemeDto> list = schemeService.getFeaturedSchemes();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest published public schemes")
    public ResponseEntity<ApiResponse<List<SchemeDto>>> getLatestSchemes() {
        List<SchemeDto> list = schemeService.getLatestSchemes();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get scheme details by unique slug")
    public ResponseEntity<ApiResponse<SchemeDto>> getSchemeBySlug(@PathVariable String slug) {
        SchemeDto dto = schemeService.getSchemeBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get scheme details by ID")
    public ResponseEntity<ApiResponse<SchemeDto>> getSchemeById(@PathVariable Long id) {
        SchemeDto dto = schemeService.getSchemeById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
