# DrishtiNow - Proactive Safety Intelligence

DrishtiNow is a comprehensive, real-time event safety and management platform designed to provide proactive intelligence for large-scale gatherings. It leverages modern web technologies and the power of Google's Gemini AI to ensure a safe and secure environment for attendees, responders, and event management staff.

![DrishtiNow Management Console](https://placehold.co/800x400.png)

## Key Features

- **Role-Based Dashboards**: Tailored interfaces for different user roles (Management, Responder, and Consumer/Attendee).
- **Real-time Alert System**: Instantaneous creation and propagation of alerts for various incidents like medical emergencies, safety concerns, or lost persons.
- **AI-Powered Report Analysis**: Attendee-submitted reports are automatically processed by a Gemini-powered Genkit flow to assess severity, categorize the incident, and generate alerts if necessary.
- **AI-Driven Sentiment Summary**: A live sentiment analysis of the event is generated based on active alerts, giving management a high-level overview of the event's mood.
- **Interactive Live Map**: A centralized map displaying the real-time location of alerts, responders, and crowd density heatmaps.
- **Responder Dispatch**: Management can assign available responders to new alerts directly from the dashboard.
- **Attendee Reporting**: Consumers can submit reports about incidents directly from their mobile devices, which are then processed by the AI backend.

## Technology Stack

DrishtiNow is built on a modern, robust, and scalable technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) (with Google's Gemini Models)
- **Mapping**: [Google Maps Platform](https://mapsplatform.google.com/) (via `@vis.gl/react-google-maps`)
- **Icons**: [Lucide React](https://lucide.dev/)

## User Roles & Functionality

The application supports three distinct user roles, each with a specialized dashboard.

### 1. Management Console (`/`)

The central command center for event organizers.

- **Login**: Use mobile number `9876543210`.
- **Features**:
    - **Live Map**: View all alerts, responder locations, and a crowd heatmap.
    - **Active Alerts Panel**: See a real-time feed of all alerts, sorted by severity.
    - **Dispatch Responders**: Assign available responders to new alerts via a "Take Action" dropdown.
    - **AI Sentiment Summary**: Get a concise, AI-generated summary of the overall event atmosphere.
    - **Responder Status**: Monitor the current status and assignments of all responders.

### 2. Responder Dashboard (`/responder`)

A streamlined interface for on-the-ground personnel.

- **Login**: Use mobile number `8765432109`.
- **Features**:
    - **Assigned Task View**: Clearly displays the current assigned alert with all necessary details.
    - **Task Actions**: Buttons to acknowledge, navigate to, and resolve assigned tasks.
    - **Standby Status**: When no task is assigned, the dashboard indicates the responder is on standby.
    - **Alert History**: A view to look back at previously resolved alerts.

### 3. Consumer/Attendee App (`/consumer`)

A public-facing app for event attendees to stay informed and report issues.

- **Login**: Use mobile number `7654321098`.
- **Features**:
    - **Safety Alerts Feed**: Displays critical and warning-level alerts relevant to the public.
    - **Event Map**: A view of the event layout and key areas.
    - **Report an Issue**: A simple form to submit reports for medical issues, lost persons, or other safety concerns. These reports are fed into the AI processing backend.
    - **Event FAQ**: Provides answers to common questions about the event.

## Getting Started

### Prerequisites

- Node.js
- An environment variable file (`.env`) with your Google Maps API Key:
  ```
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
  GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
  ```

### Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:9002](http://localhost:9002).

3. **Login**:
   - Navigate to the login page.
   - Use one of the mock mobile numbers listed above to access the different user dashboards. The mock OTP is `123456`.
