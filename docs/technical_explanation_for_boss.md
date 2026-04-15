# Technical Executive Summary
*Prepared for the Leadership Team regarding the Feed the City App*

## 1. What Are We Building?
We have built a proprietary **Contribution Planner and Impact Tracker**. It is a lightweight, high-performance web application designed specifically to replace the static "What to Bring" section on your current Wix website with an interactive, personalized volunteer experience.

## 2. How the App Works (The React Framework)
The application is built using **React**, the industry-standard framework created by Meta (Facebook) used by companies like Netflix, Airbnb, and Instagram.

**Why React instead of basic HTML/JS?**
- **Component-Based:** We build the app like Lego blocks (e.g., the Calculator block, the Email Capture block, the Progress Bar block). This makes the code highly organized, easy to update, and practically bug-proof.
- **Seamless State Management:** The app needs to remember complex things instantly—such as when a user slides the "30 sandwiches" up to "35," the bread, meat, and cheese numbers must recalculate in a fraction of a second. React handles this "state" effortlessly.
- **Premium Animations:** By using React, we can utilize libraries like **Framer Motion** to create "glassmorphism" effects and smooth layout shifts that feel native to iOS, rather than clunky webpage jumps. 

## 3. How It Integrates with Wix (The Iframe)
Wix does not easily allow complex custom applications directly inside its editor. Because of this, we use an **Iframe Integration Strategy**.

1. **The App is Hosted Separately:** The React app physically lives on **Vercel** (a world-class hosting provider optimized for React apps).
2. **The "Window" on Wix:** On your Wix Event page, we simply place a Wix "Embed HTML" block. This acts as a window (an iframe) that looks directly into the Vercel app. 
3. **Seamless Communication:** To ensure it doesn't just look like a clumsy box cut into the site, the app runs background scripts (`postMessage` API) that talk directly to Wix. For example, if the app needs to grow taller to show a grocery list, it secretly messages the Wix page to expand the window frame dynamically. The volunteer never knows they are looking at two different websites patched together.

## 4. The Data & The "Double Email" Solution
A major friction point has been volunteers entering an email for our Impact Tracker, and then immediately scrolling down to enter it again for Eventbrite. 

Because of the Iframe architecture, the app and Eventbrite are theoretically "blind" to each other. However, our new React flow solves this:
1. The user calculates their sandwiches.
2. The UI elegantly collapses into a receipt and asks for their email immediately.
3. Once captured, the app saves it securely to the browser's local storage.
4. The app then triggers a command that automatically scrolls the main Wix page down to the Eventbrite widget, passing the volunteer right into the registration phase with zero confusion. 

**Future Expansion (Supabase):**
Currently, data is saved directly on the volunteer's phone (`localStorage`). In our next phase, we will connect the React app to **Supabase** (a secure backend database). This will allow volunteer impact histories to sync across their laptop and phone, and give the leadership team a dashboard view of total incoming meal volume per city.

## 5. Deployment & Maintenance
- **Zero-Downtime Updates:** Because the app is hosted on Vercel, any time a developer pushes an update to the code, Vercel automatically builds and deploys the new version globally in seconds. 
- **Hands-off for Wix:** Your Wix site coordinators never have to touch the Wix editor to update the app. The "window" simply continues pointing to the app as it improves over time.
