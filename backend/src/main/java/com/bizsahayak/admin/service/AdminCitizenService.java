package com.bizsahayak.admin.service;

import com.bizsahayak.admin.dto.CitizenDto;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.notification.NotificationRepository;
import com.bizsahayak.saved.SavedSchemeRepository;
import com.bizsahayak.saved.SavedTenderRepository;
import com.bizsahayak.user.Role;
import com.bizsahayak.user.User;
import com.bizsahayak.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCitizenService {

    private final UserRepository userRepository;
    private final SavedSchemeRepository savedSchemeRepository;
    private final SavedTenderRepository savedTenderRepository;
    private final NotificationRepository notificationRepository;

    private static final List<Role> CITIZEN_ROLES = List.of(Role.ROLE_CITIZEN, Role.ROLE_USER);

    @Transactional(readOnly = true)
    public PageResponse<CitizenDto> getCitizens(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage;

        if (query != null && !query.trim().isEmpty()) {
            userPage = userRepository.searchCitizens(CITIZEN_ROLES, query.trim(), pageable);
        } else {
            userPage = userRepository.findByRoleIn(CITIZEN_ROLES, pageable);
        }

        Page<CitizenDto> dtoPage = userPage.map(this::mapToCitizenDto);
        return PageResponse.from(dtoPage);
    }

    @Transactional(readOnly = true)
    public CitizenDto getCitizenById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen account not found with ID: " + id));

        if (!CITIZEN_ROLES.contains(user.getRole())) {
            throw new ResourceNotFoundException("User with ID " + id + " is not a citizen account");
        }

        return mapToCitizenDto(user);
    }

    private CitizenDto mapToCitizenDto(User user) {
        long savedSchemes = savedSchemeRepository.countByUserId(user.getId());
        long savedTenders = savedTenderRepository.countByUserId(user.getId());
        long notifications = notificationRepository.countByUserId(user.getId());

        return CitizenDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .savedSchemesCount(savedSchemes)
                .trackedApplicationsCount(savedSchemes + savedTenders)
                .notificationsCount(notifications)
                .build();
    }
}
