package com.bizsahayak.citizen.service;

import com.bizsahayak.application.ApplicationStatus;
import com.bizsahayak.application.UserApplication;
import com.bizsahayak.application.UserApplicationRepository;
import com.bizsahayak.citizen.dto.CitizenDashboardDto;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.notification.Notification;
import com.bizsahayak.notification.NotificationRepository;
import com.bizsahayak.saved.SavedScheme;
import com.bizsahayak.saved.SavedSchemeRepository;
import com.bizsahayak.saved.SavedTender;
import com.bizsahayak.saved.SavedTenderRepository;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.scheme.SchemeStatus;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.scheme.service.SchemeService;
import com.bizsahayak.tender.TenderRepository;
import com.bizsahayak.tender.dto.TenderDto;
import com.bizsahayak.tender.service.TenderService;
import com.bizsahayak.user.User;
import com.bizsahayak.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CitizenDashboardService {

    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;
    private final TenderRepository tenderRepository;
    private final SchemeService schemeService;
    private final TenderService tenderService;
    private final SavedSchemeRepository savedSchemeRepository;
    private final SavedTenderRepository savedTenderRepository;
    private final UserApplicationRepository userApplicationRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public CitizenDashboardDto getCitizenDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        long savedSchemesCount = savedSchemeRepository.countByUserId(userId);
        long savedTendersCount = savedTenderRepository.countByUserId(userId);
        long trackedAppsCount = userApplicationRepository.countByUserId(userId);
        long unreadNotifs = notificationRepository.countByUserIdAndReadStatusFalse(userId);

        List<SchemeDto> newSchemes = schemeService.getLatestSchemes();

        // Application status breakdown
        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("INTERESTED", userApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.INTERESTED));
        statusCounts.put("PREPARING", userApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.PREPARING));
        statusCounts.put("APPLIED", userApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED));
        statusCounts.put("COMPLETED", userApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.COMPLETED));

        // Upcoming deadlines
        List<SchemeStatus> publicStatuses = List.of(SchemeStatus.PUBLISHED, SchemeStatus.ACTIVE);
        List<Scheme> upcomingSchemes = schemeRepository.findByStatusInAndDeadlineGreaterThanEqualOrderByDeadlineAsc(
                publicStatuses, LocalDate.now(), PageRequest.of(0, 5)
        );
        List<SchemeDto> upcomingDtos = upcomingSchemes.stream().map(schemeService::mapToDto).toList();

        // Recent Notifications
        List<Notification> recentNotifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (recentNotifs.size() > 5) {
            recentNotifs = recentNotifs.subList(0, 5);
        }

        // Saved Schemes
        List<SavedScheme> savedSchemeEntities = savedSchemeRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<SchemeDto> savedSchemeDtos = savedSchemeEntities.stream()
                .map(ss -> schemeService.mapToDto(ss.getScheme()))
                .toList();

        // Saved Tenders
        List<SavedTender> savedTenderEntities = savedTenderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<TenderDto> savedTenderDtos = savedTenderEntities.stream()
                .map(st -> tenderService.mapToDto(st.getTender()))
                .toList();

        return CitizenDashboardDto.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .savedSchemesCount(savedSchemesCount)
                .savedTendersCount(savedTendersCount)
                .totalTrackedApplicationsCount(trackedAppsCount)
                .unreadNotificationsCount(unreadNotifs)
                .newSchemes(newSchemes)
                .trackedStatusCounts(statusCounts)
                .upcomingDeadlines(upcomingDtos)
                .recentNotifications(recentNotifs)
                .savedSchemes(savedSchemeDtos)
                .savedTenders(savedTenderDtos)
                .build();
    }
}
