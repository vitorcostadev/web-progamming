# Univali Web Progamming M1 - Simple Authentication System

A simple authentication system built with Node.js and Express, featuring user login, session management, and access history tracking.

## Features

- Login with username and password.
- Restricted area for authenticated users.
- Option to stay logged in for 3 days.
- Logout.
- Access history with date, time, and browser.

## Dependencies

- Node.js
- Express
- express-session
- HTML5
- JavaScript

## How to Run

1. Install the dependencies:

```bash
npm init -y
npm install express express-session
```

2. Start the server:

```bash
node src/js/index.js
```

3. Access the application in your browser:

```text
http://localhost:3000
```

## Users for tests

| User | Password |
| --- | --- |
| Joao | 1234 |
| Maria | 5678 |

## Main endpoints

- `GET /login`: show the login form.
- `POST /login`: validate the credentials and redirect to the home page.
- `GET /home`: show the restricted area.
- `GET /logout`: end the session.

## Note

The access history is stored in memory while the server is running. It will be lost when the server restarts.
