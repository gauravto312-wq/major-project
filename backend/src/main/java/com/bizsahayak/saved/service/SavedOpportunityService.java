package com.bizsahayak.saved.service;

import com.bizsahayak.exception.DuplicateResourceException;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.saved.SavedScheme;
import com.bizsahayak.saved.SavedSchemeRepository;
import com.bizsahayak.saved.SavedTender;
import com.bizsahayak.saved.SavedTenderRepository;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.scheme.service.SchemeService;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.tender.TenderRepository;
import com.bizsahayak.tender.dto.TenderDto;
import com.bizsahayak.tender.service.TenderService;
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
public class SavedOpportunityService {

    private final SavedSchemeRepository savedSchemeRepository;
    private final SavedTenderRepository savedTenderRepository;
    private final SchemeRepository schemeRepository;
    private final TenderRepository tenderRepository;
    private final UserRepository userRepository;
    private final SchemeService schemeService;
    private final TenderService tenderService;

    @Transactional
    public void saveScheme(Long userId, Long schemeId) {
        if (savedSchemeRepository.existsByUserIdAndSchemeId(userId, schemeId)) {
            throw new DuplicateResourceException("Scheme is already saved");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", "id", schemeId));

        SavedScheme savedScheme = SavedScheme.builder()
                .user(user)
                .scheme(scheme)
                .build();

        savedSchemeRepository.save(savedScheme);
        log.info("User {} saved scheme {}", userId, schemeId);
    }

    @Transactional
    public void unsaveScheme(Long userId, Long schemeId) {
        savedSchemeRepository.deleteByUserIdAndSchemeId(userId, schemeId);
        log.info("User {} unsaved scheme {}", userId, schemeId);
    }

    @Transactional(readOnly = true)
    public List<SchemeDto> getSavedSchemes(Long userId) {
        return savedSchemeRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ss -> schemeService.mapToDto(ss.getScheme()))
                .toList();
    }

    @Transactional
    public void saveTender(Long userId, Long tenderId) {
        if (savedTenderRepository.existsByUserIdAndTenderId(userId, tenderId)) {
            throw new DuplicateResourceException("Tender is already saved");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender", "id", tenderId));

        SavedTender savedTender = SavedTender.builder()
                .user(user)
                .tender(tender)
                .build();

        savedTenderRepository.save(savedTender);
        log.info("User {} saved tender {}", userId, tenderId);
    }

    @Transactional
    public void unsaveTender(Long userId, Long tenderId) {
        savedTenderRepository.deleteByUserIdAndTenderId(userId, tenderId);
        log.info("User {} unsaved tender {}", userId, tenderId);
    }

    @Transactional(readOnly = true)
    public List<TenderDto> getSavedTenders(Long userId) {
        return savedTenderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(st -> tenderService.mapToDto(st.getTender()))
                .toList();
    }
}
