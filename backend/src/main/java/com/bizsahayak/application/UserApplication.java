package com.bizsahayak.application;

import com.bizsahayak.common.BaseEntity;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserApplication extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id")
    private Scheme scheme;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tender_id")
    private Tender tender;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 100)
    private String applicationNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.INTERESTED;

    private LocalDate applicationDate;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
