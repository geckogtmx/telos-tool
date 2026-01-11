# TELOS Tool v1.0.0 - Manual Test Workflow

**Objective:** Verify all core functionality of the TELOS Tool release `v1.0.0` on the production environment.
**Environment:** [https://telos-tool.vercel.app](https://telos-tool.vercel.app)
**Date:** January 11, 2026

---

## 1. Authentication & Access
- [ ] **Sign Up:** Create a new account using an email/password.
- [ ] **Login:** Log out and log back in with the new account.
- [ ] **Session:** Verify you are redirected to the dashboard or home page after login.

## 2. Individual Entity Flow (CV Parsing)
*Goal: Verify personal TELOS generation from a resume.*

- [ ] **Navigate:** Click "Generate" -> "Individual".
- [ ] **Upload:** Select a PDF or DOCX resume/CV.
- [ ] **PII Scrubbing:**
    - [ ] Verify phone numbers are redacted (e.g., `[REDACTED PHONE]`).
    - [ ] Verify emails are redacted (e.g., `[REDACTED EMAIL]`).
- [ ] **Questions:** Answer the follow-up questions (Mission, Values, etc.).
- [ ] **Generation:** Click "Generate TELOS" and wait for the AI result.
- [ ] **Review:**
    - [ ] Check if the content is markdown formatted.
    - [ ] Verify the "Identity" section matches the CV input.
- [ ] **Save:** Click "Save TELOS" and confirm success.

## 3. Organization Entity Flow (File Upload)
*Goal: Verify organization manifest generation from a corporate document.*

- [ ] **Navigate:** Click "Generate" -> "Organization".
- [ ] **Input - File:** Switch to "Upload File" tab.
- [ ] **Upload:** Upload a company profile or "noisy" document (e.g., Pitch Deck text or About Us PDF).
- [ ] **Questions:** Complete the organizational questionnaire (Mission, KPIs, Stakeholders).
- [ ] **Generation:** Generate the output.
- [ ] **Validation:** Ensure financial noise or irrelevant HR data is filtered out from the final "Identity" section.
- [ ] **Save:** Save the file.

## 4. AI Agent Entity Flow (Guided Mode)
*Goal: Verify "Start from Scratch" interview mode.*

- [ ] **Navigate:** Click "Generate" -> "AI Agent".
- [ ] **Guided Mode:** Click the "Start from Scratch" / "Guided Mode" button (skip prompt upload).
- [ ] **Interview:** Answer the persona questions (e.g., "What is your main goal?", "How should you speak?").
- [ ] **Generation:** Generate the Agent instructions.
- [ ] **Validation:** Verify the output includes:
    - [ ] System Prompt / Role
    - [ ] Constraints (e.g., "Do not hallucinate")
    - [ ] Communication Style matches your answers.
- [ ] **Save:** Save the file.

## 5. Dashboard & Management
*Goal: Verify CRUD operations.*

- [ ] **List View:** Go to "Dashboard". Verify the 3 files just created are listed.
- [ ] **Filtering:**
    - [ ] Click "Individual" filter -> Should show only the CV file.
    - [ ] Click "Organization" filter -> Should show only the Org file.
- [ ] **View Detail:** Click on any file to open the full view.
- [ ] **Update Flow:**
    - [ ] Click "Update".
    - [ ] Change one answer (e.g., add a new constraint or value).
    - [ ] Regenerate.
    - [ ] Save and verify the version count increased (or date updated).
- [ ] **Delete:**
    - [ ] Click the "Delete" (trash icon) on one file.
    - [ ] Confirm deletion.
    - [ ] Verify it disappears from the list.

## 6. Public Sharing (Optional)
*Goal: Verify sharing settings.*

- [ ] **Open File:** Open a saved TELOS file.
- [ ] **Change Visibility:** Set visibility to "Encrypted" or "Open".
- [ ] **Test Link:** Copy the "Share Link".
- [ ] **Incognito:** Open the link in an Incognito/Private window.
    - [ ] If "Encrypted": Verify password prompt.
    - [ ] If "Open": Verify content loads without login.

---

**End of Test**
Mark Phase 18 as Complete in `DEVELOPMENT_PLAN_V1.md` when finished.
