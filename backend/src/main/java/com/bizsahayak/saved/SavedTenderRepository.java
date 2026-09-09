package com.bizsahayak.saved;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedTenderRepository extends JpaRepository<SavedTender, Long> {
    List<SavedTender> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<SavedTender> findByUserIdAndTenderId(Long userId, Long tenderId);
    boolean existsByUserIdAndTenderId(Long userId, Long tenderId);
    void deleteByUserIdAndTenderId(Long userId, Long tenderId);
}
