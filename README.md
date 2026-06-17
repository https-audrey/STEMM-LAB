# STEMM-LAB - MAD Assessment 3

This repository has been configured with comprehensive testing for the **RateActivityPage** screen (`screens/RateActivity/RateActivityPage.tsx`).

---

## 1. Jest Testing (Local Verification)

We implemented **9 tests** divided into three categories:

### A. Unit Tests (Component & Validation)
1. **Initial Render**: Verifies the UI components (Title, Stars, Comment Input, Finish button) render correctly in their default empty state.
2. **Star Selection Toggle**: Verifies that tapping stars updates the selected rating value and allows clearing them.
3. **Star Validation Alert**: Verifies that trying to submit with 0 stars displays a warning dialog ("Rating Required").
4. **Comment Validation Alert**: Verifies that trying to submit a rating with an empty comment displays a warning dialog ("Comment Required").
5. **Back Navigation**: Verifies that pressing the close button navigates the user back to the previous screen.

### B. Integration Tests (Context & Firebase)
6. **Anonymous Submission**: Mocks authenticated context and verifies that ratings are submitted with an anonymous user ID if the user is not logged in.
7. **Team Points Reward**: Verifies that completing the rating for an authenticated user queries their active team and successfully awards **100 team points** in Firestore.
8. **Firestore Failure Handling**: Verifies that if the Firestore database call fails, a descriptive Alert is shown to the user.

### C. End-to-End (E2E) Flow Simulation
9. **Full User Journey**: Simulates the complete sequence: user opens the screen, selects a star rating, inputs feedback comments, submits, triggers database operations, and gets redirected back to the Home screen with their navigation stack reset.

### 📌 How to Show Proof of Jest Tests
You can run the tests locally to generate the pass report. Open your terminal and run:
```bash
npm run test
```
**Proof artifact**: Copy the green terminal output or take a screenshot of the terminal showing `9 passed, 9 total` (saved details can also be found in your local walkthrough file).

---

## 2. Firebase Test Lab (Cloud Verification)

An Android APK (`stemm-lab.apk`) was built using EAS Build (`eas.json` and `.easignore` configured to include configurations).

### 📌 How to Show Proof of Firebase Test Lab
Once you run the APK in the **[Firebase Test Lab Console](https://console.firebase.google.com/project/stemm-lab-4476e/testlab)**, you can collect the following proofs:
1. **Device Name**: The model of the virtual device tested (e.g., `Pixel 7 (Virtual)`).
2. **Results Dashboard Screenshot**: A screenshot of the Test Lab page showing the success status.
3. **Video Recording**: Download the screen recording of the automated Robo crawler traversing your screen from the **Video** tab.

