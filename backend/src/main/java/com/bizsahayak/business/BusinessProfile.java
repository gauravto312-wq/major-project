package com.bizsahayak.business;

import com.bizsahayak.common.BaseEntity;
import com.bizsahayak.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "business_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 150)
    private String businessName;

    @Column(nullable = false, length = 100)
    private String businessType; // e.g. MSME, Proprietorship, Partnership, Private Limited, LLP, Individual Enterprise

    @Column(nullable = false, length = 100)
    private String industry; // e.g. Food Processing, Manufacturing, IT Services, Textile, Agriculture, Renewable Energy

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(length = 150)
    private String businessEmail;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String website;

    @Column(columnDefinition = "TEXT")
    private String businessDescription;

    @Column(length = 50)
    private String turnoverRange; // e.g. "Below ₹10 Lakh", "₹10 Lakh - ₹50 Lakh", "₹50 Lakh - ₹1 Crore", "₹1 Crore - ₹5 Crore", "Above ₹5 Crore"

    @Column(length = 50)
    private String investmentRange; // e.g. "Below ₹10 Lakh", "₹10 Lakh - ₹50 Lakh", "₹50 Lakh - ₹2 Crore", "Above ₹2 Crore"

    @Column(length = 50)
    private String employeeCount; // e.g. "1-10", "11-50", "51-200", "200+"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.NOT_SUBMITTED;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    private LocalDateTime submittedAt;
    private LocalDateTime verifiedAt;
}
