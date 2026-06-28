# AuraTask - MERN Stack Task Tracker

AuraTask is a premium, lightweight, and fully responsive Task Tracker Web Application built with the MERN stack (MongoDB, Express, React, and Node.js). 

Designed with a strict, modern **pastel greens and white theme** (no dark modes, no emojis), it delivers an elegant workspace with inline task updates, statistical breakdowns, dynamic progress monitoring, and interactive search filtering.

---

## Folder Structure

```text
mern-task-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   └── taskController.js     # Express request controllers (CRUD)
│   ├── middleware/
│   │   └── errorMiddleware.js    # Global error & 404 handlers
│   ├── models/
│   │   └── Task.js               # Mongoose model & schema definitions
│   ├── routes/
│   │   └── taskRoutes.js         # REST route declarations
│   ├── .env.example              # Config placeholders
│   ├── .env                      # Local server configuration environment
│   ├── server.js                 # App entry point
│   └── package.json              # Server dependencies & scripts
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.jsx        # Branding Header component
│   │   │   ├── StatsPanel.jsx    # Real-time task statistics & progress indicator
│   │   │   ├── TaskCard.jsx      # Individual task visual cards & inline editor
│   │   │   ├── TaskForm.jsx      # Dynamic form validation & creation inputs
│   │   │   ├── TaskList.jsx      # Grid view of active task items
│   │   │   └── Toolbar.jsx       # Real-time search, filters & sorting layout
│   │   ├── context/
│   │   │   └── TaskContext.jsx   # State coordinator & API request dispatcher
│   │   ├── App.jsx               # Dashboard layout setup
│   │   ├── index.css             # Main stylesheet & design system
│   │   └── main.jsx              # React initialization
│   ├── index.html                # Custom HTML container with Outfit Google font
│   ├── vite.config.js            # Frontend build configurations
│   └── package.json              # Frontend client dependencies
├── package.json                  # Root monorepo script runner
└── README.md                     # Documentation & setup guides
```

---

## Key Features & Professional Highlights

- **Dynamic Interaction (No Refresh)**: Immutably handles task creation, status check toggle, inline edits, and deletions with zero page reloads.
- **Form Validation & Safe Entries**: Informs users in real-time of empty fields, character limits (500 max for description), and highlights dates scheduled in the past.
- **Interactive Search & Filter (Debounced)**: Debounces keyboard input (400ms delay) to limit redundant server requests. Includes options to filter by status and priority.
- **Task Analytics Metrics**: A dashboard panel listing total, completed, and pending tasks alongside a dynamic progress bar computing completion ratios.
- **Inline Editing**: Double click to edit or tap the Edit icon to transform the Task Card into an input form instantly, supporting prompt updates.
- **Aesthetic Precision**: Tailored HSL green tones and clean borders with no emojis. Vectors and labels use crisp SVG icons from the `lucide-react` library.
- **Database Indexing**: Embedded indexes inside Mongoose for status, priority, and due dates to secure optimal query speeds.

---

## Setup & Local Run Instructions

### Prerequisites
- Node.js installed locally (LTS recommended)
- A local MongoDB instance running OR a MongoDB Atlas connection string

### Step 1: Install Dependencies
Open your shell at the root of the project directory and run the monorepo helper script:
```bash
npm run install-all
```
This automatically installs the dependencies for both the frontend and the backend.

### Step 2: Configure Environment Variables
1. Navigate to the `backend/` folder.
2. Edit the `.env` file to configure your server port and database connection URI:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_tracker
NODE_ENV=development
```

### Step 3: Run the Application
You can run the frontend and backend in separate terminal shells to view log outputs side-by-side.

- **Start the Backend server**:
  ```bash
  npm run dev-backend
  ```
  The API will start at `http://localhost:5000`.

- **Start the Frontend client**:
  ```bash
  npm run dev-frontend
  ```
  Open the browser and visit the local port (usually `http://localhost:5173`).

---

## API Documentation (REST endpoints)

All endpoints return standardized JSON formatting.

| Method | Endpoint | Description | Query Parameters / Body |
|:---|:---|:---|:---|
| **GET** | `/api/tasks` | Fetch list of tasks | `search`, `status`, `priority`, `category`, `sortBy`, `sortOrder` |
| **GET** | `/api/tasks/:id` | Fetch detailed single task | None |
| **POST** | `/api/tasks` | Create a new task | JSON body: `{ title, description, dueDate, priority, category }` |
| **PUT** | `/api/tasks/:id` | Update task details / toggle status | JSON body: `{ title, description, dueDate, priority, category, status }` |
| **DELETE** | `/api/tasks/:id` | Remove a task permanently | None |

---

## Deployment Guide (Render & Vercel)

For a free public deployment, we recommend hosting the **Backend** on **Render** (or Railway) and the **Frontend** on **Vercel** (or Netlify).

### 1. Database Setup (MongoDB Atlas)
1. Register for a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Shared Cluster (M0 Free tier) and name your database.
3. Under **Network Access**, add `0.0.0.0/24` or click "Allow Access from Anywhere".
4. Under **Database Access**, create a user credentials set (keep username and password handy).
5. Copy the connection string (usually `mongodb+srv://...`) and replace `<username>` and `<password>` with your database user credentials.

### 2. Deploying Backend on Render
1. Push your monorepo code to a public GitHub repository.
2. Log in to [Render](https://render.com/) and click **New > Web Service**.
3. Link your GitHub repository.
4. Set the following details:
   - **Name**: `aura-task-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add the following Environment Variables:
   - `MONGO_URI`: *Your MongoDB Atlas connection URL copied above*
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
6. Click **Deploy**. Render will output a URL (e.g., `https://aura-task-backend.onrender.com`).

### 3. Deploying Frontend on Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Select your GitHub repository.
3. Configure the Vite setup:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://aura-task-backend.onrender.com/api/tasks` (change this to the exact backend URL Render outputs)
5. Click **Deploy**. Vercel will complete the build and provide a frontend URL (e.g., `https://aura-task-frontend.vercel.app`).
