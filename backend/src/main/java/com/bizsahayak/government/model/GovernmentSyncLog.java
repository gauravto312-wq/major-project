package com.bizsahayak.government.model;

import com.bizsahayak.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "government_sync_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovernmentSyncLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    private GovernmentSource source;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SyncStatus status;

    @Builder.Default
    private int recordsFetched = 0;

    @Builder.Default
    private int recordsCreated = 0;

    @Builder.Default
    private int recordsUpdated = 0;

    @Builder.Default
    private int recordsSkipped = 0;

    @Builder.Default
    private int recordsFailed = 0;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;
}
