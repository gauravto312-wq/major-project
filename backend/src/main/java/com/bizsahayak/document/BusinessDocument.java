package com.bizsahayak.document;

import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "business_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private BusinessProfile businessProfile;

    @Column(nullable = false, length = 100)
    private String documentType; // e.g. "GST Certificate", "Udyam Registration", "PAN Card", "Turnover Certificate", "Other"

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false, length = 255)
    private String fileStorageName;

    @Column(nullable = false, length = 255)
    private String fileUrl;

    private long fileSize;

    @Column(length = 100)
    private String contentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    private LocalDateTime uploadedAt;
    private LocalDateTime verifiedAt;

    @PrePersist
    protected void onDocumentCreate() {
        super.onCreate();
        if (this.uploadedAt == null) {
            this.uploadedAt = LocalDateTime.now();
        }
    }
}
