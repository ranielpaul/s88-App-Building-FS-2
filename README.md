# S88 - MTE - App Building

## Features:
### General Requirements:
- mern stack
-get all movies, get specific movie, add movie for admin
- authentication and login



### Users
- all users can register/login with only an email and password
- view movies from catalog, movies should be in a card

### Admins:
- admin dashboard to display all movies in a table and create movies
- add movie button

### Logged in user:
- view single movie card. should have fields like:
    - title
    - director
    - year
    - description
    - genre
    - comments
- view movie button for each movie card

### API usage:
-  base api url is https://movieapp-api-lms1.onrender.com or VITE_BASE_API_URL in .env
- Refer to the API url usage in ./movieApp.md

### file structure:
- feature-based folder architecture
- page components are fairly contained within their own folders, they are in:
    - pages/home/home.jsx, with the other components like MovieCards.jsx that are used are in pages/home/components/MovieCards.jsx
- for components that aren't pages like navbar, they are in src/components/Navbar.jsx