package com.bizsahayak.admin;

import com.bizsahayak.common.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(Long actorId, String actorEmail, String action, String entityType, Long entityId, String description) {
        AuditLog auditLog = AuditLog.builder()
                .actorId(actorId)
                .actorEmail(actorEmail)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .build();
        auditLogRepository.save(auditLog);
        log.info("Audit log saved: actor={}, action={}, entityType={}, entityId={}", actorEmail, action, entityType, entityId);
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLog> getAuditLogs(int page, int size) {
        Page<AuditLog> pageResult = auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return PageResponse.from(pageResult);
    }
}
