package com.bizsahayak.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessDocumentRepository extends JpaRepository<BusinessDocument, Long> {
    List<BusinessDocument> findByBusinessProfileId(Long businessId);
    long countByBusinessProfileId(Long businessId);
    long countByStatus(DocumentStatus status);
}
