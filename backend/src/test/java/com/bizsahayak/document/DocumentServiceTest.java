package com.bizsahayak.document;

import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.business.service.BusinessService;
import com.bizsahayak.document.service.DocumentService;
import com.bizsahayak.exception.FileStorageException;
import com.bizsahayak.exception.ForbiddenException;
import com.bizsahayak.security.UserPrincipal;
import com.bizsahayak.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

class DocumentServiceTest {

    @Mock
    private BusinessDocumentRepository documentRepository;

    @Mock
    private BusinessService businessService;

    @InjectMocks
    private DocumentService documentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("File validation rejects executable files like .exe or .sh")
    void testUploadExecutableFileRejected() {
        MockMultipartFile exeFile = new MockMultipartFile("file", "malicious.exe", "application/x-msdownload", "executable binary".getBytes());

        BusinessProfile profile = BusinessProfile.builder().id(10L).build();
        when(businessService.getEntityByUserId(1L)).thenReturn(profile);

        assertThrows(FileStorageException.class, () -> {
            documentService.uploadDocument(1L, "GST", exeFile);
        }, "Should throw FileStorageException for disallowed extension");
    }

    @Test
    @DisplayName("Filename with path traversal characters throws FileStorageException")
    void testUploadPathTraversalRejected() {
        MockMultipartFile badFile = new MockMultipartFile("file", "../../etc/passwd.pdf", "application/pdf", "data".getBytes());

        BusinessProfile profile = BusinessProfile.builder().id(10L).build();
        when(businessService.getEntityByUserId(1L)).thenReturn(profile);

        assertThrows(FileStorageException.class, () -> {
            documentService.uploadDocument(1L, "GST", badFile);
        }, "Should throw FileStorageException for path traversal filename");
    }
}
