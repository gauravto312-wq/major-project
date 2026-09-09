package com.bizsahayak.saved;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedSchemeRepository extends JpaRepository<SavedScheme, Long> {
    List<SavedScheme> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<SavedScheme> findByUserIdAndSchemeId(Long userId, Long schemeId);
    boolean existsByUserIdAndSchemeId(Long userId, Long schemeId);
    void deleteByUserIdAndSchemeId(Long userId, Long schemeId);
}
