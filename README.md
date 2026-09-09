# BizSahayak — Government Schemes, Subsidies & Tenders Discovery Portal

**BizSahayak** is a production-quality full-stack platform designed to help individual users, businesses, and MSMEs discover central & state government schemes, capital subsidies, collateral-free credit, and government procurement tenders in one place.

---

## Technology Stack

### Backend
- **Framework**: Java 17, Spring Boot 3.2.4, Maven
- **Security**: Spring Security + Stateless JWT Authentication + BCrypt Password Encoding
- **Database**: MySQL 8.x (with automated fallback to H2 embedded database for local dev execution)
- **API & Docs**: RESTful APIs, Jakarta Bean Validation, Springdoc OpenAPI / Swagger UI
- **Auditing & Monitoring**: Spring Boot Actuator, SLF4J / Logback, Database Audit Logs

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Routing & State**: React Router v6, Context API (`AuthContext`), Axios with Bearer Interceptor
- **UI & Styling**: Tailwind CSS, Lucide Icons, Responsive Layouts, Dynamic Status Badges

---

## Features & Modules

1. **Public Discovery Portal**:
   - Browse central & state schemes, subsidies, loans, and tenders without logging in.
   - Multi-criteria filter (State, Category, Scheme Type) and keyword search.
   - External link button to official government portals (`eprocure.gov.in`, `pmfme.mofpi.gov.in`, `cgtmse.in`).

2. **Business / MSME Portal**:
   - Business Profile setup (Industry, Entity Type, State, Turnover & Investment ranges).
   - Document Upload Vault (GST, UDYAM, PAN, Financial Statements).
   - Request Admin Verification workflow (`PENDING` -> `VERIFIED` / `REJECTED` / `CORRECTION_REQUIRED`).
   - **Rule-Based Recommendation Engine**: Calculates percentage match scores (95%, 88%, 76%) with itemized match reasoning.
   - Bookmark / Saved Opportunities (`/business/saved`).
   - Internal Application Activity Tracker (`INTERESTED` → `PREPARING` → `APPLIED` → `COMPLETED`).
   - In-app notification alerts for verification updates and deadlines.

3. **Admin Control Panel**:
   - Overall platform dashboard statistics & database metrics.
   - Business Verification Applications review panel (inspect documents, approve, reject, or request corrections with notes).
   - Scheme Management CRUD (create, edit, publish, deactivate, archive, feature).
   - Tender Management CRUD (create, edit, publish, close, archive, feature).
   - Administrative Action Audit Logs (`/admin/audit-logs`).
   - Government Data Sources configuration for automated data collection.

---

## Pre-Seeded Accounts

Upon first launch, the database automatically seeds default records:

### 1. Administrator Account
- **Email**: `admin@bizsahayak.in`
- **Password**: `Admin@123456`
- **Role**: `ROLE_ADMIN`

### 2. Verified Business Demo Account
- **Email**: `business@demo.com`
- **Password**: `Demo@123456`
- **Role**: `ROLE_BUSINESS`
- **Business Profile**: Apex Food Products & Agro Enterprises (`VERIFIED`)

---

## Running the Application

### 1. Backend (Spring Boot)

#### Option A: Running with MySQL (Default)
1. Ensure MySQL is running on `localhost:3306`.
2. Create database `bizsahayak_db` (or allow Spring Boot auto-creation):
   ```sql
   CREATE DATABASE bizsahayak_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Update `backend/src/main/resources/application.yml` credentials if needed (`root`/`root`).
4. Start the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

#### Option B: Running with Embedded H2 Database (Zero DB Setup)
If MySQL is not currently running locally, start the backend with the H2 profile:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
Access H2 Console at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:bizsahayak_db`).

#### OpenAPI / Swagger UI
Once backend starts, view interactive API documentation at:
- `http://localhost:8080/swagger-ui.html`

---

### 2. Frontend (React + TypeScript + Vite)

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at:
   - `http://localhost:5173`

---

## Project Structure

```text
bysh2/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/bizsahayak/
│           │   ├── config/             # Security, CORS, Swagger, DataInitializer
│           │   ├── security/           # JWT Provider, Filter, UserDetailsService
│           │   ├── auth/               # Register, Login, AuthController
│           │   ├── user/               # User Entity & Repository
│           │   ├── business/           # Profile, Verification Workflow
│           │   ├── document/           # Document Vault & File Storage
│           │   ├── scheme/             # Scheme CRUD, Search & Filters
│           │   ├── tender/             # Tender CRUD & Closing Management
│           │   ├── category/           # Categories Service & Controller
│           │   ├── recommendation/     # Transparent Rule-Based Match Engine
│           │   ├── saved/              # Saved Opportunities (Bookmark)
│           │   ├── application/        # Application Tracker
│           │   ├── notification/       # In-App Notifications
│           │   ├── admin/              # Dashboard Stats, Verification & Audit Logs
│           │   ├── source/             # Government Data Source Architecture
│           │   └── exception/          # Global Exception Advice
│           └── resources/
│               ├── application.yml
│               └── schema.sql
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── components/                 # Navbar, Footer, Badge, Pagination, Cards
        ├── context/                    # AuthContext (JWT & User state)
        ├── services/                   # Axios HTTP API services
        ├── types/                      # TypeScript definitions
        ├── pages/                      # Public, Auth, Business, Admin pages
        ├── routes/                     # AppRoutes with RBAC Protection
        └── App.tsx
```

---

## Verification & Testing Workflow

1. Start backend (`mvn spring-boot:run`) and frontend (`npm run dev`).
2. **Public User**: Browse `/schemes` and `/tenders`, apply filters for State or Type, view scheme details and official government application links.
3. **Business User**: Login as `business@demo.com` / `Demo@123456`, view verified dashboard, check rule-based scheme match scores (`95% Match`), bookmark a scheme, track application activity.
4. **Admin User**: Login as `admin@bizsahayak.in` / `Admin@123456`, navigate to `/admin`, review pending business verification, add/publish new schemes and tenders, view system audit logs.
