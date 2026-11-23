# S88 - MTE - App Building

## Features:
### Stack:
- MEVN (Mongoose, Express, Vue, Node)

### Users
- all users can register/login with only an email and password
- view movies from catalog, movies should be in a card

### Admins:
- admin dashboard to display all movies in a table and create movies
- add movie button

### Logged in user:
- view single movie card. and have the fields:
    - title
    - director
    - year
    - description
    - genre
    - comments
- view movie button for each movie card

### API usage:
- Base api url is https://movieapp-api-lms1.onrender.com or VITE_BASE_API_URL in .env
- Refer to the API url usage in ./movieApp.md

### file structure:
- feature-based folder architecture
- page components are fairly contained within their own folders, they are in:
    - pages/home/Home.vue, with the other components like MovieCards.vue that are used are in pages/home/components/MovieCards.vue
- for components that aren't pages like navbar, they are in src/components/Navbar.vue