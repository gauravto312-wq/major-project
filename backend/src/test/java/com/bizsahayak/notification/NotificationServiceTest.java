package com.bizsahayak.notification;

import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    @DisplayName("Should create individual scheme recommendation notification if not duplicate")
    void testCreateIndividualSchemeRecommendation() {
        Long userId = 10L;
        Long schemeId = 50L;
        User mockUser = User.builder().id(userId).email("user@test.com").build();
        Scheme mockScheme = Scheme.builder().id(schemeId).title("PM Employment Generation Programme").slug("pmegp").build();

        when(notificationRepository.existsByUserIdAndTypeAndEntityTypeAndEntityId(userId, "RECOMMENDATION", "SCHEME", schemeId))
                .thenReturn(false);

        notificationService.createRecommendationNotificationIfAbsent(mockUser, mockScheme, 85);

        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should skip creating notification if recommendation notification already exists")
    void testSkipDuplicateRecommendationNotification() {
        Long userId = 10L;
        Long schemeId = 50L;
        User mockUser = User.builder().id(userId).email("user@test.com").build();
        Scheme mockScheme = Scheme.builder().id(schemeId).title("PM Employment Generation Programme").slug("pmegp").build();

        when(notificationRepository.existsByUserIdAndTypeAndEntityTypeAndEntityId(userId, "RECOMMENDATION", "SCHEME", schemeId))
                .thenReturn(true);

        notificationService.createRecommendationNotificationIfAbsent(mockUser, mockScheme, 90);

        verify(notificationRepository, never()).save(any(Notification.class));
    }
}
