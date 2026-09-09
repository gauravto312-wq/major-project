package com.bizsahayak.government.model;

import com.bizsahayak.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "government_sources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovernmentSource extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, unique = true, length = 50)
    private String providerCode; // e.g. MY_SCHEME_APISETU, DATA_GOV_IN, CPPP_TENDERS

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private GovernmentSourceType sourceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private GovernmentContentType contentType;

    @Column(nullable = false, length = 500)
    private String baseUrl;

    @Column(length = 500)
    private String apiUrl;

    @Column(length = 500)
    private String documentationUrl;

    @Column(length = 500)
    private String termsUrl;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String authenticationType = "NONE"; // NONE, API_KEY, OAUTH2

    @Column(length = 100)
    private String credentialReference; // Reference variable name, e.g. GOV_DATA_API_KEY (no plaintext secret)

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Builder.Default
    @Column(length = 50)
    private String syncFrequency = "0 0 */6 * * *"; // Every 6 hours

    @Column(length = 255)
    private String rateLimitNotes;

    private LocalDateTime lastSyncAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private SyncStatus lastSyncStatus;
}
