# TELOS Tool v1.0.0 Release Notes

**Date:** January 11, 2026
**Version:** 1.0.0

## 🚀 Launch Overview
We are proud to announce the first production release of the **TELOS Tool**, the comprehensive platform for generating Teleological Operating System files. This release supports all three core entity types: Individuals, Organizations, and AI Agents.

## ✨ Key Features

### 1. Multi-Entity Support
- **Individuals:** Parse CVs/Resumes (PDF/DOCX), scrub PII, and generate personal TELOS files.
- **Organizations:** Upload company profiles, pitch decks, or "noisy" documents to generate organizational manifests.
- **Agents:** Define AI personas with a new **Guided Interview Mode** or upload existing system prompts.

### 2. Dual AI Engine
- **Anthropic Claude:** Default high-reasoning engine.
- **Google Gemini:** Optional high-speed engine (configured via `AI_PROVIDER`).
- Optimized prompts for both models.

### 3. Security & Privacy
- **Client-Side PII Scrubbing:** Redacts phone numbers and emails before sending data to AI.
- **Encrypted Sharing:** Share TELOS files via password-protected links (AES-256).
- **Private Storage:** RLS (Row Level Security) ensures users can only see their own files.

### 4. Dashboard & Management
- View, filter, and delete generated files.
- **Update Flow:** Edit previous answers and regenerate files while preserving the original link.
- Markdown preview, PDF download, and print-ready styles.

## 🛠 Technical Details
- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase (Auth/DB).
- **Quality:** 70%+ Test Coverage, Zero ESLint errors, Security Audit passed.
- **Performance:** Optimized parsers for large files (>5MB rejected).

## 📝 Changelog (since beta)
- Added **Guided Mode** for Agents (Start from scratch without a prompt).
- Restored **Organization File Upload** with noise filtering.
- Fixed 4000+ linting issues and hardened test suite.
- Updated UI for mobile responsiveness and accessibility.

---
*Built with ❤️ by the TELOS Team*
