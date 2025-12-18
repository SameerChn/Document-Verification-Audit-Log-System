# Document Verification & Audit Log System

## Description
A system that verifies document integrity by generating and storing hashes and maintaining audit logs. It creates immutable records for file uploads and access, ensuring security and traceability.

## Core Features
- **Upload documents**: Securely upload files to the system.
- **Generate document hash**: Automatic generation of unique SHA-256 cryptographic fingerprints.
- **Verify document integrity**: Instantly check if a document matches the registered immutable record.
- **View audit logs**: Comprehensive tracking of all verification attempts and system access.

## Azure & DevOps Usage
- **Azure Blob Storage**: Scalable cloud storage for secure document retention.
- **Azure Cosmos DB**: Globally distributed database for storing document hashes and audit logs.
- **Dockerized backend**: Containerized application for consistent deployment across environments.
- **NGINX**: High-performance reverse proxy for UI and API routing.
- **GitHub Actions**: Automated CI/CD pipeline for testing and deployment.

## Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: MongoDB / Azure Cosmos DB
- **Styling**: Tailwind CSS
- **Authentication**: JWT with secure HTTP-only cookies

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (Atlas or local) OR Azure Cosmos DB account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd document-verification-audit-log-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.example.env` to `.env`:
   ```bash
   cp .example.env .env
   ```
   
   Update the `.env` file with your connection strings (MongoDB or Cosmos DB).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure
- `/app`: Next.js App Router pages and API routes
- `/components`: Reusable UI components
- `/lib`: Utility functions, database connection, and types
- `/public`: Static assets

## License
MIT
