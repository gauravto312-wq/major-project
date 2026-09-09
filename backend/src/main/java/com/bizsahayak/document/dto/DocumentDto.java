package com.bizsahayak.document.dto;

import com.bizsahayak.document.DocumentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {
    private Long id;
    private Long businessId;
    private String documentType;
    private String fileName;
    private String fileUrl;
    private long fileSize;
    private String contentType;
    private DocumentStatus status;
    private String rejectionReason;
    private LocalDateTime uploadedAt;
    private LocalDateTime verifiedAt;
}
