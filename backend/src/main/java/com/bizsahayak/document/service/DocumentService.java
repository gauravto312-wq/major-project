package com.bizsahayak.document.service;

import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.business.service.BusinessService;
import com.bizsahayak.document.BusinessDocument;
import com.bizsahayak.document.BusinessDocumentRepository;
import com.bizsahayak.document.DocumentStatus;
import com.bizsahayak.document.dto.DocumentDto;
import com.bizsahayak.exception.FileStorageException;
import com.bizsahayak.exception.ForbiddenException;
import com.bizsahayak.exception.ResourceNotFoundException;
import com.bizsahayak.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final BusinessDocumentRepository documentRepository;
    private final BusinessService businessService;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Transactional
    public DocumentDto uploadDocument(Long userId, String documentType, MultipartFile file) {
        BusinessProfile profile = businessService.getEntityByUserId(userId);

        if (file.isEmpty()) {
            throw new FileStorageException("Failed to store empty file.");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = originalFilename.substring(dotIndex);
        }

        String storageFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetLocation);
            Path filePath = targetLocation.resolve(storageFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            BusinessDocument doc = BusinessDocument.builder()
                    .businessProfile(profile)
                    .documentType(documentType)
                    .fileName(originalFilename)
                    .fileStorageName(storageFileName)
                    .fileUrl("/api/business/documents/file/" + storageFileName)
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .status(DocumentStatus.PENDING)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            BusinessDocument saved = documentRepository.save(doc);
            log.info("Uploaded document {} for business {}", saved.getId(), profile.getId());
            return mapToDto(saved);
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> getDocumentsByUserId(Long userId) {
        BusinessProfile profile = businessService.getEntityByUserId(userId);
        return documentRepository.findByBusinessProfileId(profile.getId())
                .stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> getDocumentsByBusinessId(Long businessId) {
        return documentRepository.findByBusinessProfileId(businessId)
                .stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public Resource loadFileAsResource(String storageFileName, UserPrincipal currentUser) {
        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(storageFileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new ResourceNotFoundException("File not found: " + storageFileName);
            }

            // Access Control Check
            boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin) {
                BusinessProfile profile = businessService.getEntityByUserId(currentUser.getId());
                boolean isOwner = documentRepository.findByBusinessProfileId(profile.getId())
                        .stream().anyMatch(d -> d.getFileStorageName().equals(storageFileName));
                if (!isOwner) {
                    throw new ForbiddenException("You are not authorized to view this document");
                }
            }

            return resource;
        } catch (Exception ex) {
            throw new ResourceNotFoundException("File not found: " + storageFileName);
        }
    }

    @Transactional
    public void deleteDocument(Long documentId, Long userId) {
        BusinessProfile profile = businessService.getEntityByUserId(userId);
        BusinessDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("BusinessDocument", "id", documentId));

        if (!doc.getBusinessProfile().getId().equals(profile.getId())) {
            throw new ForbiddenException("You are not authorized to delete this document");
        }

        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(doc.getFileStorageName());
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.warn("Could not delete file from disk: {}", doc.getFileStorageName());
        }

        documentRepository.delete(doc);
        log.info("Deleted document {}", documentId);
    }

    public DocumentDto mapToDto(BusinessDocument doc) {
        return DocumentDto.builder()
                .id(doc.getId())
                .businessId(doc.getBusinessProfile().getId())
                .documentType(doc.getDocumentType())
                .fileName(doc.getFileName())
                .fileUrl(doc.getFileUrl())
                .fileSize(doc.getFileSize())
                .contentType(doc.getContentType())
                .status(doc.getStatus())
                .rejectionReason(doc.getRejectionReason())
                .uploadedAt(doc.getUploadedAt())
                .verifiedAt(doc.getVerifiedAt())
                .build();
    }
}
