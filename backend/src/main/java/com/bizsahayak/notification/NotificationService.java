package com.bizsahayak.notification;

import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.user.Role;
import com.bizsahayak.user.User;
import com.bizsahayak.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNewSchemeNotificationForCitizens(Scheme scheme) {
        if (scheme == null || scheme.getId() == null) return;
        String type = "NEW_SCHEME";
        String entityType = "SCHEME";
        Long entityId = scheme.getId();

        List<Role> targetRoles = List.of(Role.ROLE_CITIZEN, Role.ROLE_USER, Role.ROLE_BUSINESS);
        List<User> users = userRepository.findByRoleIn(targetRoles);

        String title = "New Government Scheme Available";
        String message = String.format("'%s' is now available on BizSahayak.", scheme.getTitle());
        String route = "/schemes/" + (scheme.getSlug() != null ? scheme.getSlug() : scheme.getId());

        for (User user : users) {
            if (!notificationRepository.existsByUserIdAndTypeAndEntityTypeAndEntityId(user.getId(), type, entityType, entityId)) {
                createNotification(user, title, message, type, entityType, entityId, route, route);
            }
        }
    }

    @Transactional
    public Notification createNotification(User user, String title, String message, String type, String entityType, Long entityId, String route, String actionUrl) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .entityType(entityType)
                .entityId(entityId)
                .route(route != null ? route : actionUrl)
                .actionUrl(actionUrl != null ? actionUrl : route)
                .readStatus(false)
                .build();
        Notification saved = notificationRepository.save(notification);
        log.info("Created notification for user {}: {}", user.getId(), title);
        return saved;
    }

    @Transactional
    public Notification createNotification(User user, String title, String message, String type, String actionUrl) {
        return createNotification(user, title, message, type, null, null, actionUrl, actionUrl);
    }

    @Transactional
    public void createRecommendationNotificationIfAbsent(User user, Scheme scheme, int score) {
        String type = "RECOMMENDATION";
        String entityType = "SCHEME";
        Long entityId = scheme.getId();

        // Unique check by userId + type + entityType + entityId
        if (!notificationRepository.existsByUserIdAndTypeAndEntityTypeAndEntityId(user.getId(), type, entityType, entityId)) {
            String title = "New scheme recommended for you";
            String message = String.format("'%s' matches your business profile with a %d%% relevance score.",
                    scheme.getTitle(), score);
            String route = "/schemes/" + (scheme.getSlug() != null ? scheme.getSlug() : scheme.getId());

            createNotification(user, title, message, type, entityType, entityId, route, route);
            log.info("Created recommendation notification for user {} and scheme {}", user.getId(), scheme.getId());
        }
    }

    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadStatusFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification", "id", notificationId);
        }
        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setReadStatus(true));
        notificationRepository.saveAll(notifications);
    }
}
