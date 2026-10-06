package com.bizsahayak.scheme.search;

import com.bizsahayak.scheme.Scheme;
import lombok.Value;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class SchemeSearchEngine {

    private static final Map<String, List<String>> SYNONYM_MAP = new HashMap<>();

    static {
        // Restaurant & Food Business intent mapping
        List<String> foodSynonyms = List.of("restaurant", "restaurent", "food", "food processing", "hospitality", "catering", "pmfme", "bakery", "hotel", "canteen", "kitchen");
        for (String syn : foodSynonyms) {
            SYNONYM_MAP.put(syn, foodSynonyms);
        }

        // Women entrepreneurship intent mapping
        List<String> womenSynonyms = List.of("women", "woman", "female", "mahila", "girl", "lakhpati", "stand up", "empowerment", "grants", "women entrepreneur");
        for (String syn : womenSynonyms) {
            SYNONYM_MAP.put(syn, womenSynonyms);
        }

        // Startup & Innovation intent mapping
        List<String> startupSynonyms = List.of("startup", "start-up", "start up", "incubation", "seed", "innovation", "dpiit", "venture", "entrepreneur");
        for (String syn : startupSynonyms) {
            SYNONYM_MAP.put(syn, startupSynonyms);
        }

        // Farmers & Agriculture intent mapping
        List<String> farmerSynonyms = List.of("farmer", "farmers", "agriculture", "farming", "kisan", "agro", "nabard", "crop", "horticulture", "soil");
        for (String syn : farmerSynonyms) {
            SYNONYM_MAP.put(syn, farmerSynonyms);
        }

        // Solar & Renewable Energy intent mapping
        List<String> solarSynonyms = List.of("solar", "renewable", "green energy", "kusum", "clean energy", "pv", "roof top", "sun");
        for (String syn : solarSynonyms) {
            SYNONYM_MAP.put(syn, solarSynonyms);
        }

        // Loan, Funding & Credit Guarantee intent mapping
        List<String> loanSynonyms = List.of("loan", "credit", "cgtmse", "pmegp", "mudra", "subvention", "subsidy", "finance", "guarantee", "capital", "funding");
        for (String syn : loanSynonyms) {
            SYNONYM_MAP.put(syn, loanSynonyms);
        }

        // MSME & Small Enterprise intent mapping
        List<String> msmeSynonyms = List.of("msme", "micro", "small", "small business", "champions", "zed", "pmegp", "small enterprise");
        for (String syn : msmeSynonyms) {
            SYNONYM_MAP.put(syn, msmeSynonyms);
        }

        // IT, Software & Technology intent mapping
        List<String> itSynonyms = List.of("it", "software", "technology", "tech", "digital", "electronics", "hardware", "computer");
        for (String syn : itSynonyms) {
            SYNONYM_MAP.put(syn, itSynonyms);
        }
    }

    @Value
    public static class ScoredScheme {
        Scheme scheme;
        int relevanceScore;
    }

    /**
     * Normalizes query string (lowercases, trims, strips punctuation).
     */
    public static String normalize(String text) {
        if (text == null) return "";
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    /**
     * Expands query keywords into normalized token set including synonyms.
     */
    public static Set<String> expandQueryTokens(String query) {
        String normalized = normalize(query);
        if (normalized.isEmpty()) return Collections.emptySet();

        Set<String> tokens = new HashSet<>(Arrays.asList(normalized.split("\\s+")));
        Set<String> expanded = new HashSet<>(tokens);

        for (String token : tokens) {
            List<String> synonyms = SYNONYM_MAP.get(token);
            if (synonyms != null) {
                expanded.addAll(synonyms);
            }
        }

        return expanded;
    }

    /**
     * Calculates relevance score for a scheme against user query and expanded tokens.
     */
    public static int calculateRelevanceScore(Scheme scheme, String rawQuery, Set<String> queryTokens) {
        if (rawQuery == null || rawQuery.isBlank()) return 100; // Default score when no keyword query

        String normQuery = normalize(rawQuery);
        int score = 0;

        String title = normalize(scheme.getTitle());
        String shortDesc = normalize(scheme.getShortDescription());
        String fullDesc = normalize(scheme.getDescription());
        String department = normalize(scheme.getDepartment());
        String ministry = normalize(scheme.getMinistry());
        String category = scheme.getCategory() != null ? normalize(scheme.getCategory().getName()) : "";
        String targetIndustries = normalize(scheme.getTargetIndustries());
        String targetBusinessTypes = normalize(scheme.getTargetBusinessTypes());
        String benefits = normalize(scheme.getBenefits());
        String eligibility = normalize(scheme.getEligibility());

        // 1. Exact or Title word-boundary match (Highest Priority)
        if (title.equals(normQuery)) {
            score += 100;
        } else if (normQuery.length() >= 2 && Pattern.compile("\\b" + Pattern.quote(normQuery) + "\\b").matcher(title).find()) {
            score += 60;
        }

        // 2. Category / Target Industry / Target Business Type match
        for (String token : queryTokens) {
            if (token.length() < 2) continue; // Ignore single letter tokens

            Pattern wordBoundary = Pattern.compile("\\b" + Pattern.quote(token) + "\\b");

            if (wordBoundary.matcher(title).find()) {
                score += 30;
            }
            if (wordBoundary.matcher(category).find()) {
                score += 25;
            }
            if (wordBoundary.matcher(targetIndustries).find()) {
                score += 25;
            }
            if (wordBoundary.matcher(targetBusinessTypes).find()) {
                score += 20;
            }
            if (wordBoundary.matcher(benefits).find()) {
                score += 15;
            }
            if (wordBoundary.matcher(eligibility).find()) {
                score += 15;
            }
            if (wordBoundary.matcher(shortDesc).find()) {
                score += 10;
            }
            if (wordBoundary.matcher(fullDesc).find()) {
                score += 5;
            }
            if (wordBoundary.matcher(department).find() || wordBoundary.matcher(ministry).find()) {
                score += 5;
            }
        }

        return score;
    }

    /**
     * Ranks a list of schemes by relevance score.
     */
    public static List<Scheme> rankSchemes(List<Scheme> candidateSchemes, String rawQuery) {
        if (rawQuery == null || rawQuery.isBlank()) {
            return candidateSchemes;
        }

        Set<String> expandedTokens = expandQueryTokens(rawQuery);

        return candidateSchemes.stream()
                .map(scheme -> new ScoredScheme(scheme, calculateRelevanceScore(scheme, rawQuery, expandedTokens)))
                .filter(ss -> ss.getRelevanceScore() > 0)
                .sorted(Comparator.comparingInt(ScoredScheme::getRelevanceScore).reversed())
                .map(ScoredScheme::getScheme)
                .collect(Collectors.toList());
    }
}
