package com.bizsahayak.document.controller;

import com.bizsahayak.common.ApiResponse;
import com.bizsahayak.document.dto.DocumentDto;
import com.bizsahayak.document.service.DocumentService;
import com.bizsahayak.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/business/documents")
@RequiredArgsConstructor
@Tag(name = "Business Documents", description = "Document Upload & Vault Management")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a business verification document")
    @PreAuthorize("hasAnyRole('BUSINESS', 'ADMIN')")
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DocumentDto dto = documentService.uploadDocument(currentUser.getId(), documentType, file);
        return ResponseEntity.ok(ApiResponse.success(dto, "Document uploaded successfully"));
    }

    @GetMapping
    @Operation(summary = "Get list of uploaded documents for current business")
    @PreAuthorize("hasAnyRole('BUSINESS', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getDocuments(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<DocumentDto> documents = documentService.getDocumentsByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(documents));
    }

    @GetMapping("/file/{fileName:.+}")
    @Operation(summary = "Securely download/view document file")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String fileName,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Resource resource = documentService.loadFileAsResource(fileName, currentUser);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an uploaded document")
    @PreAuthorize("hasAnyRole('BUSINESS', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        documentService.deleteDocument(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Document deleted successfully"));
    }
}
