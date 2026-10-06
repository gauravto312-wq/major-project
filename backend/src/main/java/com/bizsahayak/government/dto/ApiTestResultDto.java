package com.bizsahayak.government.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiTestResultDto {
    private String sourceName;
    private String targetUrl;
    private boolean working;
    private int httpStatusCode;
    private long responseTimeMs;
    private String message;
    private String details;
}
