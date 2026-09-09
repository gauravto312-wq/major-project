package com.bizsahayak.config;

import com.bizsahayak.business.BusinessProfile;
import com.bizsahayak.business.BusinessProfileRepository;
import com.bizsahayak.business.VerificationStatus;
import com.bizsahayak.category.Category;
import com.bizsahayak.category.CategoryRepository;
import com.bizsahayak.category.CategoryType;
import com.bizsahayak.scheme.Scheme;
import com.bizsahayak.scheme.SchemeRepository;
import com.bizsahayak.scheme.SchemeStatus;
import com.bizsahayak.tender.Tender;
import com.bizsahayak.tender.TenderRepository;
import com.bizsahayak.tender.TenderStatus;
import com.bizsahayak.user.Role;
import com.bizsahayak.user.User;
import com.bizsahayak.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final CategoryRepository categoryRepository;
    private final SchemeRepository schemeRepository;
    private final TenderRepository tenderRepository;
    private final com.bizsahayak.government.repository.GovernmentSourceRepository governmentSourceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        migrateStatusColumns();
        seedAdminUser();
        seedCategories();
        seedDemoBusinessUser();
        seedGovernmentSources();
        seedSchemes();
        seedTenders();
    }

    private void migrateStatusColumns() {
        try {
            jdbcTemplate.execute("ALTER TABLE schemes MODIFY COLUMN status VARCHAR(50) NOT NULL");
            jdbcTemplate.execute("ALTER TABLE tenders MODIFY COLUMN status VARCHAR(50) NOT NULL");
            log.info("✓ Ensured schemes and tenders status columns are VARCHAR(50)");
        } catch (Exception e) {
            log.warn("Status column modification check: {}", e.getMessage());
        }
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@bizsahayak.in")) {
            User admin = User.builder()
                    .fullName("Platform Administrator")
                    .email("admin@bizsahayak.in")
                    .password(passwordEncoder.encode("Admin@123456"))
                    .phone("9876543210")
                    .role(Role.ROLE_ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("✓ Auto-seeded default admin user: admin@bizsahayak.in / Admin@123456");
        }
    }

    private void seedCategories() {
        createCategoryIfMissing("MSME & Small Business", "msme-small-business", "Schemes tailored for micro, small, and medium enterprises", CategoryType.SCHEME);
        createCategoryIfMissing("Subsidies & Grants", "subsidies-grants", "Direct financial assistance, capital subsidies and grants", CategoryType.SCHEME);
        createCategoryIfMissing("Loans & Credit Support", "loans-credit-support", "Collateral-free loans and credit guarantee schemes", CategoryType.SCHEME);
        createCategoryIfMissing("Food Processing & Agri", "food-processing-agri", "Assistance for agricultural and food processing industries", CategoryType.SCHEME);
        createCategoryIfMissing("Startup & Innovation", "startup-innovation", "Grants, incubation support and seed capital for startups", CategoryType.SCHEME);
        createCategoryIfMissing("Education & Scholarships", "education-scholarships", "Scholarships and educational loans for students", CategoryType.SCHEME);
        createCategoryIfMissing("Healthcare & Medical", "healthcare-medical", "Health insurance and medical support programs", CategoryType.SCHEME);
        createCategoryIfMissing("Housing & Urban Dev", "housing-urban-dev", "Housing assistance and urban development programs", CategoryType.SCHEME);
        createCategoryIfMissing("Women Empowerment", "women-empowerment", "Schemes dedicated to women entrepreneurs and welfare", CategoryType.SCHEME);
        createCategoryIfMissing("SC/ST Welfare", "sc-st-welfare", "Special assistance and reservation schemes for SC/ST categories", CategoryType.SCHEME);
        createCategoryIfMissing("Senior Citizens Welfare", "senior-citizens", "Pension and welfare support for senior citizens", CategoryType.SCHEME);
        createCategoryIfMissing("Persons with Disabilities", "persons-with-disabilities", "Rehabilitation and accessibility support schemes", CategoryType.SCHEME);
        createCategoryIfMissing("Employment & Skill Development", "employment-skill-development", "Skill training, apprenticeships and employment programs", CategoryType.SCHEME);
        createCategoryIfMissing("State Government Schemes", "state-government-schemes", "State-specific financial assistance and development schemes", CategoryType.SCHEME);

        createCategoryIfMissing("IT & Software Procurement", "it-software-procurement", "Government tenders for IT products, services and infrastructure", CategoryType.TENDER);
        createCategoryIfMissing("Solar & Renewable Energy", "solar-renewable-energy", "Procurement of solar panels and clean energy solutions", CategoryType.TENDER);
        createCategoryIfMissing("Machinery & Civil Works", "machinery-civil-works", "Construction, industrial equipment and machinery supply tenders", CategoryType.TENDER);
        log.info("✓ Ensured all public categories exist for Schemes and Tenders");
    }

    private void createCategoryIfMissing(String name, String slug, String desc, CategoryType type) {
        if (!categoryRepository.existsBySlug(slug)) {
            Category cat = Category.builder().name(name).slug(slug).description(desc).type(type).active(true).build();
            categoryRepository.save(cat);
        }
    }

    private void seedDemoBusinessUser() {
        if (!userRepository.existsByEmail("business@demo.com")) {
            User businessUser = User.builder()
                    .fullName("Ramesh Kumar")
                    .email("business@demo.com")
                    .password(passwordEncoder.encode("Demo@123456"))
                    .phone("9988776655")
                    .role(Role.ROLE_BUSINESS)
                    .active(true)
                    .build();
            User savedUser = userRepository.save(businessUser);

            BusinessProfile profile = BusinessProfile.builder()
                    .user(savedUser)
                    .businessName("Apex Food Products & Agro Enterprises")
                    .businessType("MSME")
                    .industry("Food Processing")
                    .state("Uttar Pradesh")
                    .district("Lucknow")
                    .businessEmail("contact@apexfoods.in")
                    .phone("9988776655")
                    .website("https://apexfoods.in")
                    .businessDescription("Manufacturer and processor of organic snacks and processed agro products.")
                    .turnoverRange("₹50 Lakh - ₹1 Crore")
                    .investmentRange("₹10 Lakh - ₹50 Lakh")
                    .employeeCount("11-50")
                    .verificationStatus(VerificationStatus.VERIFIED)
                    .verifiedAt(LocalDateTime.now())
                    .build();
            businessProfileRepository.save(profile);
            log.info("✓ Auto-seeded demo verified business user: business@demo.com / Demo@123456");
        }
    }

    private void seedSchemes() {
        if (schemeRepository.count() == 0) {
            Category msmeCat = categoryRepository.findBySlug("msme-small-business").orElse(null);
            Category agriCat = categoryRepository.findBySlug("food-processing-agri").orElse(null);
            Category loanCat = categoryRepository.findBySlug("loans-credit-support").orElse(null);

            Scheme s1 = Scheme.builder()
                    .title("PM Formalisation of Micro Food Processing Enterprises (PMFME)")
                    .slug("pmfme-food-processing-scheme")
                    .shortDescription("Provides 35% credit-linked capital subsidy up to ₹10 Lakh for micro food processing units.")
                    .description("PMFME Scheme aims to enhance competitiveness of existing individual micro-enterprises in the unorganized segment of the food processing industry and promote formalization of the sector. Capital subsidy is provided at 35% of eligible project cost with a maximum ceiling of ₹10 lakh per unit.")
                    .department("Ministry of Food Processing Industries")
                    .ministry("Ministry of Food Processing Industries")
                    .category(agriCat)
                    .schemeType("Subsidy")
                    .state("Uttar Pradesh")
                    .district("All Districts")
                    .benefits("35% Credit Linked Capital Subsidy (Max ₹10 Lakh), Seed Capital support of ₹40,000 per SHG member, Branding and marketing support.")
                    .eligibility("Micro Food Processing Units, Existing micro-enterprises, SHGs, FPOs, Cooperatives. Minimum age of applicant: 18 years.")
                    .requiredDocuments("PAN Card, Aadhaar Card, UDYAM Registration, Detailed Project Report (DPR), Bank Statement (6 Months), Land/Lease agreement.")
                    .applicationProcess("Online application through Ministry portal. DPR submission followed by bank appraisal and state nodal agency approval.")
                    .startDate(LocalDate.now().minusMonths(6))
                    .deadline(LocalDate.now().plusMonths(6))
                    .officialApplicationUrl("https://pmfme.mofpi.gov.in")
                    .officialSourceUrl("https://mofpi.gov.in")
                    .status(SchemeStatus.PUBLISHED)
                    .featured(true)
                    .targetIndustries("Food Processing, Agriculture")
                    .targetBusinessTypes("MSME, Proprietorship, Partnership, Private Limited")
                    .publishedAt(LocalDateTime.now())
                    .build();

            Scheme s2 = Scheme.builder()
                    .title("Prime Minister Employment Generation Programme (PMEGP)")
                    .slug("pmegp-employment-scheme")
                    .shortDescription("Credit linked subsidy scheme for setting up new micro-enterprises in manufacturing and services.")
                    .description("PMEGP is a major credit-linked subsidy programme aimed at generating self-employment opportunities through establishment of micro-enterprises in non-farm sector. Margin money subsidy ranges from 15% to 35% depending on location and category.")
                    .department("KVIC / Ministry of MSME")
                    .ministry("Ministry of Micro, Small and Medium Enterprises")
                    .category(msmeCat)
                    .schemeType("Subsidy & Loan")
                    .state("All India")
                    .district("All Districts")
                    .benefits("Margin Money subsidy up to 35% in rural areas and 25% in urban areas. Max project cost ₹50 Lakh for Manufacturing and ₹20 Lakh for Service sector.")
                    .eligibility("Individuals above 18 years, SHGs, Institutions registered under Societies Registration Act 1860, Production Co-operative Societies.")
                    .requiredDocuments("Aadhaar Card, Project Report, Educational Qualification Certificate, Caste/Special Category Certificate (if applicable).")
                    .applicationProcess("Submit online application via KVIC e-portal. Application forwarded to District Industries Centre (DIC) / KVIC for scrutiny.")
                    .startDate(LocalDate.now().minusMonths(12))
                    .deadline(LocalDate.now().plusMonths(12))
                    .officialApplicationUrl("https://www.kviconline.gov.in/pmegpeportal")
                    .officialSourceUrl("https://msme.gov.in")
                    .status(SchemeStatus.PUBLISHED)
                    .featured(true)
                    .targetIndustries("Manufacturing, Food Processing, IT Services, Textile, Agriculture")
                    .targetBusinessTypes("MSME, Proprietorship, Partnership, Individual Enterprise")
                    .publishedAt(LocalDateTime.now())
                    .build();

            Scheme s3 = Scheme.builder()
                    .title("Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)")
                    .slug("cgtmse-collateral-free-loan-scheme")
                    .shortDescription("Collateral-free credit facility up to ₹5 Crore for Micro and Small Enterprises.")
                    .description("CGTMSE provides credit guarantee coverage to Member Lending Institutions (MLIs) to facilitate collateral-free credit flow to MSE sector. Covers both term loans and working capital facility.")
                    .department("Ministry of MSME & SIDBI")
                    .ministry("Ministry of Micro, Small and Medium Enterprises")
                    .category(loanCat)
                    .schemeType("Credit Guarantee")
                    .state("All India")
                    .district("All Districts")
                    .benefits("Collateral-free loan coverage up to ₹5 Crore, Guarantee cover ranging from 75% to 85% of sanctioned loan.")
                    .eligibility("New and existing Micro and Small Enterprises (Manufacturing and Services). Retail trade and Educational institutions are also eligible.")
                    .requiredDocuments("Business Registration Certificate, Project Report, Financial Statements (Audited), IT Returns of last 2 years.")
                    .applicationProcess("Apply directly to participating Scheduled Commercial Banks, Regional Rural Banks, or Small Finance Banks under CGTMSE scheme.")
                    .startDate(LocalDate.now().minusMonths(3))
                    .deadline(LocalDate.now().plusMonths(24))
                    .officialApplicationUrl("https://www.cgtmse.in")
                    .officialSourceUrl("https://www.cgtmse.in")
                    .status(SchemeStatus.PUBLISHED)
                    .featured(true)
                    .targetIndustries("Manufacturing, Food Processing, IT Services, Textile")
                    .targetBusinessTypes("MSME, Proprietorship, Partnership, Private Limited, LLP")
                    .publishedAt(LocalDateTime.now())
                    .build();

            schemeRepository.saveAll(java.util.List.of(s1, s2, s3));
            log.info("✓ Auto-seeded featured government schemes");
        }
    }

    private void seedTenders() {
        if (tenderRepository.count() == 0) {
            Category itCat = categoryRepository.findBySlug("it-software-procurement").orElse(null);
            Category solarCat = categoryRepository.findBySlug("solar-renewable-energy").orElse(null);

            Tender t1 = Tender.builder()
                    .title("Procurement & Installation of 100 kW Roof Solar PV Power Plant")
                    .slug("procurement-100kw-solar-pv-plant")
                    .tenderNumber("TNT-SOLAR-2026-089")
                    .organization("Uttar Pradesh New & Renewable Energy Development Agency (UPNEDA)")
                    .department("Department of Additional Sources of Energy")
                    .category(solarCat)
                    .description("Supply, installation, testing, commissioning and comprehensive maintenance of grid-connected 100 kW Rooftop Solar PV Power Plant for District MSME Incubation Hub.")
                    .location("Lucknow")
                    .state("Uttar Pradesh")
                    .district("Lucknow")
                    .estimatedValue(4500000.0) // ₹45 Lakhs
                    .publishDate(LocalDate.now().minusDays(10))
                    .closingDate(LocalDate.now().plusDays(25))
                    .eligibility("Registered Solar Power EPC Contractors, Class-A Electrical Contractors with past experience of minimum 50 kW installation.")
                    .requiredDocuments("GST Registration, PAN Card, Turn-over certificate of last 3 years, past completion certificates.")
                    .requirements("All solar modules must be ALMM compliant and manufactured in India (DCR compliance).")
                    .officialTenderUrl("https://etender.up.nic.in")
                    .officialSourceUrl("https://upneda.org.in")
                    .status(TenderStatus.PUBLISHED)
                    .featured(true)
                    .targetIndustries("Solar & Renewable Energy, Manufacturing")
                    .targetBusinessTypes("MSME, Private Limited, Partnership")
                    .publishedAt(LocalDateTime.now())
                    .build();

            Tender t2 = Tender.builder()
                    .title("Supply & Maintenance of Digital Billing & Enterprise Software for MSME Centers")
                    .slug("supply-digital-billing-enterprise-software")
                    .tenderNumber("CPPP-IT-2026-4412")
                    .organization("National Small Industries Corporation (NSIC)")
                    .department("Ministry of MSME")
                    .category(itCat)
                    .description("Design, development, deployment and 3-year support of cloud-based digital billing and MSME inventory management software portal.")
                    .location("New Delhi")
                    .state("All India")
                    .district("Central Region")
                    .estimatedValue(7500000.0) // ₹75 Lakhs
                    .publishDate(LocalDate.now().minusDays(5))
                    .closingDate(LocalDate.now().plusDays(30))
                    .eligibility("CMMI Level 3 software development companies, registered Startups and MSMEs under IT sector.")
                    .requiredDocuments("GST, Company Incorporation Certificate, ISO 27001 certificate, Audited Balance Sheets.")
                    .requirements("Must support multi-language interface (Hindi, English, regional Indian languages).")
                    .officialTenderUrl("https://eprocure.gov.in")
                    .officialSourceUrl("https://nsic.co.in")
                    .status(TenderStatus.PUBLISHED)
                    .featured(true)
                    .targetIndustries("IT Services, Software Development")
                    .targetBusinessTypes("MSME, Private Limited, LLP")
                    .publishedAt(LocalDateTime.now())
                    .build();

            tenderRepository.saveAll(java.util.List.of(t1, t2));
            log.info("✓ Auto-seeded featured government tenders");
        }
    }

    private void seedGovernmentSources() {
        if (governmentSourceRepository.count() == 0) {
            com.bizsahayak.government.model.GovernmentSource s1 = com.bizsahayak.government.model.GovernmentSource.builder()
                    .name("API Setu myScheme Portal API")
                    .description("National repository API collection for MSME and Central/State Government Schemes.")
                    .providerCode("MY_SCHEME_APISETU")
                    .sourceType(com.bizsahayak.government.model.GovernmentSourceType.DATA_API)
                    .contentType(com.bizsahayak.government.model.GovernmentContentType.SCHEME)
                    .baseUrl("https://api.apisetu.gov.in/v1")
                    .apiUrl("https://api.apisetu.gov.in/v1/myscheme/schemes")
                    .documentationUrl("https://directory.apisetu.gov.in/api-collection/myscheme")
                    .termsUrl("https://apisetu.gov.in/terms")
                    .authenticationType("API_KEY")
                    .credentialReference("API_SETU_MYSCHEME_API_KEY")
                    .active(true)
                    .syncFrequency("0 0 */6 * * *")
                    .rateLimitNotes("100 requests per minute limit")
                    .build();

            com.bizsahayak.government.model.GovernmentSource s2 = com.bizsahayak.government.model.GovernmentSource.builder()
                    .name("Open Government Data Platform (data.gov.in)")
                    .description("Official procurement and MSME financial assistance tenders dataset portal.")
                    .providerCode("DATA_GOV_IN")
                    .sourceType(com.bizsahayak.government.model.GovernmentSourceType.OFFICIAL_DATASET)
                    .contentType(com.bizsahayak.government.model.GovernmentContentType.TENDER)
                    .baseUrl("https://api.data.gov.in/resource/msme-tenders")
                    .apiUrl("https://api.data.gov.in/resource/msme-tenders?format=json")
                    .documentationUrl("https://data.gov.in")
                    .termsUrl("https://data.gov.in/terms")
                    .authenticationType("API_KEY")
                    .credentialReference("GOV_DATA_API_KEY")
                    .active(true)
                    .syncFrequency("0 0 */12 * * *")
                    .rateLimitNotes("Standard Open Data API rate limits apply")
                    .build();

            governmentSourceRepository.saveAll(java.util.List.of(s1, s2));
            log.info("✓ Auto-seeded official Government Data Sources (myScheme API Setu & Data.gov.in)");
        }
    }
}
