package com.bizsahayak.scheme;

import com.bizsahayak.category.Category;
import com.bizsahayak.scheme.search.SchemeSearchEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class SchemeSearchEngineTest {

    private Scheme restaurantScheme;
    private Scheme womenScheme;
    private Scheme startupScheme;
    private Scheme solarScheme;
    private Scheme farmerScheme;
    private Scheme hospitalityScheme;
    private Scheme sanitationScheme;
    private Scheme securityScheme;

    @BeforeEach
    void setUp() {
        Category msmeCat = Category.builder().id(1L).name("MSME & Small Business").slug("msme-small-business").build();
        Category foodCat = Category.builder().id(2L).name("Food Processing").slug("food-processing").build();
        Category womenCat = Category.builder().id(3L).name("Women Entrepreneurship").slug("women-entrepreneurship").build();
        Category techCat = Category.builder().id(4L).name("IT & Software").slug("it-software").build();

        restaurantScheme = Scheme.builder()
                .id(1L)
                .title("PM Micro Food Processing Enterprise Scheme (PMFME)")
                .shortDescription("35% capital subsidy for food processing units, restaurants, bakeries & dhabas.")
                .description("Support for micro food enterprises including restaurants and cloud kitchens.")
                .category(foodCat)
                .targetIndustries("Food Processing, Hospitality, Catering")
                .targetBusinessTypes("Proprietorship, MSME")
                .benefits("35% subsidy up to 10 Lakhs")
                .eligibility("Food business operators and restaurant owners")
                .status(SchemeStatus.PUBLISHED)
                .build();

        womenScheme = Scheme.builder()
                .id(2L)
                .title("Stand Up India - Women Entrepreneurship Scheme")
                .shortDescription("Bank loans between 10 Lakhs to 1 Crore for women entrepreneurs.")
                .description("Facilitate bank loans for women and SC/ST greenfield enterprises.")
                .category(womenCat)
                .targetIndustries("All Industries, Manufacturing, Services")
                .targetBusinessTypes("Women Owned MSME")
                .benefits("10 Lakhs to 1 Crore loan")
                .eligibility("Female entrepreneurs aged above 18")
                .status(SchemeStatus.PUBLISHED)
                .build();

        startupScheme = Scheme.builder()
                .id(3L)
                .title("Startup India Seed Fund Scheme (SISFS)")
                .shortDescription("Financial assistance to startups for proof of concept, prototype development & incubation.")
                .description("Incubation and seed grant support for innovative DPIIT recognized startups.")
                .category(msmeCat)
                .targetIndustries("Technology, Innovation, Manufacturing")
                .targetBusinessTypes("DPIIT Recognized Startup")
                .benefits("Grant up to 20 Lakhs for validation")
                .eligibility("Early stage startups")
                .status(SchemeStatus.PUBLISHED)
                .build();

        solarScheme = Scheme.builder()
                .id(4L)
                .title("PM-KUSUM Solar Pump Subsidy Scheme")
                .shortDescription("60% subsidy for installation of standalone solar pumps for farmers.")
                .description("Clean renewable energy solar scheme for agricultural irrigation pumps.")
                .category(msmeCat)
                .targetIndustries("Agriculture, Renewable Energy")
                .targetBusinessTypes("Farmers, Agro Cooperatives")
                .benefits("60% solar pump subsidy")
                .eligibility("Farmers with agricultural land")
                .status(SchemeStatus.PUBLISHED)
                .build();

        farmerScheme = Scheme.builder()
                .id(5L)
                .title("PM KISAN Agriculture Credit Subvention Scheme")
                .shortDescription("Interest subvention for agricultural credit and crop loans.")
                .description("Financial support for farmers and agricultural landowners.")
                .category(msmeCat)
                .targetIndustries("Agriculture, Farming")
                .targetBusinessTypes("Farmers")
                .benefits("3% interest subvention")
                .eligibility("All landholding farmers")
                .status(SchemeStatus.PUBLISHED)
                .build();

        hospitalityScheme = Scheme.builder()
                .id(6L)
                .title("National Hospitality & Tourism Infrastructure Grant")
                .shortDescription("Grant for hotel and tourism infrastructure development.")
                .description("Promoting hospitality sector enterprises across major tourist circuits.")
                .category(msmeCat)
                .targetIndustries("Hospitality, Tourism")
                .targetBusinessTypes("Private Limited, Proprietorship")
                .benefits("Capital grant")
                .eligibility("Hotels and resorts")
                .status(SchemeStatus.PUBLISHED)
                .build();

        sanitationScheme = Scheme.builder()
                .id(7L)
                .title("Swachh Sanitation Infrastructure Subsidy")
                .shortDescription("Subsidy for municipal sanitation equipment manufacturing.")
                .description("Sanitation equipment subsidy for MSMEs.")
                .category(msmeCat)
                .targetIndustries("Sanitation, Waste Management")
                .targetBusinessTypes("MSME")
                .benefits("Subsidy")
                .eligibility("Sanitation equipment manufacturers")
                .status(SchemeStatus.PUBLISHED)
                .build();

        securityScheme = Scheme.builder()
                .id(8L)
                .title("Industrial Security Patrol Capital Subsidy")
                .shortDescription("Subsidy for manufacturing industrial security barriers.")
                .description("Support for security system manufacturers.")
                .category(msmeCat)
                .targetIndustries("Security, Guarding Services")
                .targetBusinessTypes("MSME")
                .benefits("Capital subsidy")
                .eligibility("Security equipment makers")
                .status(SchemeStatus.PUBLISHED)
                .build();
    }

    @Test
    @DisplayName("Restaurant search query finds food processing & restaurant scheme")
    void testRestaurantSearch() {
        List<Scheme> all = List.of(restaurantScheme, womenScheme, startupScheme, solarScheme, farmerScheme);
        List<Scheme> ranked = SchemeSearchEngine.rankSchemes(all, "restaurant");

        assertFalse(ranked.isEmpty(), "Should find restaurant schemes");
        assertEquals(restaurantScheme.getId(), ranked.get(0).getId(), "PMFME food/restaurant scheme should be ranked first");
    }

    @Test
    @DisplayName("Restaurent typo handles intent mapping to food/restaurant scheme")
    void testRestaurantTypoSearch() {
        List<Scheme> all = List.of(restaurantScheme, womenScheme, startupScheme);
        List<Scheme> ranked = SchemeSearchEngine.rankSchemes(all, "restaurent");

        assertFalse(ranked.isEmpty(), "Should expand 'restaurent' typo to restaurant/food processing");
        assertEquals(restaurantScheme.getId(), ranked.get(0).getId());
    }

    @Test
    @DisplayName("Women search query finds Stand Up India Women Entrepreneurship scheme")
    void testWomenSearch() {
        List<Scheme> all = List.of(restaurantScheme, womenScheme, startupScheme, solarScheme);
        List<Scheme> ranked = SchemeSearchEngine.rankSchemes(all, "women");

        assertFalse(ranked.isEmpty());
        assertEquals(womenScheme.getId(), ranked.get(0).getId());
    }

    @Test
    @DisplayName("Startup search query finds Startup India Seed Fund")
    void testStartupSearch() {
        List<Scheme> all = List.of(restaurantScheme, womenScheme, startupScheme, solarScheme);
        List<Scheme> ranked = SchemeSearchEngine.rankSchemes(all, "startup");

        assertFalse(ranked.isEmpty());
        assertEquals(startupScheme.getId(), ranked.get(0).getId());
    }

    @Test
    @DisplayName("Solar search query finds PM-KUSUM Solar scheme")
    void testSolarSearch() {
        List<Scheme> all = List.of(restaurantScheme, womenScheme, startupScheme, solarScheme);
        List<Scheme> ranked = SchemeSearchEngine.rankSchemes(all, "solar");

        assertFalse(ranked.isEmpty());
        assertEquals(solarScheme.getId(), ranked.get(0).getId());
    }

    @Test
    @DisplayName("Farmer search query finds Agriculture schemes")
    void testFarmerSearch() {
        List<Scheme> all = List.of(restaurantScheme, womenScheme, startupScheme, solarScheme, farmerScheme);
        List<Scheme> ranked = SchemeSearchEngine.rankSchemes(all, "farmer");

        assertFalse(ranked.isEmpty());
        assertTrue(ranked.contains(farmerScheme) || ranked.contains(solarScheme));
    }

    @Test
    @DisplayName("IT search does NOT incorrectly rank Hospitality, Sanitation or Security schemes")
    void testITSearchDoesNotMatchSubstring() {
        List<Scheme> all = List.of(hospitalityScheme, sanitationScheme, securityScheme, restaurantScheme);

        Set<String> expandedTokens = SchemeSearchEngine.expandQueryTokens("IT");

        int hospScore = SchemeSearchEngine.calculateRelevanceScore(hospitalityScheme, "IT", expandedTokens);
        int sanScore = SchemeSearchEngine.calculateRelevanceScore(sanitationScheme, "IT", expandedTokens);
        int secScore = SchemeSearchEngine.calculateRelevanceScore(securityScheme, "IT", expandedTokens);

        assertEquals(0, hospScore, "IT search must NOT match Hospitality by naive substring!");
        assertEquals(0, sanScore, "IT search must NOT match Sanitation by naive substring!");
        assertEquals(0, secScore, "IT search must NOT match Security by naive substring!");
    }
}
