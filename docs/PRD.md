# Product Requirements Document (PRD): Feed the City Contribution Planner

## 1. Product Overview
The **Feed the City Contribution Planner** is a volunteer-facing web application embedded directly into the Tango Charities/Feed the City Wix event pages. It serves as an interactive calculator, a grocery list generator, and a personal impact tracker.

Instead of reading a static "What to Bring" list, volunteers use this tool to calculate exact grocery needs based on a customizable sandwich goal, commit to their plan, and track their lifetime meal contributions.

## 2. Target Audience
- **Primary:** Volunteers preparing for a Feed the City event (mostly mobile users).
- **Secondary:** Returning volunteers wanting to see their accumulated impact and share it on social media.

## 3. Core Problems Solved
- **Under-buying and Guesswork:** Volunteers often don't know exactly how much of each ingredient to buy. The app calculates precise shopping lists.
- **Lack of Attachment/Retention:** Volunteering can feel transient. By tracking "Lifetime Meals," the app creates a persistent emotional connection.
- **Double-Email Friction:** Historically, volunteers had to enter their email once for tracking and again for Eventbrite. The new single-flow architecture aims to capture the email upfront and seamlessly hand the user off to Eventbrite.

## 4. Key Features & Requirements

### 4.1 Interactive Sandwich Calculator (Plan View)
- Allows users to set a goal (e.g., 30 sandwiches) using an intuitive counter.
- Dynamically calculates required quantities for 5 core ingredients: Bread, Deli Meat, Cheese, Mustard, Sandwich Bags.
- Dynamically calculates recommended quantities for 2 optional snacks: Chips, Tangerines.

### 4.2 Email Capture & Commitment (Log View)
- Captures the volunteer's email address and specific city chapter.
- Saves the data to local storage to persist the user's identity on that device.
- Unlocks the personalized Grocery List and Impact Dashboard.

### 4.3 Personalized Grocery List
- Generates a clean, readable shopping list based on the user's calculated goal.
- Provides options to **Copy to Clipboard** or **Save as Image** (PNG) to their phone's camera roll for easy referencing at the grocery store.

### 4.4 Impact Dashboard (Impact View)
- Displays lifetime contribution metrics: Total Meals, Events Attended, Top City.
- Visualizes progress with a journey ring and tiered milestones (e.g., 100 Meals, 250 Meals).
- Generates a highly stylized, Instagram-ready "Impact Card" (4:5 ratio) for social sharing, leveraging the Canvas API.

## 5. Technical Requirements & Architecture
- **Framework:** React + Vite.
- **UI & Animations:** Framer Motion (facilitates complex state transitions, such as collapsing the calculator into a receipt to reveal the email capture).
- **Hosting / Deployment:** Vercel (instant, serverless edge hosting).
- **Integration:** Embedded as a responsive `<iframe>` inside existing Wix pages.
- **Current Database:** Browser `localStorage`.
- **Future Database:** Supabase (for cross-device persistence and organization-level tracking).

## 6. Success Metrics
- Increase in accurate grocery provision relative to the number of volunteers.
- Improved volunteer retention rate (tracking repeat usage).
- Increase in organic social media impressions (via Instagram impact card shares).
