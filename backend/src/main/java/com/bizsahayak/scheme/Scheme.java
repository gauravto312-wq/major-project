package com.bizsahayak.scheme;

import com.bizsahayak.category.Category;
import com.bizsahayak.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scheme extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(length = 500)
    private String shortDescription;

    @Column(nullable = false, length = 150)
    private String department;

    @Column(length = 150)
    private String ministry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 100)
    private String schemeType; // e.g. Subsidy, Grant, Loan, Equity, Tax Exemption

    @Column(nullable = false, length = 100)
    private String state; // e.g. All India, Uttar Pradesh, Maharashtra, etc.

    @Column(length = 100)
    private String district;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(columnDefinition = "TEXT")
    private String eligibility;

    @Column(columnDefinition = "TEXT")
    private String requiredDocuments;

    @Column(columnDefinition = "TEXT")
    private String applicationProcess;

    private LocalDate startDate;
    private LocalDate deadline;

    @Column(length = 500)
    private String officialApplicationUrl;

    @Column(length = 500)
    private String officialSourceUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SchemeStatus status = SchemeStatus.DRAFT;

    @Builder.Default
    @Column(nullable = false)
    private boolean featured = false;

    // Rule-based Matching Fields
    private Double minInvestment;
    private Double maxInvestment;
    private Double minTurnover;
    private Double maxTurnover;

    @Column(length = 255)
    private String targetIndustries; // Comma separated e.g. "Food Processing, Manufacturing, Agriculture"

    @Column(length = 255)
    private String targetBusinessTypes; // Comma separated e.g. "MSME, Proprietorship, Partnership, Private Limited"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private com.bizsahayak.government.model.GovernmentSource source;

    @Column(length = 150)
    private String sourceReferenceId;

    private LocalDateTime sourceLastUpdatedAt;
    private LocalDateTime lastSyncedAt;

    private LocalDateTime publishedAt;
}
