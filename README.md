# IA03 / IA04 - Full-Stack JWT Auth Project

This is a full-stack user registration and authentication application. It features a React frontend and a Spring Boot backend, connected to a cloud-hosted PostgreSQL database.

The system implements a complete, secure JWT-based authentication flow with access tokens and refresh tokens, protected routes, and silent refresh.

## Features

### Backend (Spring Boot)

* **API Framework:** Spring Boot with Spring Web.
* **Security:** Spring Security for all endpoint protection.
* **Database:** Cloud-hosted PostgreSQL (on Render).
* **API Endpoints:**
    * `POST /user/register`: Handles new user registration with **BCrypt** password hashing.
    * `POST /user/login`: Authenticates a user and returns a short-lived **Access Token** and a long-lived **Refresh Token**.
    * `POST /auth/refresh`: Accepts a valid Refresh Token and issues a new Access Token.
    * `GET /user/me`: A **protected endpoint** that only authenticated users can access, returning their profile.
* **CORS:** Enabled to allow requests from the `localhost:3000` frontend.

### Frontend (React)

* **UI/Styling:** React with Material UI.
* **Form Management:** `React Hook Form` for client-side validation on Login and Sign Up.
* **API State Management:** `React Query` (`useQuery`, `useMutation`) for all server-side data, including loading and error states.
* **Routing:** `React Router` with a full authentication-aware structure:
    * **Public Routes:** (`/`) Everyone can see.
    * **Protected Routes:** (`/dashboard`) Only logged-in users can see.
    * **Public-Only Routes:** (`/login`, `/sign-up`) Only logged-out users can see.
* **Full Authentication Flow:**
    * **Token Storage:** Access Token is stored in memory (`AuthContext`), Refresh Token is stored in `localStorage`.
    * **Axios Interceptor:** An `axios` instance that automatically:
        1.  Attaches the Access Token to all protected requests.
        2.  Catches `401 Unauthorized` errors.
        3.  Automatically calls the `/auth/refresh` endpoint to get a new token.
        4.  Retries the original failed request seamlessly.
    * **Silent Refresh:** On page load, the app automatically uses the `refreshToken` to get a new `accessToken`, keeping the user logged in.
    * **Secure Logout:** Clears all tokens from memory, `localStorage`, and **clears the React Query cache** to prevent stale data.

## Folder Structure
ia03-user-registration/
├── backend/
│ └── user-registration/ # Spring Boot application
├── frontend/ # React application
└── README.md

## Requirements

* [Java 17](https://www.oracle.com/java/technologies/downloads/#java17) (or newer)
* [Node.js](https://nodejs.org/en) (v18 or newer)
* [Maven](https://maven.apache.org/download.cgi) (or use the included Maven wrapper)
* A free **PostgreSQL** database from [Render](https://render.com/) (or any other provider).

---

## 🚀 How to Run Locally

You will need to run two separate terminals for this project.

### 1. Backend (Spring Boot)

The backend runs on `http://localhost:8080`.

1.  **Configure Database:**
    * Navigate to `backend/user-registration/src/main/resources/application.properties`.
    * Get your PostgreSQL connection string (e.g., from Render).
    * Update the `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` properties with your database credentials.

2.  **Run the Application:**
    * Open a terminal and navigate to the backend folder:
        ```sh
        cd backend/user-registration
        ```
    * Run the project using the Maven wrapper:
        ```sh
        ./mvnw spring-boot:run
        ```
    * The backend will start and automatically create/update the `users` table in your cloud database.

### 2. Frontend (React)

The frontend runs on `http://localhost:3000`.

1.  **Install Dependencies:**
    * Open a **new** terminal and navigate to the frontend folder:
        ```sh
        cd frontend
        ```
    * Install all required packages:
        ```sh
        npm install
        ```
    * (This will install React, React Router, MUI, Axios, React Query, etc.)

2.  **Run the Application:**
    * Once installation is complete, start the development server:
        ```sh
        npm start
        ```
    * Your default browser will automatically open to `http://localhost:3000`.