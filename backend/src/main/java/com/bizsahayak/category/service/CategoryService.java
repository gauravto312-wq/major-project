package com.bizsahayak.category.service;

import com.bizsahayak.category.Category;
import com.bizsahayak.category.CategoryRepository;
import com.bizsahayak.category.CategoryType;
import com.bizsahayak.category.dto.CategoryDto;
import com.bizsahayak.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesByType(CategoryType type) {
        return categoryRepository.findByTypeAndActiveTrueOrderByNameAsc(type)
                .stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::mapToDto).toList();
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        String slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        Category category = Category.builder()
                .name(dto.getName())
                .slug(slug)
                .description(dto.getDescription())
                .type(dto.getType())
                .active(true)
                .build();
        return mapToDto(categoryRepository.save(category));
    }

    public CategoryDto mapToDto(Category entity) {
        return CategoryDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .type(entity.getType())
                .active(entity.isActive())
                .build();
    }
}
