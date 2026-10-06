package com.bizsahayak.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    long countByUserIdAndReadStatusFalse(Long userId);
    long countByUserId(Long userId);
    boolean existsByUserIdAndTitleAndType(Long userId, String title, String type);
    boolean existsByUserIdAndTypeAndEntityTypeAndEntityId(Long userId, String type, String entityType, Long entityId);
}
