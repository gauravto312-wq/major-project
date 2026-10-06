package com.bizsahayak.notification;

import com.bizsahayak.common.BaseEntity;
import com.bizsahayak.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(length = 50)
    private String type; // e.g. "RECOMMENDATION", "VERIFICATION_APPROVED", "VERIFICATION_REJECTED", "CORRECTION_REQUIRED", "APPLICATION_UPDATE"

    @Column(length = 50)
    private String entityType; // e.g. "SCHEME", "BUSINESS", "APPLICATION"

    private Long entityId;

    @Column(length = 255)
    private String route; // e.g. "/schemes/pmfme-food-processing-scheme" or "/business/profile"

    @Column(length = 255)
    private String actionUrl;

    @Builder.Default
    @Column(nullable = false)
    private boolean readStatus = false;
}
