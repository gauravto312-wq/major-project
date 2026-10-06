package com.bizsahayak.government.service;

import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.government.client.DataGovInApiClient;
import com.bizsahayak.government.client.MySchemeApiClient;
import com.bizsahayak.government.dto.*;
import com.bizsahayak.government.model.GovernmentSource;
import com.bizsahayak.government.model.GovernmentSyncLog;
import com.bizsahayak.government.model.SyncStatus;
import com.bizsahayak.government.parser.SchemeNormalizer;
import com.bizsahayak.government.parser.TenderNormalizer;
import com.bizsahayak.government.repository.GovernmentSourceRepository;
import com.bizsahayak.government.repository.GovernmentSyncLogRepository;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.tender.TenderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

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
    public GovernmentSourceDto createSource(GovernmentSourceDto dto) {
        GovernmentSource source = GovernmentSource.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .providerCode(dto.getProviderCode().toUpperCase().replaceAll("[^A-Z0-9_]", "_"))
                .sourceType(dto.getSourceType())
                .contentType(dto.getContentType())
                .baseUrl(dto.getBaseUrl())
                .apiUrl(dto.getApiUrl())
                .documentationUrl(dto.getDocumentationUrl())
                .termsUrl(dto.getTermsUrl())
                .authenticationType(dto.getAuthenticationType() != null ? dto.getAuthenticationType() : "NONE")
                .credentialReference(dto.getCredentialReference())
                .active(dto.isActive())
                .autoPublish(dto.isAutoPublish())
                .syncFrequency(dto.getSyncFrequency() != null ? dto.getSyncFrequency() : "0 0 */6 * * *")
                .rateLimitNotes(dto.getRateLimitNotes())
                .build();

        GovernmentSource saved = sourceRepository.save(source);
        log.info("Created government source {}", saved.getName());
        return mapSourceToDto(saved);
    }

    @Transactional
    public GovernmentSourceDto updateSource(Long id, GovernmentSourceDto dto) {
        GovernmentSource source = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GovernmentSource", "id", id));

        source.setName(dto.getName());
        source.setDescription(dto.getDescription());
        source.setSourceType(dto.getSourceType());
        source.setContentType(dto.getContentType());
        source.setBaseUrl(dto.getBaseUrl());
        source.setApiUrl(dto.getApiUrl());
        source.setDocumentationUrl(dto.getDocumentationUrl());
        source.setTermsUrl(dto.getTermsUrl());
        source.setAuthenticationType(dto.getAuthenticationType());
        source.setCredentialReference(dto.getCredentialReference());
        source.setActive(dto.isActive());
        source.setAutoPublish(dto.isAutoPublish());
        source.setSyncFrequency(dto.getSyncFrequency());
        source.setRateLimitNotes(dto.getRateLimitNotes());

        GovernmentSource saved = sourceRepository.save(source);
        log.info("Updated government source {}", saved.getName());
        return mapSourceToDto(saved);
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

    public ApiTestResultDto testSourceApi(Long sourceId) {
        GovernmentSource source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("GovernmentSource", "id", sourceId));

        String targetUrl = StringUtils.hasText(source.getApiUrl()) ? source.getApiUrl() : source.getBaseUrl();
        RestTemplate restTemplate = new RestTemplate();
        long start = System.currentTimeMillis();

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(targetUrl, String.class);
            long latency = System.currentTimeMillis() - start;

            boolean isSuccess = response.getStatusCode().is2xxSuccessful();
            return ApiTestResultDto.builder()
                    .sourceName(source.getName())
                    .targetUrl(targetUrl)
                    .working(isSuccess)
                    .httpStatusCode(response.getStatusCode().value())
                    .responseTimeMs(latency)
                    .message(isSuccess ? "API Working! Received 200 OK response from official government portal." : "API returned non-2xx status code.")
                    .details("Content Length: " + (response.getBody() != null ? response.getBody().length() : 0) + " bytes")
                    .build();
        } catch (Exception ex) {
            long latency = System.currentTimeMillis() - start;
            log.warn("API Test failed for source {}: {}", source.getName(), ex.getMessage());
            return ApiTestResultDto.builder()
                    .sourceName(source.getName())
                    .targetUrl(targetUrl)
                    .working(false)
                    .httpStatusCode(500)
                    .responseTimeMs(latency)
                    .message("API Test Failed: Could not connect to target government endpoint.")
                    .details("Safe Error Diagnostics: " + ex.getMessage())
                    .build();
        }
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
                .credentialReference(s.getCredentialReference() != null ? "********" : null) // Mask key
                .active(s.isActive())
                .autoPublish(s.isAutoPublish())
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
