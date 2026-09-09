package com.bizsahayak.government.service;

import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.government.client.DataGovInApiClient;
import com.bizsahayak.government.client.MySchemeApiClient;
import com.bizsahayak.government.dto.GovernmentSourceDto;
import com.bizsahayak.government.dto.GovernmentSyncLogDto;
import com.bizsahayak.government.dto.RawSchemeDto;
import com.bizsahayak.government.dto.RawTenderDto;
import com.bizsahayak.government.dto.SyncResultDto;
import com.bizsahayak.government.model.GovernmentSource;
import com.bizsahayak.government.model.GovernmentSyncLog;
import com.bizsahayak.government.model.SyncStatus;
import com.bizsahayak.government.parser.SchemeNormalizer;
import com.bizsahayak.government.parser.TenderNormalizer;
import com.bizsahayak.government.repository.GovernmentSourceRepository;
import com.bizsahayak.government.repository.GovernmentSyncLogRepository;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.scheme.SchemeStatus;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.tender.TenderRepository;
import com.bizsahayak.tender.TenderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GovernmentSyncService {

    private final GovernmentSourceRepository sourceRepository;
    private final GovernmentSyncLogRepository syncLogRepository;
    private final MySchemeApiClient mySchemeApiClient;
    private final DataGovInApiClient dataGovInApiClient;
    private final SchemeNormalizer schemeNormalizer;
    private final TenderNormalizer tenderNormalizer;
    private final SchemeRepository schemeRepository;
    private final TenderRepository tenderRepository;

    @Transactional(readOnly = true)
    public List<GovernmentSourceDto> getAllSources() {
        return sourceRepository.findAll().stream()
                .map(this::mapSourceToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GovernmentSourceDto getSourceById(Long id) {
        GovernmentSource source = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GovernmentSource", "id", id));
        return mapSourceToDto(source);
    }

    @Transactional
    public GovernmentSourceDto updateSourceStatus(Long id, boolean active) {
        GovernmentSource source = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GovernmentSource", "id", id));
        source.setActive(active);
        GovernmentSource updated = sourceRepository.save(source);
        log.info("Government source {} status set to active={}", source.getName(), active);
        return mapSourceToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<GovernmentSyncLogDto> getSyncLogsForSource(Long sourceId) {
        return syncLogRepository.findBySourceIdOrderByStartedAtDesc(sourceId).stream()
                .map(this::mapLogToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SyncResultDto triggerSync(Long sourceId) {
        GovernmentSource source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("GovernmentSource", "id", sourceId));

        if (!source.isActive()) {
            return SyncResultDto.builder()
                    .source(source.getName())
                    .status(SyncStatus.FAILED)
                    .message("Source is currently disabled.")
                    .build();
        }

        GovernmentSyncLog syncLog = GovernmentSyncLog.builder()
                .source(source)
                .startedAt(LocalDateTime.now())
                .status(SyncStatus.RUNNING)
                .build();
        syncLog = syncLogRepository.save(syncLog);

        int fetched = 0;
        int created = 0;
        int updated = 0;
        int skipped = 0;
        int failed = 0;
        String errorMessage = null;
        SyncStatus finalStatus = SyncStatus.SUCCESS;

        try {
            switch (source.getContentType()) {
                case SCHEME:
                case BOTH:
                    List<RawSchemeDto> rawSchemes = mySchemeApiClient.fetchSchemes(source);
                    fetched += rawSchemes.size();

                    for (RawSchemeDto raw : rawSchemes) {
                        try {
                            Scheme normalized = schemeNormalizer.normalize(raw, source);
                            Optional<Scheme> existing = findExistingScheme(source, raw, normalized);

                            if (existing.isPresent()) {
                                Scheme existingScheme = existing.get();
                                updateSchemeFields(existingScheme, normalized);
                                schemeRepository.save(existingScheme);
                                updated++;
                            } else {
                                schemeRepository.save(normalized);
                                created++;
                            }
                        } catch (Exception ex) {
                            log.error("Failed to process raw scheme: {}", ex.getMessage());
                            failed++;
                        }
                    }
                    break;

                case TENDER:
                    List<RawTenderDto> rawTenders = dataGovInApiClient.fetchTenders(source);
                    fetched += rawTenders.size();

                    for (RawTenderDto raw : rawTenders) {
                        try {
                            Tender normalized = tenderNormalizer.normalize(raw, source);
                            Optional<Tender> existing = findExistingTender(source, raw, normalized);

                            if (existing.isPresent()) {
                                Tender existingTender = existing.get();
                                updateTenderFields(existingTender, normalized);
                                tenderRepository.save(existingTender);
                                updated++;
                            } else {
                                tenderRepository.save(normalized);
                                created++;
                            }
                        } catch (Exception ex) {
                            log.error("Failed to process raw tender: {}", ex.getMessage());
                            failed++;
                        }
                    }
                    break;
            }
        } catch (Exception ex) {
            log.error("Sync failed for source {}: {}", source.getName(), ex.getMessage(), ex);
            finalStatus = SyncStatus.FAILED;
            errorMessage = ex.getMessage();
        }

        if (failed > 0 && (created > 0 || updated > 0)) {
            finalStatus = SyncStatus.PARTIAL_SUCCESS;
        }

        LocalDateTime completedAt = LocalDateTime.now();
        syncLog.setCompletedAt(completedAt);
        syncLog.setStatus(finalStatus);
        syncLog.setRecordsFetched(fetched);
        syncLog.setRecordsCreated(created);
        syncLog.setRecordsUpdated(updated);
        syncLog.setRecordsSkipped(skipped);
        syncLog.setRecordsFailed(failed);
        syncLog.setErrorMessage(errorMessage);
        syncLogRepository.save(syncLog);

        source.setLastSyncAt(completedAt);
        source.setLastSyncStatus(finalStatus);
        sourceRepository.save(source);

        return SyncResultDto.builder()
                .source(source.getName())
                .status(finalStatus)
                .recordsFetched(fetched)
                .recordsCreated(created)
                .recordsUpdated(updated)
                .recordsSkipped(skipped)
                .recordsFailed(failed)
                .message(errorMessage != null ? errorMessage : "Synchronization completed successfully.")
                .build();
    }

    private Optional<Scheme> findExistingScheme(GovernmentSource source, RawSchemeDto raw, Scheme normalized) {
        if (StringUtils.hasText(raw.getSourceReferenceId())) {
            Optional<Scheme> byRef = schemeRepository.findBySourceIdAndSourceReferenceId(source.getId(), raw.getSourceReferenceId());
            if (byRef.isPresent()) return byRef;
        }
        if (StringUtils.hasText(raw.getOfficialApplicationUrl())) {
            String cleanUrl = raw.getOfficialApplicationUrl().trim().replaceAll("/+$", "");
            Optional<Scheme> byUrl = schemeRepository.findByOfficialApplicationUrl(cleanUrl);
            if (byUrl.isPresent()) return byUrl;
            Optional<Scheme> byUrlRaw = schemeRepository.findByOfficialApplicationUrl(raw.getOfficialApplicationUrl());
            if (byUrlRaw.isPresent()) return byUrlRaw;
        }
        if (StringUtils.hasText(normalized.getSlug())) {
            Optional<Scheme> bySlug = schemeRepository.findBySlug(normalized.getSlug());
            if (bySlug.isPresent()) return bySlug;
        }
        return schemeRepository.findByTitleIgnoreCaseAndDepartmentIgnoreCase(normalized.getTitle(), normalized.getDepartment());
    }

    private Optional<Tender> findExistingTender(GovernmentSource source, RawTenderDto raw, Tender normalized) {
        if (StringUtils.hasText(raw.getSourceReferenceId())) {
            Optional<Tender> byRef = tenderRepository.findBySourceIdAndSourceReferenceId(source.getId(), raw.getSourceReferenceId());
            if (byRef.isPresent()) return byRef;
        }
        if (StringUtils.hasText(raw.getTenderNumber())) {
            Optional<Tender> byNum = tenderRepository.findByTenderNumber(raw.getTenderNumber());
            if (byNum.isPresent()) return byNum;
        }
        if (StringUtils.hasText(raw.getOfficialTenderUrl())) {
            String cleanUrl = raw.getOfficialTenderUrl().trim().replaceAll("/+$", "");
            Optional<Tender> byUrl = tenderRepository.findByOfficialTenderUrl(cleanUrl);
            if (byUrl.isPresent()) return byUrl;
            Optional<Tender> byUrlRaw = tenderRepository.findByOfficialTenderUrl(raw.getOfficialTenderUrl());
            if (byUrlRaw.isPresent()) return byUrlRaw;
        }
        if (StringUtils.hasText(normalized.getSlug())) {
            Optional<Tender> bySlug = tenderRepository.findBySlug(normalized.getSlug());
            if (bySlug.isPresent()) return bySlug;
        }
        return tenderRepository.findByTitleIgnoreCaseAndOrganizationIgnoreCase(normalized.getTitle(), normalized.getOrganization());
    }

    private void updateSchemeFields(Scheme target, Scheme source) {
        target.setTitle(source.getTitle());
        target.setDescription(source.getDescription());
        target.setShortDescription(source.getShortDescription());
        target.setDepartment(source.getDepartment());
        target.setMinistry(source.getMinistry());
        target.setCategory(source.getCategory());
        target.setSchemeType(source.getSchemeType());
        target.setState(source.getState());
        target.setDistrict(source.getDistrict());
        target.setBenefits(source.getBenefits());
        target.setEligibility(source.getEligibility());
        target.setRequiredDocuments(source.getRequiredDocuments());
        target.setApplicationProcess(source.getApplicationProcess());
        target.setStartDate(source.getStartDate());
        target.setDeadline(source.getDeadline());
        target.setOfficialApplicationUrl(source.getOfficialApplicationUrl());
        target.setOfficialSourceUrl(source.getOfficialSourceUrl());
        target.setSource(source.getSource());
        target.setSourceReferenceId(source.getSourceReferenceId());
        target.setSourceLastUpdatedAt(source.getSourceLastUpdatedAt());
        target.setLastSyncedAt(LocalDateTime.now());
    }

    private void updateTenderFields(Tender target, Tender source) {
        target.setTitle(source.getTitle());
        target.setDescription(source.getDescription());
        target.setOrganization(source.getOrganization());
        target.setDepartment(source.getDepartment());
        target.setCategory(source.getCategory());
        target.setLocation(source.getLocation());
        target.setState(source.getState());
        target.setDistrict(source.getDistrict());
        target.setEstimatedValue(source.getEstimatedValue());
        target.setPublishDate(source.getPublishDate());
        target.setClosingDate(source.getClosingDate());
        target.setEligibility(source.getEligibility());
        target.setRequiredDocuments(source.getRequiredDocuments());
        target.setRequirements(source.getRequirements());
        target.setOfficialTenderUrl(source.getOfficialTenderUrl());
        target.setOfficialSourceUrl(source.getOfficialSourceUrl());
        target.setSource(source.getSource());
        target.setSourceReferenceId(source.getSourceReferenceId());
        target.setSourceLastUpdatedAt(source.getSourceLastUpdatedAt());
        target.setLastSyncedAt(LocalDateTime.now());
    }

    private GovernmentSourceDto mapSourceToDto(GovernmentSource s) {
        return GovernmentSourceDto.builder()
                .id(s.getId())
                .name(s.getName())
                .description(s.getDescription())
                .providerCode(s.getProviderCode())
                .sourceType(s.getSourceType())
                .contentType(s.getContentType())
                .baseUrl(s.getBaseUrl())
                .apiUrl(s.getApiUrl())
                .documentationUrl(s.getDocumentationUrl())
                .termsUrl(s.getTermsUrl())
                .authenticationType(s.getAuthenticationType())
                .credentialReference(s.getCredentialReference())
                .active(s.isActive())
                .syncFrequency(s.getSyncFrequency())
                .rateLimitNotes(s.getRateLimitNotes())
                .lastSyncAt(s.getLastSyncAt())
                .lastSyncStatus(s.getLastSyncStatus())
                .createdAt(s.getCreatedAt())
                .build();
    }

    private GovernmentSyncLogDto mapLogToDto(GovernmentSyncLog l) {
        return GovernmentSyncLogDto.builder()
                .id(l.getId())
                .sourceId(l.getSource().getId())
                .sourceName(l.getSource().getName())
                .startedAt(l.getStartedAt())
                .completedAt(l.getCompletedAt())
                .status(l.getStatus())
                .recordsFetched(l.getRecordsFetched())
                .recordsCreated(l.getRecordsCreated())
                .recordsUpdated(l.getRecordsUpdated())
                .recordsSkipped(l.getRecordsSkipped())
                .recordsFailed(l.getRecordsFailed())
                .errorMessage(l.getErrorMessage())
                .build();
    }
}
