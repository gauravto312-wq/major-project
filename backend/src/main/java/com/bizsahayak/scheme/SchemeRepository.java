package com.bizsahayak.scheme;

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
public interface SchemeRepository extends JpaRepository<Scheme, Long>, JpaSpecificationExecutor<Scheme> {
    Optional<Scheme> findBySlug(String slug);
    boolean existsBySlug(String slug);

    List<Scheme> findTop6ByStatusInAndFeaturedTrueOrderByCreatedAtDesc(List<SchemeStatus> statuses);
    List<Scheme> findTop6ByStatusInOrderByCreatedAtDesc(List<SchemeStatus> statuses);

    Page<Scheme> findByStatusIn(List<SchemeStatus> statuses, Pageable pageable);

    @Query("SELECT s FROM Scheme s WHERE s.status IN :statuses AND " +
           "(:keyword IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.department) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:state IS NULL OR :state = '' OR LOWER(s.state) = LOWER(:state) OR LOWER(s.state) = 'all india') AND " +
           "(:schemeType IS NULL OR :schemeType = '' OR LOWER(s.schemeType) = LOWER(:schemeType)) AND " +
           "(:categoryId IS NULL OR s.category.id = :categoryId)")
    Page<Scheme> filterPublicSchemes(@Param("statuses") List<SchemeStatus> statuses,
                                     @Param("keyword") String keyword,
                                     @Param("state") String state,
                                     @Param("schemeType") String schemeType,
                                     @Param("categoryId") Long categoryId,
                                     Pageable pageable);

    Optional<Scheme> findBySourceIdAndSourceReferenceId(Long sourceId, String sourceReferenceId);
    Optional<Scheme> findByOfficialApplicationUrl(String officialApplicationUrl);
    Optional<Scheme> findByOfficialSourceUrl(String officialSourceUrl);
    Optional<Scheme> findByTitleIgnoreCaseAndDepartmentIgnoreCase(String title, String department);
    Page<Scheme> findByStatus(SchemeStatus status, Pageable pageable);

    long countByStatus(SchemeStatus status);
}
