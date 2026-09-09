package com.bizsahayak.category.controller;

import com.bizsahayak.category.CategoryType;
import com.bizsahayak.category.dto.CategoryDto;
import com.bizsahayak.category.service.CategoryService;
import com.bizsahayak.common.ApiResponse;
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
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Scheme & Tender Categories Endpoint")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get categories filtered by type (SCHEME or TENDER)")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories(@RequestParam(required = false) CategoryType type) {
        List<CategoryDto> categories = (type != null)
                ? categoryService.getCategoriesByType(type)
                : categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping
    @Operation(summary = "Create a new category (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@Valid @RequestBody CategoryDto dto) {
        CategoryDto created = categoryService.createCategory(dto);
        return new ResponseEntity<>(ApiResponse.success(created, "Category created successfully"), HttpStatus.CREATED);
    }
}
