package com.bizsahayak.tender;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenderRepository extends JpaRepository<Tender, Long>, JpaSpecificationExecutor<Tender> {
    Optional<Tender> findBySlug(String slug);
    boolean existsBySlug(String slug);

    List<Tender> findTop6ByStatusInAndFeaturedTrueOrderByCreatedAtDesc(List<TenderStatus> statuses);
    List<Tender> findTop6ByStatusInOrderByCreatedAtDesc(List<TenderStatus> statuses);

    Page<Tender> findByStatusIn(List<TenderStatus> statuses, Pageable pageable);

    @Query("SELECT t FROM Tender t WHERE t.status IN :statuses AND " +
           "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.organization) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.tenderNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:state IS NULL OR :state = '' OR LOWER(t.state) = LOWER(:state) OR LOWER(t.state) = 'all india') AND " +
           "(:categoryId IS NULL OR t.category.id = :categoryId)")
    Page<Tender> filterPublicTenders(@Param("statuses") List<TenderStatus> statuses,
                                    @Param("keyword") String keyword,
                                    @Param("state") String state,
                                    @Param("categoryId") Long categoryId,
                                    Pageable pageable);

    Optional<Tender> findBySourceIdAndSourceReferenceId(Long sourceId, String sourceReferenceId);
    Optional<Tender> findByTenderNumber(String tenderNumber);
    Optional<Tender> findByOfficialTenderUrl(String officialTenderUrl);
    Optional<Tender> findByOfficialSourceUrl(String officialSourceUrl);
    Optional<Tender> findByTitleIgnoreCaseAndOrganizationIgnoreCase(String title, String organization);
    Page<Tender> findByStatus(TenderStatus status, Pageable pageable);

    long countByStatus(TenderStatus status);
}
