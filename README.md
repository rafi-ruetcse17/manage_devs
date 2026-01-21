# Daily Check-ins Vue Application

A Vue 3 + TypeScript application to display developer daily check-ins using Bulma CSS framework.

## Features

- 📋 Display all daily check-ins in a beautiful card layout
- 🎨 Styled with Bulma CSS framework
- 🔄 Real-time data fetching from backend API
- ⚡ Loading and error states
- 📱 Responsive design
- ✨ Hover animations on cards
- 🔄 Refresh functionality

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Bulma CSS** - Modern CSS framework
- **Vite** - Fast build tool
- **Font Awesome** - Icon library

## Project Structure

```
manage_devs/
├── src/
│   ├── components/
│   │   └── DailyCheckIns.vue    # Main component for displaying check-ins
│   ├── App.vue                   # Root component
│   └── main.ts                   # Application entry point
├── index.html                    # HTML template with Bulma & Font Awesome
└── package.json                  # Dependencies
```

## Installation

```bash
cd manage_devs
npm install
```

## Running the Application

Development mode:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/` (or next available port)

## Component Details

### DailyCheckIns.vue

This component:

- Fetches daily notes from the backend API (`http://localhost:4000/api/daily-notes`)
- Displays each note in a Bulma card with:
  - Developer name and avatar icon
  - Timestamp of submission
  - Blocker status badge (red for blocker, green for no blocker)
  - Previous day's work
  - Today's plan
- Includes loading state while fetching data
- Shows error message if API fails
- Provides refresh button to reload data
- Responsive card hover effects

### API Integration

The component expects the backend API to return data in this format:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "developerName": "John Doe",
      "previousDayWork": "Implemented authentication",
      "todayPlan": "Work on dashboard",
      "hasBlocker": false,
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

## Design Features

- **Header**: "Daily Check-ins" centered title
- **Cards**: Each check-in displayed in a card with:
  - User icon (Font Awesome)
  - Developer name
  - Formatted timestamp
  - Status badge (blocker/no blocker)
  - Previous day work section with 📅 emoji
  - Today's plan section with 🎯 emoji
- **Hover Effect**: Cards lift up slightly on hover
- **Background**: Light gray background (#f5f5f5)
- **Spacing**: Proper padding and margins for readability

## Prerequisites

Make sure the backend server is running on `http://localhost:4000` before starting the Vue app.

## Build for Production

```bash
npm run build
```

## Type Checking

```bash
npm run type-check
```

## Linting

```bash
npm run lint
```
