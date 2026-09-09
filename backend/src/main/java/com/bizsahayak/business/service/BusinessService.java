package com.bizsahayak.business.service;

import com.bizsahayak.admin.AuditLogService;
import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.business.BusinessProfileRepository;
import com.bizsahayak.business.VerificationStatus;
import com.bizsahayak.business.dto.BusinessProfileDto;
import com.bizsahayak.business.dto.VerificationReviewDto;
import com.bizsahayak.common.PageResponse;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.exception.ValidationException;
import com.bizsahayak.notification.NotificationService;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.user.User;
import com.bizsahayak.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessProfileRepository businessProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public BusinessProfileDto createOrUpdateProfile(Long userId, BusinessProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        BusinessProfile profile = businessProfileRepository.findByUserId(userId)
                .orElseGet(() -> BusinessProfile.builder()
                        .user(user)
                        .verificationStatus(VerificationStatus.NOT_SUBMITTED)
                        .build());

        profile.setBusinessName(dto.getBusinessName());
        profile.setBusinessType(dto.getBusinessType());
        profile.setIndustry(dto.getIndustry());
        profile.setState(dto.getState());
        profile.setDistrict(dto.getDistrict());
        profile.setBusinessEmail(dto.getBusinessEmail());
        profile.setPhone(dto.getPhone());
        profile.setWebsite(dto.getWebsite());
        profile.setBusinessDescription(dto.getBusinessDescription());
        profile.setTurnoverRange(dto.getTurnoverRange());
        profile.setInvestmentRange(dto.getInvestmentRange());
        profile.setEmployeeCount(dto.getEmployeeCount());

        BusinessProfile saved = businessProfileRepository.save(profile);
        log.info("Saved business profile for user id {}: {}", userId, saved.getBusinessName());
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public BusinessProfileDto getProfileByUserId(Long userId) {
        BusinessProfile profile = businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Business profile not found for user id: " + userId));
        return mapToDto(profile);
    }

    @Transactional(readOnly = true)
    public BusinessProfile getEntityByUserId(Long userId) {
        return businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Business profile not found for user id: " + userId));
    }

    @Transactional
    public BusinessProfileDto submitForVerification(Long userId) {
        BusinessProfile profile = businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ValidationException("Please complete your business profile before submitting for verification"));

        profile.setVerificationStatus(VerificationStatus.PENDING);
        profile.setSubmittedAt(LocalDateTime.now());
        profile.setRejectionReason(null);

        BusinessProfile saved = businessProfileRepository.save(profile);
        log.info("Business profile {} submitted for verification", saved.getId());

        notificationService.createNotification(
                profile.getUser(),
                "Verification Submitted",
                "Your business profile has been submitted for admin verification. We will review your application shortly.",
                "VERIFICATION",
                "/business/profile"
        );

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<BusinessProfileDto> getPendingVerifications(int page, int size) {
        Page<BusinessProfile> pendingPage = businessProfileRepository.findByVerificationStatus(
                VerificationStatus.PENDING, PageRequest.of(page, size)
        );
        return PageResponse.from(pendingPage, pendingPage.getContent().stream().map(this::mapToDto).toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<BusinessProfileDto> getAllBusinesses(int page, int size) {
        Page<BusinessProfile> pageResult = businessProfileRepository.findAll(PageRequest.of(page, size));
        return PageResponse.from(pageResult, pageResult.getContent().stream().map(this::mapToDto).toList());
    }

    @Transactional(readOnly = true)
    public BusinessProfileDto getBusinessProfileById(Long id) {
        BusinessProfile profile = businessProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BusinessProfile", "id", id));
        return mapToDto(profile);
    }

    @Transactional
    public BusinessProfileDto approveBusiness(Long id, UserPrincipal admin, VerificationReviewDto reviewDto) {
        BusinessProfile profile = businessProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BusinessProfile", "id", id));

        profile.setVerificationStatus(VerificationStatus.VERIFIED);
        profile.setVerifiedAt(LocalDateTime.now());
        profile.setRejectionReason(null);

        BusinessProfile saved = businessProfileRepository.save(profile);

        notificationService.createNotification(
                profile.getUser(),
                "Business Verification Approved! 🎉",
                "Congratulations! Your business profile has been verified. You now have full access to personalized scheme & tender recommendations.",
                "VERIFICATION",
                "/business/dashboard"
        );

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "APPROVE_BUSINESS",
                "BUSINESS",
                saved.getId(),
                "Approved business verification for: " + saved.getBusinessName()
        );

        return mapToDto(saved);
    }

    @Transactional
    public BusinessProfileDto rejectBusiness(Long id, UserPrincipal admin, VerificationReviewDto reviewDto) {
        BusinessProfile profile = businessProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BusinessProfile", "id", id));

        String reason = (reviewDto != null && reviewDto.getRejectionReason() != null)
                ? reviewDto.getRejectionReason()
                : "Submitted documents or information did not meet verification guidelines.";

        profile.setVerificationStatus(VerificationStatus.REJECTED);
        profile.setRejectionReason(reason);

        BusinessProfile saved = businessProfileRepository.save(profile);

        notificationService.createNotification(
                profile.getUser(),
                "Business Verification Rejected",
                "Your business verification application was rejected. Reason: " + reason,
                "VERIFICATION",
                "/business/profile"
        );

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "REJECT_BUSINESS",
                "BUSINESS",
                saved.getId(),
                "Rejected business verification for: " + saved.getBusinessName() + ". Reason: " + reason
        );

        return mapToDto(saved);
    }

    @Transactional
    public BusinessProfileDto requestCorrection(Long id, UserPrincipal admin, VerificationReviewDto reviewDto) {
        BusinessProfile profile = businessProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BusinessProfile", "id", id));

        String reason = (reviewDto != null && reviewDto.getRejectionReason() != null)
                ? reviewDto.getRejectionReason()
                : "Additional information or updated documents are required.";

        profile.setVerificationStatus(VerificationStatus.CORRECTION_REQUIRED);
        profile.setRejectionReason(reason);

        BusinessProfile saved = businessProfileRepository.save(profile);

        notificationService.createNotification(
                profile.getUser(),
                "Action Required: Business Profile Correction Needed",
                "Please update your business profile or documents as requested by admin. Details: " + reason,
                "VERIFICATION",
                "/business/profile"
        );

        auditLogService.logAction(
                admin.getId(),
                admin.getEmail(),
                "REQUEST_CORRECTION_BUSINESS",
                "BUSINESS",
                saved.getId(),
                "Requested correction for business: " + saved.getBusinessName() + ". Details: " + reason
        );

        return mapToDto(saved);
    }

    public BusinessProfileDto mapToDto(BusinessProfile entity) {
        return BusinessProfileDto.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .businessName(entity.getBusinessName())
                .businessType(entity.getBusinessType())
                .industry(entity.getIndustry())
                .state(entity.getState())
                .district(entity.getDistrict())
                .businessEmail(entity.getBusinessEmail())
                .phone(entity.getPhone())
                .website(entity.getWebsite())
                .businessDescription(entity.getBusinessDescription())
                .turnoverRange(entity.getTurnoverRange())
                .investmentRange(entity.getInvestmentRange())
                .employeeCount(entity.getEmployeeCount())
                .verificationStatus(entity.getVerificationStatus())
                .rejectionReason(entity.getRejectionReason())
                .submittedAt(entity.getSubmittedAt())
                .verifiedAt(entity.getVerifiedAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
