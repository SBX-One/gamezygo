# Website Development PRD

**Product Requirements Document — Full-Stack Web Development**

---

## Document Information

| Field                 | Value                 |
| --------------------- | --------------------- |
| **Project Name**      | Gamezygo E-Commerce   |
| **Scope**             | E-Commerce            |
| **Version**           | 0.6                   |
| **Date**              | 24/06/2026            |
| **Prepared By**       | Dhiyo Wikantara       |
| **Client / Project**  | Gamezygo              |
| **Website Type**      | E-Commerce            |
| **Tech Stack**        | NextJS + Laravel      |
| **Hosting**           | -                     |
| **Target Launch**     | Early to Late October |
| **Development Model** | Waterfall             |

---

## Document Revision History

| Version | Date       | Author          | Description of Change |
| ------- | ---------- | --------------- | --------------------- |
| 0.1     | 24/06/2026 | Dhiyo Wikantara | Initial Draft         |
| 0.2     | 26/06/2026 | Dhiyo Wikantara | Project Scope         |
| 0.3     | 27/06/2026 | Dhiyo Wikantara | Third Party Plugins   |
| 0.4     | 28/06/2026 | Dhiyo Wikantara | Third Party Plugins   |
| 0.5     | 01/07/2026 | Dhiyo Wikantara | VPS and Technology    |
| 0.6     | 03/07/2026 | Dhiyo Wikantara | Technology Correction |
| 0.7     | 07/07/2026 | Dhiyo Wikantara | Sprint Draft          |

---

## 1. Executive Summary

This document defines the complete product requirements for the development of **Gamezygo**. It covers technical architecture, functional requirements, non-functional requirements, content structure, third-party integrations, and acceptance criteria.

This PRD is the contractual reference for all development, testing, and delivery activities and must be signed off by all key stakeholders before development commences.

---

## 2. Project Overview

### 2.1 Background

Gamezygo is a dedicated B2C e-commerce platform specializing in the sale of shared gaming accounts at budget-friendly prices. The project aims to transition the business from manual, link-based sales into a fully automated, visually premium digital storefront to optimize user experience and scale transaction volumes.o

### 2.2 Business Objectives

- Elevate Brand Professionalism & Trust
- Simplify the purchasing process
- Centralize All Operation
- Establish a Solid Business Foundation
- Real Time Revenue Visibility
- Scalable Architecture for Future Upgrade

### 2.3 Success Criteria

| **Metric**                                     | **Current Baseline**              | **Target**                                                                                                                                     | **Verification Method**                                                 |
| ---------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Payment & Credential Delivery Automation**   | Manual link verification via chat | **100% automated** account credential injection to user's **Game Library** immediately after Midtrans successful callback.                     | Midtrans Webhook Logs & Laravel Event Auditor                           |
| **Voucher & Checkout Calculation Accuracy**    | N/A (Manual price cuts)           | **0% discrepancy** between React cart calculation, Laravel backend validation, and the final amount charged by Midtrans.                       | Automated E2E Testing (Playwright/Cypress) & DB Transaction Audits      |
| **Google OAuth Onboarding Reliability**        | N/A                               | **< 1% failure rate** on Google Login for both new user registration and existing user sessions.                                               | Sentry Error Tracking & Laravel Exception Logs                          |
| **Data Isolation & Security (Shared Account)** | Scattered manual links            | **Zero leakage.** 100% guarantee that credentials in the Game Library are only visible to the designated buyer asset.                          | Database Row-Level Constraint Audits & Integration Tests                |
| **Pre-Order & Request Routing**                | Manual user request via text      | **100% real-time delivery** of user-submitted product requests directly to the Admin Request Management panel.                                 | Database Entry Sync Verification                                        |
| **Admin Revenue Dashboard Real-Time Sync**     | Manual bookkeeping                | **0 minutes delay** (Real-time data stream) reflecting gross sales, active vouchers, and net revenue matching Midtrans actual settlement data. | Midtrans Reconciliation Reports vs Backend Dashboard Analytics.. .. ... |
| **Platform System Availability (Core Flow)**   | Down during manual updates        | **99.9% Uptime** specifically for the core checkout and account access flows.                                                                  | Health-check endpoints / Integration Monitoring Tools                   |

---

## 3. Scope of Work

### 3.1 In Scope ✓

- Frontend development
- Backend development: API endpoints, database schema, and server logic
- CMS integration and content structure setup
- 3rd-party service integrations (see Section 7)
- Responsive design implementation (mobile, tablet, desktop)
- On-page SEO implementation: metadata, structured data, sitemap, robots.txt
- Performance optimization: code splitting, image optimization, caching
- Security hardening: HTTPS, input sanitization, auth implementation
- Cross-browser testing: Chrome, Safari, Firefox, Edge (latest 2 versions)
- UAT support and bug fixing within [X] days post-delivery

### 3.2 Out of Scope ✗

- Content copywriting and photography / video production
- Ongoing SEO strategy and link building
- Marketing automation workflows (unless listed in integrations)
- Mobile application development (iOS / Android)
- Ongoing maintenance and hosting management post-handoff

---

## 4. Functional Requirements

### 4.1 User Authentication & Access Control

| **ID**    | **Requirement**                      | **Priority** | **Notes**                                                                                                                                                                 |
| --------- | ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-01** | **Google OAuth 2.0 Integration**     | P1           | One-click onboarding via Google Login to minimize conversion friction. Handled via React frontend and authenticated securely via Laravel Sanctum/Passport on the backend. |
| **FR-02** | **Role-Based Access Control (RBAC)** | P1           | Hard boundary separation between two roles: **Customer** (Storefront, Library) and **Admin** (Full Management Panel).                                                     |
| **FR-03** | **Profile Management**               | P2           | Customers can view their account details, track past transaction statuses, and update basic profile preferences.                                                          |
| **FR-04** | **Token Management**                 | P1           | Secure, stateless token sessions managed through React state/local storage and validated per-request by Laravel middleware.                                               |
| FR-05     | Authorization & Access Control       | P1           | Secure the invoice or payment from the other user. Prevent data leakage and miss match payment data.                                                                      |

### 4.2 Content Management (Native Admin CMS)

| **ID**    | **Requirement**                   | **Priority** | **Notes**                                                                                                                        |
| --------- | --------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **FR-06** | **Articles CMS Panel**            | P2           | Native markdown/rich-text editor in the Laravel admin panel for publishing blogs, SEO content, and gaming guides.                |
| **FR-07** | **Announcement Management Panel** | P1           | Admin can create, schedule, and push system-wide alerts/banners. React frontend fetches and displays these dynamically to users. |
| **FR-08** | **FAQ Management Panel**          | P2           | Admin CRUD interface to maintain a dynamic list of frequently asked questions for immediate user troubleshooting.                |

### 4.3 Core Features

#### User Storefront & Library (React Frontend)

| **ID**    | **Requirement**                          | **Priority** | **Notes**                                                                                                                                                                                                                  |
| --------- | ---------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-09** | **Interactive Cart System**              | P1           | Allows users to add multiple shared game accounts, calculating subtotals dynamically on the frontend before sending payload to backend.                                                                                    |
| **FR-10** | **Checkout & Voucher Engine**            | P1           | Validates active voucher/coupon codes on Laravel backend against cart items and expiration parameters before establishing transaction.                                                                                     |
| **FR-11** | **Midtrans Payment Gateway Integration** | P1           | Triggers Midtrans Snap popup/Core API on checkout. Laravel must listen to asynchronous Midtrans Webhook callbacks to verify payment status.                                                                                |
| **FR-12** | **Secure Game Library Delivery**         | P1           | Post-payment confirmation, the system automatically injects the shared account credentials (username/password/token) into the user's specific library view. Must strictly guarantee zero cross-user credential data leaks. |
| **FR-13** | **Product Request & Pre-Order Flow**     | P2           | Dedicated forms allowing users to ask for unlisted titles or down-pay for upcoming shared accounts, pushing data instantly to the backend database.                                                                        |
| **FR-14** | **Gamified Leaderboard**                 | P2           | Ranks top buyers or active users on the platform based on purchase volumes/points to drive repeat sales engagement.                                                                                                        |
| **FR-15** | **User Review Submission**               | P2           | Post-purchase feature permitting verified buyers to drop star ratings and written reviews directly onto game product pages.                                                                                                |

#### Operational Management (Laravel Admin Backend)

| **ID**    | **Requirement**                       | **Priority** | **Notes**                                                                                                                                     |
| --------- | ------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-16** | **Catalog & Shared Stock Management** | P1           | Full Admin CRUD for game titles, price variables, images, and the bulk upload of the actual credentials behind the shared accounts.           |
| **FR-17** | **Real-Time Revenue Dashboard**       | P1           | Automated financial reporting interface showing gross sales, successful payment conversions, and voucher usages pulled from DB/Midtrans sync. |
| **FR-18** | **Game Request Processing Panel**     | P2           | Dedicated dashboard queue for admins to review user product requests and process pre-order queues.                                            |
| **FR-19** | **User & Catalog Analytics Track**    | P2           | Internal tracking metrics showing trending game titles, customer drop-off data, and platform conversion rates.                                |
| **FR-20** | **Review Moderation Queue**           | P2           | Moderation space allowing admin to approve, hide, or remove customer reviews to filter out malicious spam.                                    |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric                             | Requirement                                        |
| ---------------------------------- | -------------------------------------------------- |
| **Largest Contentful Paint (LCP)** | ≤ 2.5 seconds                                      |
| **First Input Delay (FID)**        | ≤ 100 milliseconds                                 |
| **Cumulative Layout Shift (CLS)**  | ≤ 0.1                                              |
| **Time to First Byte (TTFB)**      | ≤ 600 milliseconds                                 |
| **Concurrent Users**               | Support 1.000 concurrent users without degradation |
| **API Response Time**              | 95th percentile ≤ [X]ms under load                 |

### 5.2 Security

- HTTPS enforced site-wide with HSTS headers
- OWASP Top 10 vulnerabilities mitigated
- SQL injection and XSS prevention via parameterized queries and content sanitization
- Rate limiting on all public-facing API endpoints
- Data at rest encrypted with AES-256; in-transit via TLS 1.3
- GDPR / PDPA compliance: cookie consent banner, privacy policy, data deletion

### 5.3 Browser & Device Compatibility

| Category               | Requirement                                               |
| ---------------------- | --------------------------------------------------------- |
| **Browsers**           | Chrome 100+, Safari 15+, Firefox 100+, Edge 100+          |
| **Mobile Breakpoints** | 375px (mobile), 768px (tablet), 1280px / 1440px (desktop) |
| **OS**                 | iOS 15+, Android 10+, macOS, Windows 10/11                |
| **Screen Resolutions** | Tested at 360×640 through 2560×1440                       |

---

## 6. Page & Content Structure

### 6.1 Site Map

| Page ID | Page Name                | URL Slug          | Priority | CMS Editable |
| ------- | ------------------------ | ----------------- | -------- | ------------ |
| PG-01   | Homepage                 | /                 | P1       | Yes          |
| PG-02   | About Us                 | /about            | P1       | Yes          |
| PG-03   | [Service / Product Page] | /[slug]           | P1       | Yes          |
| PG-04   | Blog / News Index        | /blog             | P2       | Yes          |
| PG-05   | Blog Post Template       | /blog/[post-slug] | P2       | Yes          |
| PG-06   | Contact Us               | /contact          | P1       | Yes          |
| PG-07   | Privacy Policy           | /privacy-policy   | P1       | Yes          |
| PG-08   | 404 / Error Page         | /404              | P2       | Partial      |

---

## 7. Integrations, Third Party & Technologies

### 7.1 Technologies Used

| **Service**                                                                                   | **Purpose**                                                                                                                                                                                | **Integration Method**                                                                                                                                                       | **Priority** |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **Midtrans**                                                                                  | Core payment gateway to process Indonesian localized payments (QRIS, E-Wallet, Virtual Accounts).                                                                                          | **React:** Midtrans Snap JS SDK (Frontend overlay popup).                                                                                                                    |
| **Laravel:** Core API & Secure Webhook HTTP Listener for automated payment callbacks.         | **P1**                                                                                                                                                                                     |
| **Google OAuth 2.0**                                                                          | Frictionless customer authentication and instant login.                                                                                                                                    | **React:** Google Identity Services SDK to capture access tokens.                                                                                                            |
| **Laravel:** Laravel Socialite / Sanctum middleware to validate tokens and sign JWT sessions. | **P1**                                                                                                                                                                                     |
| **Cloudflare**                                                                                | DNS management, SSL termination, DDoS protection, and global caching for the React SPA storefront assets.                                                                                  | Reverse Proxy / Nameserver Routing.                                                                                                                                          | **P1**       |
| **Brevo / Mailgun**                                                                           | Transactional email delivery service for payment receipts, notification of successful pre-orders, and system updates.                                                                      | Laravel Mail Driver via SMTP / REST API.                                                                                                                                     | **P2**       |
| **Redis**                                                                                     | High-performance caching for game catalogs and leaderboards, and a queue broker to process asynchronous background jobs (automated emails, transaction status checks, and order timeouts). | **Laravel:** Configure Redis driver using the `predis/predis` package or `phpredis` extension to handle queues and cache storage.                                            | **P2**       |
| **AWS Bucket**                                                                                | Centralized cloud storage for all static assets (game covers, announcement banners, blog CMS images) to keep the Laravel server lightweight and scalable.                                  | **Laravel:** Use the Flysystem S3 package (`league/flysystem-aws-s3-v3`) with IAM API keys. Files are uploaded via the Admin CMS, and URLs are parsed to the React frontend. | **P1**       |
| **JWT**                                                                                       | Stateless and secure authentication mechanism to secure data communication between the React SPA (Frontend) and Laravel REST API (Backend).                                                | Laravel: Generated via Laravel Sanctum/Passport after successful Google OAuth login.                                                                                         |

React: Stored in client-side state/secure storage and sent via HTTP Header Authorization: Bearer <token> on every protected API request (e.g., checkout, Game Library access). | **P1** |

### 7.2 VPS Specification

#### Service Provider : Hostinger

| Specs                | Details         |
| -------------------- | --------------- |
| **vCPU**             | 2 Core          |
| **RAM**              | 8 GB            |
| **Storage**          | 100 GB Nvme SSD |
| **Bandwidth**        | 9 TB/Month      |
| **Processor**        | AMD EPYC        |
| **Operating System** | Docker          |
| **Data Center**      | Indonesia       |

---

## 8. Deliverables & Project Timeline

| Sprint / Phase                            | Deliverable                                                                                      | Duration | Milestone Date    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ | -------- | ----------------- |
| **Sprint 1: Foundation & Setup**          | Design System, Information Architecture (IA), Docker Env, Repositories Boilerplate, QA Env Setup | 12 Days  | 20 July 2026      |
| **Sprint 2: User Design & API Contracts** | User-side UI (10 Flows), DB Schema, API Contracts & Mock Data, Global Test Plan                  | 15 Days  | 4 August 2026     |
| **Sprint 3: Admin Design & Final ACC**    | Admin-side UI (16+ Flows), Interactive Prototypes, **Final Design ACC**, CI/CD Pipeline Scripts  | 16 Days  | 20 August 2026    |
| **Sprint 4: Core Development I**          | Google Auth, Game Catalog (FE/BE), Admin Bulk Stock Upload, Authentication Security Test         | 14 Days  | 3 September 2026  |
| **Sprint 5: Core Development II**         | Cart Logic, Voucher Calculation, Midtrans Checkout Integration, Payment Security Test            | 15 Days  | 18 September 2026 |
| **Sprint 6: VPS Setup & Final Features**  | Game Library Automation, Leaderboard, **Hostinger VPS Setup**, Staging Deploy, Load Testing      | 14 Days  | 2 October 2026    |
| **Phase C: UAT & Go-Live**                | Client UAT, Staging DB Cleanup, Live Stock Migration, Production API Swap, **Go-Live**           | 8 Days   | 10 October 2026   |

---

### **PHASE A: DESIGN SYSTEM & TECHNICAL PREPARATION (Sprints 1 – 3)**

_Parallel Phase: The UI/UX team focuses entirely on visual designs and interactive prototypes, while developers and QA prepare the server environment, code boilerplate, API contracts, and test environments._

#### **Sprint 1: July 8 – July 20, 2026 (KICK-OFF TODAY)**

_Focus: Setting the design foundation (Design System), Creating Boilerplate & Repositories, Creating Docker Env, and QA Environment Setup._

| Role                  | Key Activities & Tasks                                                                                                                                    | Output / Deliverable                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **UI Designer**       | Set up the **Figma Design System** (Typography, Color Palette, Buttons, Form Inputs, Game Cards) [PRD, 7.1]                                               | Figma Design System Link (v1.0)                  |
| **UI Designer**       | Design the landing page for client approval to establish the brand/design style                                                                           | Landing Page High-Fidelity Design                |
| **Product Designer**  | Set up the User Flow, Sitemap, and Information Architecture (IA) for the website                                                                          | Sitemap, User Personas, Information Architecture |
| **BE & FE Developer** | Set up Docker for project initialization and define code standards for both frontend and backend.                                                         | Docker Env & Code Standards Guideline            |
| **FE Developer**      | Initialize Next.js project, install Tailwind CSS, set up file directory structure, and basic routing                                                      | Next.js Boilerplate & Git Repository             |
| **BE Developer**      | Initialize Laravel project and configure basic JWT Auth with Laravel Sanctum/Passport [PRD, 7.1]                                                          | Laravel API Boilerplate & Git Repository         |
| **QA Engineer**       | Set up automated testing framework environment (install Cypress or Playwright) and define QA toolstack. _(Shifted from writing Test Plan to setup phase)_ | Configured Test Automation Repository            |

_Note: To continue to the next sprint, we require Arsa Wibawa’s approval for the Information Architecture and Sample Design._

---

#### **Sprint 2: July 20 – August 4, 2026**

_Focus: Designing the customer-side flows, drafting API Contracts, and QA planning based on approved IA._

| Role                  | Key Activities & Tasks                                                                                                                | Output / Deliverable                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Product Designer**  | Create interactive prototypes for user/customer-side screens and perform Usability Testing with the client                            | Interactive Prototype for Customer-Side Flows     |
| **UI/UX Designer**    | Design the homepage, product pages, cart, and authentication modules (10 User-side flows)                                             | High-Fidelity UI Designs (Homepage, Cart, Detail) |
| **FE & BE Developer** | **Define & Lock API Contract (Swagger/Postman) for User Flows. Prepare Mock Data so FE can code UI without waiting for actual APIs.** | Finalized API Contract & Mock Data Ready          |
| **FE Developer**      | Set up global state management (Zustand/Redux) & prepare Midtrans Snap SDK and Google Login configurations                            | Next.js with Integrated Auth & Cart State         |
| **BE Developer**      | Design database table structures (Migrations) & prepare AWS S3 SDK and Laravel Socialite integrations                                 | Database Migrations & Google Login API Setup      |
| **QA Engineer**       | Draft the Global Test Plan and detailed Test Cases based on the finalized Information Architecture and User Flows from Sprint 1.      | Completed _Test Plan & Test Cases_ Document       |

---

#### **Sprint 3: August 4 – August 20, 2026 (Design Handoff!)**

_Focus: Designing the admin panels, finalizing interactive prototypes, staging server deployment, and setting up global components in the frontend._

| Role                 | Key Activities & Tasks                                                                                                                                                  | Output / Deliverable                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **UI/UX Designer**   | Design all admin panels (16+ Admin-side flows: Catalog CMS, Voucher, FAQ, Blog CMS)                                                                                     | High-Fidelity Designs for Admin Dashboard                  |
| **Product Designer** | Finalize admin prototypes in Figma, perform final Usability Testing with client, and refine designs [PRD, 9]                                                            | Figma Prototype Approved & **Final Design ACC Signed Off** |
| **DevOps / Backend** | Set up GitHub Actions CI/CD pipelines **(Build & Code Quality Test only)** and prepare deployment scripts. *(No VPS deployment yet to save client's subscription time)* | CI/CD Pipeline Ready (Without Deployment)                  |
| **FE Developer**     | Set up Customer-Side layouts & Global Components according to the finalized design system                                                                               | Next.js with configured UI Layouts & Global Components     |
| **BE Developer**     | Configure email queue delivery using Brevo/Mailgun in Laravel                                                                                                           | Configured Transactional Email Delivery                    |
| **QA Engineer**      | Write initial automation scripts based on the Test Cases created in Sprint 2.                                                                                           | Initial Automation Scripts                                 |

_Note: Final Design ACC Signoff for all Admin & User flows required before moving to Phase B (Coding Phase)._

---

### **PHASE B: INTEGRATION & CORE DEVELOPMENT (Sprints 4 – 6)**

_Coding Phase: FE builds UI using Mock Data immediately, BE builds logic, and QA tests incrementally to avoid bottlenecks._

#### **Sprint 4: August 20 – September 3, 2026**

_Focus: Implementing authentication, public game catalog screens, and catalog/stock management APIs on the Admin side._

| Role             | Key Activities & Tasks                                                                                                                      | Output / Deliverable                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **FE Developer** | Code visual components for Google Authentication, user dashboard, profile page, and catalog grid according to Figma _(Using Mock APIs)_     | Active UI Auth & Catalog Components             |
| **BE Developer** | Implement Google OAuth API, Catalog CRUD APIs, S3 media upload APIs, and Admin Bulk Stock CSV parser                                        | APIs for Auth, Catalog, and AWS S3 Media Upload |
| **QA Engineer**  | Run manual test cases for Auth & Catalog CRUD. **Perform Security Testing (SQL Injection, XSS) specifically for Authentication endpoints.** | Updated Bug Logs & Auth Security Report         |

---

#### **Sprint 5: September 3 – September 18, 2026**

_Focus: Building cart mechanics, voucher systems, checkout processing, and handling payment webhooks._

| Role             | Key Activities & Tasks                                                                                                                             | Output / Deliverable                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **FE Developer** | Implement Cart interactions, Checkout UI, Voucher input field, and trigger Midtrans Snap pop-up                                                    | Active Cart UI & Midtrans Checkout Flow        |
| **BE Developer** | Implement Voucher Validation API, Midtrans pending transaction creation, and Webhook Callback listener                                             | Payment APIs & Webhook Callback Handler        |
| **QA Engineer**  | Test cart operations and discount calculation logic. **Perform Security Testing specifically for Payment Gateway payload & Webhook manipulation.** | Checkout Calculation & Payment Security Report |

---

#### **Sprint 6: September 18 – October 2, 2026**

_Focus: Automated credential injection to Game Library, secondary MVP features, and system-wide load testing._

| Role             | Key Activities & Tasks                                                                                                                                    | Output / Deliverable                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **FE Developer** | Code the Game Library page, Review submission form, Request Game form, and Leaderboard UI                                                                 | Frontend MVP Implementation Completed            |
| **BE Developer** | Implement automated stock allocation to Game Library, Reviews API with moderation queues, Request Game API, and Redis Leaderboard                         | Backend MVP APIs Completed                       |
| **QA Engineer**  | Audit security boundaries for Game Library accounts (Data Isolation). **Execute System-Wide Load Testing** and run final regression testing.              | Load Testing Report & Final Regression Log       |
| **FE Developer** | Optimize frontend performance metrics (Next.js Image components, code-splitting, lazy loading)                                                            | Core Web Vitals Optimization Report (LCP ≤ 2.5s) |
| **DevOps / BE**  | Purchase & Configure Hostinger VPS (AMD EPYC, 8GB RAM). Setup Docker in VPS, configure domain routing, and deploy the application to Staging Environment. | Active Staging Server on Hostinger VPS           |

---

### **PHASE C: UAT, CONTENT MIGRATION, & LAUNCH BUFFER (2 Oct - 10 Oct)**

_Final testing, data preparation, and shifting API integrations to the production server._

1. **User Acceptance Testing (UAT):** Conduct comprehensive end-to-end purchasing runs with the client representative (Arsa Wibawa) to ensure all acceptance criteria are met [PRD, 9].
2. **Database Cleanup:** Clear all testing records, logs, and mock reviews from the staging database.
3. **Production Content Migration:** Populate the live product catalogs and inject the initial shared account credentials (_shared accounts_) ready for buyers.
4. **API Keys Swap:** Switch Midtrans and Google OAuth keys from sandbox environment keys to live **Production** keys.
5. **Go-Live & Monitoring:** Point the main domain to the Hostinger VPS production instance and connect Sentry for real-time post-launch error monitoring.

---

## 9. Stakeholders & Sign-Off

| Role                  | Name            | Responsibility                          | Sign-Off Required |
| --------------------- | --------------- | --------------------------------------- | ----------------- |
| Project Manager       | Dhiyo Wikantara | Scope, Timeline, Budget Management      | ✓ Yes             |
| Tech Lead / Architect | Mahendra Arya   | Technical Decisions & Code Quality      | ✓ Yes             |
| Product Designer      | Dhiyo Wikantara | Product Vision, Business Logic          | ✓ Yes             |
| UI Designer           | Dyven Siauw     | Visual & Design System Standart         | ✗ No              |
| Frontend Developer    | Rendy Mahardika | UI Implementation & Performance         | ✗ No              |
| Backend Developer     | Mahendra Arya   | API, Database, Integrations             | ✗ No              |
| QA Engineer           | Dhiyo Wikantara | Test Cases, Bug Reporting, UAT Support  | ✗ No              |
| DevOps                | Rendy Mahardika | Hosting, Security & Maintain            | ✓ Yes             |
| Client Representative | Arsa Wibawa     | Requirements Validation, Final Approval | ✓ Yes             |

---

## 10. Appendix

### 10.1 Acceptance Criteria

A deliverable is considered accepted when all of the following conditions are met:

- All P1 functional requirements are implemented and verified through testing
- All non-functional performance benchmarks are met as defined in Section 5
- Zero Critical or High severity bugs remain open at time of sign-off
- Cross-browser and device testing is completed and documented
- Security scan (OWASP ZAP or equivalent) shows no Critical/High findings
- Client UAT sign-off received in writing

### 10.2 Glossary

| Term      | Definition                                                                            |
| --------- | ------------------------------------------------------------------------------------- |
| **API**   | Application Programming Interface — standardized interface for service communication  |
| **CI/CD** | Continuous Integration / Continuous Deployment — automated build and release pipeline |
| **CMS**   | Content Management System — admin panel for non-technical content editing             |
| **LCP**   | Largest Contentful Paint — Core Web Vital measuring perceived load speed              |
| **TTFB**  | Time to First Byte — server response speed metric                                     |
| **UAT**   | User Acceptance Testing — client-side validation before go-live                       |

---

**Document Classification:** Confidential
**Last Updated:** [DD MMM YYYY]
**Approval Status:** Pending Stakeholder Sign-Off
