package com.bizsahayak.tender;

import com.bizsahayak.category.Category;
import com.bizsahayak.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tenders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tender extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(nullable = false, length = 100)
    private String tenderNumber;

    @Column(nullable = false, length = 150)
    private String organization;

    @Column(length = 150)
    private String department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(length = 150)
    private String location;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(length = 100)
    private String district;

    private Double estimatedValue; // In INR e.g. 5000000.0 for 50 Lakhs

    private LocalDate publishDate;
    private LocalDate closingDate;

    @Column(columnDefinition = "TEXT")
    private String eligibility;

    @Column(columnDefinition = "TEXT")
    private String requiredDocuments;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(length = 500)
    private String officialTenderUrl;

    @Column(length = 500)
    private String officialSourceUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private TenderStatus status = TenderStatus.DRAFT;

    @Builder.Default
    @Column(nullable = false)
    private boolean featured = false;

    @Column(length = 255)
    private String targetIndustries;

    @Column(length = 255)
    private String targetBusinessTypes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private com.bizsahayak.government.model.GovernmentSource source;

    @Column(length = 150)
    private String sourceReferenceId;

    private LocalDateTime sourceLastUpdatedAt;
    private LocalDateTime lastSyncedAt;

    private LocalDateTime publishedAt;
}
