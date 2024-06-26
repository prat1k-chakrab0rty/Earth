# EARTH : React Redux JWT Cookies Node.js APP 'v1.0.0'

## Project Overview

This mini project is a full-stack web application that demonstrates user authentication using JSON Web Tokens (JWT) and cookies. The application uses React and Redux for the frontend and Node.js with Express for the backend.

## Features

- User Registration and Login
- JWT-based Authentication
- Cookie management for session persistence
- Protected routes in React
- Error handling and form validation

## Tech Stack

- React
- Node.js

### Frontend

- React
- Redux Toolkit
- Axios
- React Router

### Backend

- Node.js
- Express
- JWT
- Cookie-Parser


## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

Clone the repository: git clone https://github.com/prat1k-chakrab0rty/Earth.git

#### Backend

1. Navigate to the backend directory:
   
   cd api

2. Install backend dependencies:
   
   npm install

3. Create a .env file in the backend directory and add your environment variables:
    
    PORT="8800"
    
    FRONTEND_URL="http://localhost:5173"
    
    JWT_SECRET="my_secret"

4. Start the backend server:
   
    npm start

#### Frontend

1. Navigate to the frontend directory:

    cd client

2. Install frontend dependencies:

    npm install

3. Start the frontend development server:

    npm run dev


### Note

- If the react URL hostname is '127.0.0.1' then kindly go to the url bar and change it to 'localhost' otherwise the cookies will not work as expected and the API calls might throw errors.


- And yes, probably maybe some cool additions might take place in this repo.



