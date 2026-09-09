package com.bizsahayak.business;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, Long> {
    Optional<BusinessProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    Page<BusinessProfile> findByVerificationStatus(VerificationStatus status, Pageable pageable);
    long countByVerificationStatus(VerificationStatus status);
}
