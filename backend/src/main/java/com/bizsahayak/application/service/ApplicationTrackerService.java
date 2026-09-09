package com.bizsahayak.application.service;

import com.bizsahayak.application.ApplicationStatus;
import com.bizsahayak.application.UserApplication;
import com.bizsahayak.application.UserApplicationRepository;
import com.bizsahayak.application.dto.UserApplicationDto;
import com.bizsahayak.exception.ForbiddenException;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.tender.TenderRepository;
import com.bizsahayak.user.User;
import com.bizsahayak.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationTrackerService {

    private final UserApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;
    private final TenderRepository tenderRepository;

    @Transactional
    public UserApplicationDto trackApplication(Long userId, UserApplicationDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Scheme scheme = null;
        if (dto.getSchemeId() != null) {
            scheme = schemeRepository.findById(dto.getSchemeId()).orElse(null);
        }

        Tender tender = null;
        if (dto.getTenderId() != null) {
            tender = tenderRepository.findById(dto.getTenderId()).orElse(null);
        }

        UserApplication app = UserApplication.builder()
                .user(user)
                .scheme(scheme)
                .tender(tender)
                .title(dto.getTitle())
                .applicationNumber(dto.getApplicationNumber())
                .status(dto.getStatus() != null ? dto.getStatus() : ApplicationStatus.INTERESTED)
                .applicationDate(dto.getApplicationDate() != null ? dto.getApplicationDate() : LocalDate.now())
                .notes(dto.getNotes())
                .build();

        UserApplication saved = applicationRepository.save(app);
        log.info("User {} started tracking application for {}", userId, dto.getTitle());
        return mapToDto(saved);
    }

    @Transactional
    public UserApplicationDto updateStatus(Long applicationId, Long userId, ApplicationStatus newStatus, String notes) {
        UserApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("UserApplication", "id", applicationId));

        if (!app.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to modify this application record");
        }

        app.setStatus(newStatus);
        if (notes != null && !notes.isBlank()) {
            app.setNotes(notes);
        }

        UserApplication saved = applicationRepository.save(app);
        log.info("Updated application {} status to {}", applicationId, newStatus);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<UserApplicationDto> getUserApplications(Long userId) {
        return applicationRepository.findByUserIdOrderByUpdatedAtDesc(userId)
                .stream().map(this::mapToDto).toList();
    }

    @Transactional
    public void deleteApplication(Long applicationId, Long userId) {
        UserApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("UserApplication", "id", applicationId));

        if (!app.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to delete this application record");
        }

        applicationRepository.delete(app);
    }

    public UserApplicationDto mapToDto(UserApplication app) {
        return UserApplicationDto.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .schemeId(app.getScheme() != null ? app.getScheme().getId() : null)
                .schemeTitle(app.getScheme() != null ? app.getScheme().getTitle() : null)
                .tenderId(app.getTender() != null ? app.getTender().getId() : null)
                .tenderTitle(app.getTender() != null ? app.getTender().getTitle() : null)
                .title(app.getTitle())
                .applicationNumber(app.getApplicationNumber())
                .status(app.getStatus())
                .applicationDate(app.getApplicationDate())
                .notes(app.getNotes())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
