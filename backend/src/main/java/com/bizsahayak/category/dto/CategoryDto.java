package com.bizsahayak.category.dto;

import com.bizsahayak.category.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String slug;
    private String description;

    @NotNull(message = "Category type is required (SCHEME or TENDER)")
    private CategoryType type;

    private boolean active;
}
