# STAGE

> *An interactive contemporary art event management application.*

<div>
  <img align="left" alt="React" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" />

  <img align="left" alt="Vite" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" />

  <img align="left" alt="Firebase" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" />

  <img align="left" alt="Hero UI" width="30px" style="padding-right:10px;" src="https://raw.githubusercontent.com/heroui-inc/heroui/main/apps/docs/public/isotipo.png" />

  <img align="left" alt="Framer Motion" width="30px" style="padding-right:10px;" src="https://cdn.simpleicons.org/framer" />

  <img align="left" alt="Tailwind CSS" width="30px" style="padding-right:10px;" src="https://cdn.simpleicons.org/tailwindcss" />
</div>
<br />

---

## 📖 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Features & Functionality](#-features--functionality)
  - [User Authentication](#user-authentication)
  - [Public Event Feed](#public-event-feed)
  - [Controls Panel](#controls-panel)
  - [Event Page](#event-page)
  - [Event Creation & Management](#event-creation--management)
  - [Profiles Section](#profiles-section)
  - [Filtering & Discovery](#filtering--discovery)
  - [Profile Pages](#profile-pages)
  - [Real-Time Updates](#real-time-updates)
- [📆 Routes Overview](#-routes-overview)
- [🌐 Deployment ](#-deployment--access)
- [🛠 Tech Stack](#tech-stack)
- [🧩 Custom React Hooks](#-custom-react-hooks)
- [🧠 React Context Providers](#-react-context-providers)
- [🔍 Testing the App](#-testing-the-app)
- [💻 How to Run Locally](#how-to-run-locally)
- [📚 Credits](#-credits)
- [🪪 License](#license)

---

## ✨ Overview
**STAGE** is an event management platform developed to make Bulgarian contemporary art accessible to a broader audience and increase publicity. 

The application provides a streamlined interface for discovering local art events, filtering them by various parameters, announcing interest or attendance, connecting with visitors and organizers, and managing events through a personalized calendar.

> ![App Screenshot Placeholder](./screenshots/homepage.png)

---

## 🚀 Features & Functionality

### User Authentication
- Users can register, log in, and log out.
- Upon logout, users are redirected to the public events feed.
- Authentication is handled via Firebase Auth.


> ⚠️ **Manager Login for Review**:
```
Email: elton2@gmail.com
Password: 111111
```

### Public Event Feed
- All published art events are visible to both guests and registered users.
- Events appear as cards on a board with hover/click interactions.

### Controls Panel 
- Authenticated users have access to a draggable and customizeable controls panel that enables bulk interactions: 
- Users could select multiple events from the event section and mark interest or attendance to all simultaneously.
- Bulk interactions are only enabled for uniform selections - marking interest could be done only on a selection that contains only events in which the user is not yet or is already interested. 
- The panel could be undocked from the dock position, dragged, and docked back. 
- Profile page accessible settings allow - 
  - Transparency toggle - whether the panel becomes transparent when not interacted with
  - Lock toggle - whether the panel allows locking position
  - Persist position toggle - whether the last panel position is restored when returning on the events page, or it's displayed back in the initial docked position
  - Defaul screen position selection - whether the panel dock position is on the left or on the right of the screen. 

### Event Page 
- Event details are presented in an interactive, expandale sections interface. 
- Users could access additional information for the venue and participating artists. 
- Users could view the comments of other users, and include or remove their own comments. 
- Users could set their interest or attendance for the event.
- Users can invite other users to the event. 
- A related events section lists events that share primary parameters with the current one. 
- A calendar section allows the organization of events the user is involved in chronologically. 

### Event Creation & Management
- Only authenticated users with manager permissions provided by admin can create new events.
- One user could have manager permissions for only one venue. 
- Only the event creator could edit or delete the event record. 
- Event creation allows - 
  - Image upload
  - Selecting associated artists from a list
  - Creating a new artist profile with uploaded profile and artwork images

### Profiles section
- Visitors can access detailed text and visual information on each artist and venue in the event database. 
- Authenticated users can follow other users, artists and venues. 

### Filtering & Discovery

Users can filter events utilizing multiple categories:

- **Manual Input**. 
- **Artist**: events in which a given artist is involved.
- **Venue**: events by a given venue.    

- **Categories**:  
  Artist Talk, Workshop, Conference, Sound, Presentation, Exhibition, Other

- **Time**:  
  Today, Tomorrow, Upcoming, Past

- **Popular**:  
  - Interested, Attended, Invitations, Trending (a formula for identifying most popular events)

- **Involved**:  
  Events by followed artists, users, venues, or events where the user is invited or inviting others

Composite filters are enabled between all filter sections. 
The filtering interface supports a toggle system, allowing users to determine which filter section is visible in the filter bar.

### Profile Pages
- Each user has a profile page containing:
  - Profile picture 
  - Access to the calendar section
  - Control panel customization settings
  - List of invitations received by other users, which could be accepted or declined
  - Statistics such as number of attendees, ratings, and followers
  - Managed venue, if available

### Real-Time Updates
- New public events appear automatically on the public wall without needing to refresh.
- Edits made to an event by a creator or collaborator are instantly visible to users who have saved or are attending.
  
> ![Floating Panel Screenshot Placeholder](./screenshots/floating-panel.png)

---

## 📆 Routes Overview
| Path                 | View / Page Name         | Auth Required |
|----------------------|--------------------------|---------------|
| `/events`            | Events Section           | No            |
| `/event/:id`         | Event Details            | No            |
| `/event/:id/edit`    | Edit Event               | Yes (Manager) |
| `/create`            | Create Event             | Yes (Manager) |
| `/profile`           | User Profile             | Yes           |
| `/artists`           | Artist Profiles          | No            |
| `/venues`            | Venue Profiles           | No            |
| `/login`             | Auth Forms               | No            |
| `/register`          | Auth Forms               | No            |
| `/logout            `| Auth Forms               | Yes           |

---

## 🌐 Deployment & Access
The application is deployed via Firebase Hosting:
> **[STAGE Deployed Application](https://link/)** 

---

## Tech Stack

- [React.js](https://react.dev) (18.3.1)
- [React Router](https://reactrouter.com) (6.23.0)
- [React Calendar](https://www.react-calendar.com/) (5.1.0)
- [Vite](https://vitejs.dev/guide/) (5.2.0)
- [Firebase](https://firebase.google.com) (11.3.1)
- [Framer Motion](https://www.framer.com/motion) (11.15.0)
- [HeroUI](https://heroui.com) (2.6.14)
- [Zod](https://zod.dev) (3.24.2)
- [Tailwind CSS](https://tailwindcss.com) (3.4.16)
- [Tailwind Variants](https://tailwind-variants.org) (0.1.20)
- [Iconify](https://iconify.design) (5.2.0)
- [Date-fns](https://date-fns.org) (4.1.0)

---

## 🧩 Custom React Hooks

| Hook                | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| `useArtists`        | Fetches and manages data for artist profiles.                          |
| `useAuth`           | Authenticates users and handles login/logout logic.                    |
| `useComments`       | Retrieves and posts comments on events.                                |
| `useEventCreate`    | Logic and state for creating new events.                               |
| `useEventEdit`      | Handles editing of existing events.                                     |
| `useEventDelete`    | Manages event deletion logic.                                           |
| `useEvent`          | Accessing single event data.                                           |
| `useEvents`         | Main hook for listing, filtering, and accessing all events.            |
| `useEventsRelated`  | Fetches related events for event page.                               |
| `useForm`           | General form state management.                                         |
| `useRestoreScroll`  | Persisting event section scroll position during filtering.             |
| `useUser          ` | Fetches and manages current user data.                          |
| `useVenue`          | Handles individual venue data.                                          |
| `useVenues`         | Fetches and lists all venues.                                           |

---

## 🧠 React Context Providers

| Provider            | Description                                                                                     |
|---------------------|-------------------------------------------------------------------------------------------------|
| `HeroUIProvider`    | Root component for HeroUI theme and behavior.                                                   |
| `AuthProvider`      | Provides authentication state and user session data.                                            |
| `ErrorProvider`     | Centralized broadcasting for error messages across the app.                                     |
| `ToastProvider`     | Centralized toast notification handler.                                                        |
| `UsersProvider`     | Supplies user data globally as user store.                                                      |
| `NavProvider`       | Stores and syncs navigation UI settings such as transparency.                                  |
| `FollowingProvider` | Manages logic for following/unfollowing other users.                                            |
| `EventsProvider`    | Globally accessible events store.                           |
| `FloatingProvider`  | Contains floating panel state (position, lock, transparency, selection mode, etc.).            |

---

## 🔍 Testing the App
You can test full functionality using:
```
Email: elton2@gmail.com
Password: 111111
```

This account has **Manager** privileges and can:
- Create new events
- Edit/delete own created events
- Access full profile and statistics
  
---

## How to Run Locally

To clone the project, run:

```bash
git clone https://github.com/frontio-ai/vite-template.git
cd vite-template
```

### 1. Install dependencies

Using `npm`:

```bash
npm install
```

Or with `yarn`:

```bash
yarn
```

### 2. Configure Environment Variables

1. Create a `.env` file in the root directory by copying the example:

   ```bash
   cp .env.example .env
   ```

2. Open the new `.env` file and fill in your environment-specific values. For example:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Save the file. The app will use these variables when running locally.

### 3. Run the development server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173/` 
(or the URL printed in your terminal).

---

## 📚 Credits
**Developement and design:** Peter Chinovsky, 2025  
**GitHub:** [https://github.com/pchinovsky](https://github.com/pchinovsky)

---

## License

Licensed under the
[MIT license](https://github.com/frontio-ai/vite-template/blob/main/LICENSE).
