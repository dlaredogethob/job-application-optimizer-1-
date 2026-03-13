# Project Backlog: Roadmap to Production

This document outlines the critical weaknesses identified in the current frontend-heavy prototype and provides a roadmap for backend integration and production readiness.

## 🔴 High Priority: Security & Architecture

### 1. Secure API Key Management
*   **Weakness**: The Gemini API key is currently exposed in the frontend via `.env.local`.
*   **Fix (Backend)**: Create a proxy endpoint in a Node.js/Python backend. All AI requests should go to `/api/ai/chat` which then attaches the secret key from a secure server-side environment variable.
*   **Benefit**: Protects API keys from being stolen by end-users.

### 2. User Authentication (SSR/JWT)
*   **Weakness**: The signup page is currently a pure UI placeholder. There is no real session management.
*   **Fix (Backend)**: Implement a real auth system (Supabase Auth, Firebase, or custom OIDC/JWT).
*   **Fix (Frontend)**: Update `AppProvider.tsx` and `AppLayout.tsx` to handle authenticated states and protected routes.

### 3. Database Integration (PostgreSQL/MongoDB)
*   **Weakness**: Data is persisted in browser `localStorage`. This is limited to ~5MB and is device-specific.
*   **Fix (Backend)**: Deploy a database to store User Profiles, Projects, and Chat Histories.
*   **Fix (Frontend)**: Refactor `storageService.ts` to use asynchronous API calls (Axios/Fetch) to perform CRUD operations on the backend.

---

## 🟡 Medium Priority: Performance & UX

### 4. Robust PDF/Document Parsing
*   **Weakness**: Current PDF parsing is client-side (`pdfjs-dist`) which can be slow and memory-intensive for large files.
*   **Fix (Backend)**: Use a dedicated document processing service (like AWS Textract, Azure Document Intelligence, or Python's `PyMuPDF`) to handle complex OCR and layout extraction.
*   **Benefit**: Better extraction quality for scanned PDFs or multi-column resumes.

### 5. File Storage (S3/Cloud Storage)
*   **Weakness**: Resumes and job descriptions are stored as raw text snippets. Original files are not saved.
*   **Fix (Backend)**: Implement file uploads to an S3-compatible bucket. Store the file URL in the database and only the extracted text in the AI search index.

### 6. Real-time Notifications
*   **Weakness**: Notification bell is just a UI element.
*   **Fix (Backend/Frontend)**: Implement WebSockets or Server-Sent Events (SSE) to notify users of analysis completion or new job matches in the background.

---

## 🟢 Low Priority: Nice-to-Haves

### 7. Global Search (Meilisearch/Elasticsearch)
*   **Weakness**: The search bar in `AppLayout.tsx` is not functional.
*   **Fix**: Implement a global search across all library documents and people profiles using a full-text search engine.

### 8. Analytics & Monitoring
*   **Fix**: Integrate Sentry for error tracking and PostHog for user behavior analytics.
