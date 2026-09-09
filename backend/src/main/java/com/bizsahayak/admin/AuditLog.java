package com.bizsahayak.admin;

import com.bizsahayak.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long actorId;

    @Column(length = 150)
    private String actorEmail;

    @Column(nullable = false, length = 100)
    private String action; // e.g. "APPROVE_BUSINESS", "REJECT_BUSINESS", "PUBLISH_SCHEME", "DEACTIVATE_TENDER"

    @Column(length = 100)
    private String entityType; // e.g. "BUSINESS", "SCHEME", "TENDER"

    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String ipAddress;
}
