package com.bizsahayak.government.repository;

import com.bizsahayak.government.model.GovernmentSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GovernmentSourceRepository extends JpaRepository<GovernmentSource, Long> {
    Optional<GovernmentSource> findByProviderCode(String providerCode);
    List<GovernmentSource> findByActiveTrue();
    boolean existsByProviderCode(String providerCode);
}
