package com.bizsahayak.scheme;

import com.bizsahayak.government.model.GovernmentSource;
import com.bizsahayak.scheme.dto.SchemeDto;
import com.bizsahayak.scheme.service.SchemeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class GovernmentUrlTest {

    @Test
    @DisplayName("Should normalize URLs by prepending https:// if missing protocol")
    void testNormalizeUrlMissingProtocol() {
        String result = SchemeService.normalizeUrl("pmfme.mofpi.gov.in");
        assertEquals("https://pmfme.mofpi.gov.in", result);
    }

    @Test
    @DisplayName("Should preserve existing http:// or https:// protocols")
    void testNormalizeUrlPreserveProtocol() {
        String httpResult = SchemeService.normalizeUrl("http://msme.gov.in/scheme-details");
        assertEquals("http://msme.gov.in/scheme-details", httpResult);

        String httpsResult = SchemeService.normalizeUrl("https://udyamregistration.gov.in");
        assertEquals("https://udyamregistration.gov.in", httpsResult);
    }

    @Test
    @DisplayName("Should handle null, empty, or whitespace-only URLs safely without throwing exceptions")
    void testNormalizeUrlBlank() {
        assertNull(SchemeService.normalizeUrl(null));
        assertNull(SchemeService.normalizeUrl(""));
        assertNull(SchemeService.normalizeUrl("   "));
    }

    @Test
    @DisplayName("Should fall back from officialApplicationUrl to officialSourceUrl to source.baseUrl in mapToDto")
    void testUrlFallbackHierarchy() {
        SchemeService service = new SchemeService(null, null, null, null, null, null, null);

        // Case 1: Application URL present
        Scheme s1 = Scheme.builder()
                .title("Scheme 1")
                .slug("s1")
                .description("Desc")
                .department("Dept")
                .schemeType("Subsidy")
                .state("All India")
                .officialApplicationUrl("app.gov.in")
                .officialSourceUrl("source.gov.in")
                .build();
        SchemeDto dto1 = service.mapToDto(s1);
        assertEquals("https://app.gov.in", dto1.getOfficialApplicationUrl());

        // Case 2: Application URL missing, Source URL present
        Scheme s2 = Scheme.builder()
                .title("Scheme 2")
                .slug("s2")
                .description("Desc")
                .department("Dept")
                .schemeType("Subsidy")
                .state("All India")
                .officialSourceUrl("source.gov.in")
                .build();
        SchemeDto dto2 = service.mapToDto(s2);
        assertNull(dto2.getOfficialApplicationUrl());
        assertEquals("https://source.gov.in", dto2.getOfficialSourceUrl());

        // Case 3: Both application and source URL missing, GovernmentSource.baseUrl present
        GovernmentSource govSource = GovernmentSource.builder().name("MoFPI").baseUrl("mofpi.gov.in").build();
        Scheme s3 = Scheme.builder()
                .title("Scheme 3")
                .slug("s3")
                .description("Desc")
                .department("Dept")
                .schemeType("Subsidy")
                .state("All India")
                .source(govSource)
                .build();
        SchemeDto dto3 = service.mapToDto(s3);
        assertEquals("https://mofpi.gov.in", dto3.getOfficialSourceUrl());

        // Case 4: Completely missing URL does not create a broken localhost URL
        Scheme s4 = Scheme.builder()
                .title("Scheme 4")
                .slug("s4")
                .description("Desc")
                .department("Dept")
                .schemeType("Subsidy")
                .state("All India")
                .build();
        SchemeDto dto4 = service.mapToDto(s4);
        assertNull(dto4.getOfficialApplicationUrl());
        assertNull(dto4.getOfficialSourceUrl());
    }
}
