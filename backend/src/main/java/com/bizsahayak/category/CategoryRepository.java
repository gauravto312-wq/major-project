package com.bizsahayak.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByTypeAndActiveTrueOrderByNameAsc(CategoryType type);
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
