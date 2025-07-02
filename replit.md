# Qualibrite Health - Telehealth Platform

## Overview

Qualibrite Health is a comprehensive telehealth platform designed for mental health and psychiatric services. The application provides secure, HIPAA-aligned online therapy and psychiatric care through a web-based interface with role-based access controls for patients, providers, administrators, and various support staff.

## System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js and TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: React with TypeScript, Vite build system
- **Authentication**: Session-based with JWT token support and MFA capabilities
- **Styling**: Tailwind CSS with shadcn/ui components
- **Security**: Advanced security headers, CSRF protection, rate limiting

### Database Architecture
The system uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes:
- Users table with role-based access control
- Patient and provider profile tables with proper foreign key relationships
- Medical records with encrypted sensitive data support
- Audit logs for comprehensive security tracking
- MFA support tables for two-factor authentication

## Key Components

### Authentication & Authorization
- **Multi-role system**: Supports patient, provider, admin, practice_manager, billing, intake_coordinator, it_support, marketing roles
- **Session-based authentication** with secure session management
- **Multi-Factor Authentication (MFA)** support with TOTP and backup codes
- **Account lockout protection** against brute force attacks
- **Password policy enforcement** with complexity requirements
- **Secret rotation** for JWT tokens with graceful fallback

### Security Features
- **Rate limiting** on authentication endpoints and API routes
- **CSRF protection** using double-submit cookie pattern
- **Input sanitization** to prevent XSS and SQL injection
- **Security headers** including CSP, HSTS, and frame options
- **Comprehensive audit logging** for all security events
- **Field-level encryption** for sensitive PHI data
- **Session activity tracking** with role-based timeouts

### User Management
- **Administrative dashboards** for different user roles
- **Temporary password generation** for patient accounts
- **Account unlock functionality** for locked accounts
- **User profile management** with metadata support
- **Role-based access controls** throughout the application

### Medical Records & Telehealth
- **Secure medical records management** with provider-patient associations
- **Telehealth appointment scheduling** and management
- **Provider availability tracking**
- **Patient dashboard** with appointment and record access
- **Compliance tracking** for healthcare regulations

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. System validates against database with rate limiting
3. Account lockout checks performed for security
4. MFA verification if enabled for the user
5. Session created with appropriate timeout based on role
6. User redirected to role-appropriate dashboard

### Medical Records Access
1. Authenticated user requests medical record access
2. System verifies user permissions for specific records
3. Audit log entry created for PHI access
4. Encrypted data decrypted for authorized viewing
5. All access tracked for compliance reporting

### Administrative Actions
1. Admin users access management interfaces
2. Role-based authorization checks performed
3. Sensitive operations require additional verification
4. All administrative actions logged to audit trail
5. Changes propagated with proper notification systems

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Neon database connector for PostgreSQL
- **drizzle-orm**: Type-safe ORM with migration support
- **drizzle-kit**: Database schema management and migrations

### Authentication & Security
- **bcryptjs**: Password hashing with salt
- **jsonwebtoken**: JWT token generation and verification
- **otplib**: TOTP implementation for MFA
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store
- **express-rate-limit**: API rate limiting

### Frontend Framework
- **React 18**: Modern React with hooks and concurrent features
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight client-side routing
- **@radix-ui**: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **TypeScript**: Type safety across the application
- **Vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development Environment
- Uses tsx for TypeScript execution in development
- Vite dev server with HMR for frontend development
- Direct database connections for rapid iteration
- Rate limiting disabled for easier testing

### Production Build
- **Frontend**: Vite builds optimized React bundle
- **Backend**: esbuild compiles TypeScript to ESM format
- **Database**: Drizzle migrations ensure schema consistency
- **Security**: All security features enabled with production settings

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Session encryption key (required)
- **JWT_SECRET**: JWT signing key with rotation support (required)
- **ENCRYPTION_KEY**: Field-level encryption key for PHI (required)
- **NODE_ENV**: Environment setting affecting security policies

## Changelog

```
Changelog:
- July 02, 2025: Initial setup
- July 02, 2025: Major branding update with new Qualibrite Health logo
- July 02, 2025: Complete home page redesign with modern telehealth interface
- July 02, 2025: Fixed confusing telehealth session mockup on home page
- July 02, 2025: Enhanced header navigation with professional logo placement
- July 02, 2025: Added proper meta tags and SEO optimization
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```