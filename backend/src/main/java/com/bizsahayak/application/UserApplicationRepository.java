package com.bizsahayak.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserApplicationRepository extends JpaRepository<UserApplication, Long> {
    List<UserApplication> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<UserApplication> findByUserIdAndSchemeId(Long userId, Long schemeId);
    Optional<UserApplication> findByUserIdAndTenderId(Long userId, Long tenderId);
    long countByUserId(Long userId);
}
