package com.bizsahayak.scheme;

import com.bizsahayak.application.UserApplicationRepository;
import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.business.BusinessProfileRepository;
import com.bizsahayak.document.BusinessDocumentRepository;
import com.bizsahayak.scheme.dto.SchemeAssistantDto;
import com.bizsahayak.scheme.service.SchemeService;
import com.bizsahayak.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ApplicationAssistantTest {

    @Mock
    private SchemeRepository schemeRepository;

    @Mock
    private BusinessProfileRepository businessProfileRepository;

    @Mock
    private BusinessDocumentRepository businessDocumentRepository;

    @Mock
    private UserApplicationRepository userApplicationRepository;

    @InjectMocks
    private SchemeService schemeService;

    @Test
    @DisplayName("Should build Scheme Application Guide with ELIGIBLE rating, informational required documents, and step-by-step application instructions")
    void testGetAssistantSummaryEligible() {
        Long schemeId = 1L;
        Long userId = 100L;

        User user = User.builder().id(userId).email("biz@test.com").build();

        Scheme scheme = Scheme.builder()
                .id(schemeId)
                .title("MSME Credit Guarantee Scheme")
                .slug("msme-credit-guarantee-scheme")
                .targetIndustries("Manufacturing, Services")
                .state("All India")
                .targetBusinessTypes("Proprietorship, Private Limited")
                .requiredDocuments("GST Certificate, UDYAM Registration")
                .applicationProcess("1. Visit official MSME portal.\n2. Login with credentials.\n3. Fill details and upload GST.")
                .officialApplicationUrl("pmfme.mofpi.gov.in")
                .build();

        BusinessProfile profile = BusinessProfile.builder()
                .id(5L)
                .user(user)
                .industry("Manufacturing")
                .state("Maharashtra")
                .businessType("Proprietorship")
                .businessName("Apex Tech Works")
                .build();

        when(schemeRepository.findBySlug("msme-credit-guarantee-scheme")).thenReturn(Optional.of(scheme));
        when(businessProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));
        when(userApplicationRepository.findByUserIdAndSchemeId(userId, schemeId)).thenReturn(Optional.empty());

        SchemeAssistantDto dto = schemeService.getAssistantSummaryBySlug("msme-credit-guarantee-scheme", userId);

        assertNotNull(dto);
        assertEquals("ELIGIBLE", dto.getEligibilityRating());
        assertEquals("https://pmfme.mofpi.gov.in", dto.getOfficialApplicationUrl());
        assertEquals(2, dto.getRequiredDocumentsList().size());
        assertEquals("GST Certificate", dto.getRequiredDocumentsList().get(0).getDocumentName());
        assertTrue(dto.getRequiredDocumentsList().get(0).isRequired());
        assertEquals(3, dto.getApplicationSteps().size());
        assertEquals("ONLINE", dto.getApplicationMode());
    }

    @Test
    @DisplayName("Should safely fall back to generic application steps when scheme application instructions are null or blank")
    void testGetAssistantSummaryGenericStepsFallback() {
        Long schemeId = 2L;

        Scheme scheme = Scheme.builder()
                .id(schemeId)
                .title("Generic Government Subsidy")
                .slug("generic-subsidy")
                .state("All India")
                .officialSourceUrl("https://msme.gov.in")
                .build();

        when(schemeRepository.findBySlug("generic-subsidy")).thenReturn(Optional.of(scheme));
        when(businessProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());

        SchemeAssistantDto dto = schemeService.getAssistantSummaryBySlug("generic-subsidy", 1L);

        assertNotNull(dto);
        assertEquals("NEEDS_VERIFICATION", dto.getEligibilityRating());
        assertEquals("https://msme.gov.in", dto.getOfficialSourceUrl());
        assertNull(dto.getOfficialApplicationUrl());
        assertEquals("OFFICIAL_INFORMATION_ONLY", dto.getApplicationDestinationStatus());
        assertFalse(dto.getApplicationSteps().isEmpty());
        assertTrue(dto.getApplicationSteps().get(0).contains("official government application portal"));
    }

    @Test
    @DisplayName("Should classify portal as APPLICATION_LOGIN when officialApplicationUrl contains login/register keywords")
    void testAssistantDestinationStatusLogin() {
        Long schemeId = 3L;

        Scheme scheme = Scheme.builder()
                .id(schemeId)
                .title("Stand Up India Scheme for SC/ST and Women")
                .slug("stand-up-india")
                .state("All India")
                .officialSourceUrl("https://www.standupmitra.in")
                .officialApplicationUrl("https://www.standupmitra.in/Login/Register")
                .build();

        when(schemeRepository.findBySlug("stand-up-india")).thenReturn(Optional.of(scheme));
        when(businessProfileRepository.findByUserId(10L)).thenReturn(Optional.empty());

        SchemeAssistantDto dto = schemeService.getAssistantSummaryBySlug("stand-up-india", 10L);

        assertNotNull(dto);
        assertEquals("https://www.standupmitra.in/Login/Register", dto.getOfficialApplicationUrl());
        assertEquals("APPLICATION_LOGIN", dto.getApplicationDestinationStatus());
    }
}
