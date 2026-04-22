# Feed The City - Volunteer Planner

![Project Banner](https://via.placeholder.com/1200x300.png?text=Feed+The+City+-+Tango+Charities) <!-- Add your actual banner image here -->

A modern, frictionless React-based application designed to streamline the volunteer sign-up and planning process for Tango Charities' "Feed the City" events. This intuitive tool helps volunteers calculate ingredient needs, estimate their sandwich contributions, and seamlessly register to participate.

## 🌟 Key Features

* **Interactive Shopping Calculator:** Dynamically calculates exact ingredient quantities needed based on the volunteer's desired sandwich contribution.
* **Frictionless Experience:** Single-flow, single-page UI built for high conversion.
* **Responsive "Liquid Glass" UI:** A premium, modern, and engaging design with smooth micro-animations.
* **Component-Based Architecture:** Built on modern React for scalability and maintainability.
* **Embedded Ready:** Perfectly optimized to function smoothly as an `iframe` within existing Wix/Squarespace event pages.

## 🏗️ Architecture & Tech Stack

* **Core:** [React](https://reactjs.org/) (v19) & [Vite](https://vitejs.dev/) for extremely fast development and builds.
* **Animations:** [Framer Motion](https://www.framer.com/motion/) powering the fluid UI transitions.
* **Styling:** Vanilla CSS with custom modern properties (Glassmorphism, CSS Gradients, dynamic theming).
* **Routing:** `react-router-dom` for handling custom city links and embed states.
* **Hosting:** Fully configured for CI/CD via **Vercel** with Multi-App Monorepo support.

## 🚀 Getting Started (Development)

This repository contains two React applications: `ftc-react-app` (v1 stable) and `ftc-react-app-v2` (next-gen). 

To run the latest version locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/drohat38/WhatToBringFTC.git
   cd WhatToBringFTC
   ```

2. **Navigate to the target app:**
   ```bash
   cd ftc-react-app-v2
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

## 📖 Project Documentation (Wiki)

For deep technical insights, review our documentation files located in the `/docs` folder. These files are designed to serve as the foundation of our eventual GitHub Wiki:

- [`/docs/PRD.md`](docs/PRD.md) - Product Requirements and Business Logic.
- [`/docs/ux-review.md`](docs/ux-review.md) - Analysis of UI/UX iterations and embed integrations.
- [`/docs/react_migration_handoff.md`](docs/react_migration_handoff.md) - Engineering handoff and roadmap notes.

## 🛡️ License & Contributing

Currently maintained by the Tango Charities web team. For feature requests or major bugs, please create an Issue outlining the request before submitting a Pull Request.
