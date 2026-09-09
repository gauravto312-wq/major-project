package com.bizsahayak.saved;

import com.bizsahayak.common.BaseEntity;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saved_tenders", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "tender_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedTender extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "tender_id", nullable = false)
    private Tender tender;
}
