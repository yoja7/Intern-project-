# Dainiki — Personal Task Manager

> A clean, frontend-only personal task manager built with React + Vite. Manage your daily tasks, set reminders, track progress, and stay organised — all stored locally in your browser.

---

## Features

- **Authentication** — Register, login, logout, forgot password, OTP verification, and password reset (all localStorage-based)
- **Task Management** — Create, edit, delete, complete, search, and filter tasks
- **Subtasks** — Add, complete, and delete subtasks with a progress bar
- **Activity Logs** — Every task action is automatically logged with a timestamp
- **Categories** — Create and manage custom categories to organise tasks
- **Calendar View** — Browse tasks by month, see task indicators on dates, click a date to view its tasks
- **Dashboard** — Stats overview (total, pending, in progress, completed, overdue, high priority), today's tasks, upcoming tasks, and recent activity
- **Notifications** — In-app notifications with mark-read, delete, and clear-all; browser notification permission support
- **Settings** — Toggle notification preferences (reminders, completion alerts, motivational messages)
- **Profile** — Edit name/email and change password
- **Share** — Share today's tasks via Web Share API or clipboard fallback
- **Responsive** — Works on mobile, tablet, and desktop with a collapsible sidebar

---

## Technologies Used

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite 8](https://vitejs.dev/) | Build tool and dev server |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [Bootstrap 5](https://getbootstrap.com/) | CSS framework |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon library (Feather Icons) |
| [uuid](https://github.com/uuidjs/uuid) | Unique ID generation |
| localStorage | All data persistence (no backend) |

---

## Installation

Make sure you have **Node.js 18+** installed.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd dainiki

# 2. Install dependencies
npm install
```

---

## Running the Project

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# Run the linter
npm run lint
```

---

## Demo Account

A demo account is pre-loaded on first launch:

| Field | Value |
|---|---|
| Email | `demo@dainiki.com` |
| Password | `demo1234` |

---

## Folder Structure

```
dainiki/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png              # Landing page hero image
│   ├── components/
│   │   ├── CategoryForm.jsx      # Form for creating/editing categories
│   │   ├── DashboardStats.jsx    # Stat cards row on the dashboard
│   │   ├── EmptyState.jsx        # Empty list placeholder
│   │   ├── Loader.jsx            # Centered spinner
│   │   ├── Navbar.jsx            # Top navigation bar (user menu, bell)
│   │   ├── NotificationCard.jsx  # Single notification display
│   │   ├── ReminderCard.jsx      # Single reminder display
│   │   ├── Sidebar.jsx           # Left navigation sidebar
│   │   ├── TaskCard.jsx          # Task summary card with actions
│   │   └── TaskForm.jsx          # Form for creating/editing tasks
│   ├── context/                  # Reserved for future React Context usage
│   ├── data/
│   │   └── initialData.js        # Seed data for first-time localStorage setup
│   ├── hooks/                    # Reserved for future custom hooks
│   ├── layouts/
│   │   ├── DashboardLayout.jsx   # Sidebar + navbar wrapper for protected pages
│   │   └── MainLayout.jsx        # Minimal wrapper for public pages
│   ├── pages/
│   │   ├── Calendar.jsx          # Monthly calendar with task indicators
│   │   ├── Categories.jsx        # Category management
│   │   ├── Dashboard.jsx         # Main dashboard with stats and activity
│   │   ├── ForgotPassword.jsx    # Step 1 of password reset flow
│   │   ├── Home.jsx              # Public landing page
│   │   ├── Login.jsx             # Login page
│   │   ├── NotFound.jsx          # 404 page
│   │   ├── Notifications.jsx     # Notification centre
│   │   ├── OtpVerification.jsx   # Step 2 of password reset (OTP: 123456)
│   │   ├── Profile.jsx           # Edit profile and change password
│   │   ├── Register.jsx          # Registration page
│   │   ├── ResetPassword.jsx     # Step 3 of password reset
│   │   ├── Settings.jsx          # Notification and app settings
│   │   ├── TaskDetails.jsx       # Full task view with subtasks and activity log
│   │   └── Tasks.jsx             # Task list with search and filters
│   ├── routes/
│   │   ├── AppRoutes.jsx         # All route definitions
│   │   ├── GuestRoute.jsx        # Redirects logged-in users away from auth pages
│   │   └── ProtectedRoute.jsx    # Redirects guests away from protected pages
│   ├── styles/
│   │   └── main.css              # All custom global styles
│   ├── utils/
│   │   ├── authHelpers.js        # Register, login, logout, password helpers
│   │   ├── localStorage.js       # Safe read/write wrappers for localStorage
│   │   ├── notificationHelpers.js# In-app and browser notification helpers
│   │   ├── shareHelpers.js       # Web Share API / clipboard share helper
│   │   └── taskHelpers.js        # Task and category CRUD, search, filter, stats
│   ├── App.jsx                   # Root component — BrowserRouter + routes
│   └── main.jsx                  # Entry point — mounts React app
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## localStorage Usage

All data is stored in the browser's `localStorage` under these keys:

| Key | Contents |
|---|---|
| `dainiki_users` | Array of registered user objects |
| `dainiki_current_user` | Currently logged-in user session (no password) |
| `dainiki_tasks` | Array of all task objects |
| `dainiki_categories` | Array of all category objects |
| `dainiki_notifications` | Array of all notification objects |
| `dainiki_notification_settings` | User's notification preferences |
| `dainiki_reset_email` | Temporary email for the password reset flow |

> **Note:** Data is per-browser and per-origin. Clearing browser data will reset the app to its initial state.

To reset the app to defaults, open DevTools → Application → Local Storage → clear all `dainiki_*` keys and refresh.

---

## Password Reset Flow

Since there is no backend, the OTP is simulated:

1. Go to **Forgot Password** and enter your email
2. You'll be taken to the OTP page — enter **`123456`**
3. Set your new password

---

## Screenshots

> _Add screenshots here once the app is running._

| Page | Screenshot |
|---|---|
| Home | _(placeholder)_ |
| Dashboard | _(placeholder)_ |
| Tasks | _(placeholder)_ |
| Calendar | _(placeholder)_ |
| Notifications | _(placeholder)_ |

---

## Future Improvements

- [ ] React Context or Zustand for global state (avoid prop drilling)
- [ ] Dark mode support
- [ ] Drag-and-drop task reordering
- [ ] Task tags / labels (multiple per task)
- [ ] Export tasks to CSV or PDF
- [ ] Recurring task auto-generation
- [ ] Search across all pages (global search)
- [ ] Keyboard shortcuts
- [ ] PWA support (offline-first with service worker)
- [ ] Backend integration (Node.js + MongoDB or Supabase)

---

## Author

Built as a coursework project for internship readiness.

| | |
|---|---|
| Project | Dainiki |
| Version | 1.0.0 |
| Stack | React + Vite + Bootstrap 5 |
| Storage | localStorage (frontend-only) |
