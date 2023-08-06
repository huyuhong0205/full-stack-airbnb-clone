# Full stack airbnb clone

This is a full-stack web application build from scratch by my self for practicing web development skills.

[https://fullstack-bnb-clone-client.vercel.app/](https://fullstack-bnb-clone-client.vercel.app/)

**IMPORTANT** :
The backend server will automatically shut down after 15 minutes of inactivity. If an error occurs during your visit, please wait for the server to restart.

### Test accounts

```
accounts: user001@test.com - user005@test.com
password: password
```

or you can register by your self

**IMPORTANT** :
My server is hosted on [Render's](https://render.com/) free plan there are some limitations. So I did not provide landlord accounts, some feature please see the **[OVERVIEW](#overview)** below or clone this repo [(see instruction)](#run-this-project) to test.

## Technic

- Typescript
- React
- Sass
- Node.js
- Express
- MongoDB

## Project Structure

### Front end

```
PROJECT_ROOT
├── public              # static assets
├── src
│   ├── assets          # assets
│   ├── components      # React components
│   ├── hooks           # custom hooks
│   ├── pages           # page files
│   ├── store           # Redux store and slices
│   ├── styles          # Sass mixin and css variables
│   ├── types           # type of REST api response
│   └── utils           # utility functions
└── ssl                 # SSL certificate for using https in Vite dev server
```

### Back end

```
PROJECT_ROOT
├── env                 # environment variables
├── public              # server static files
└── src
    ├── config-env      # script for configuration environment variables
    ├── controllers
    ├── middleware
    ├── models          # MongoDB document models
    ├── routes          # server routes
    ├── types
    │   └── declare     # typescript declare types
    └── utils           # utility functions

```

## Overview

_All pages support RWD (responsive web design)._

### Home page

https://github.com/huyuhong0205/full-stack-airbnb-clone/assets/114565048/0418ab2f-47c9-4465-92f2-7194269bb49d

- Implement infinite scrolling using Intersection Observer, in conjunction with a Node.js pagination API.

### Search rooms page

https://github.com/huyuhong0205/full-stack-airbnb-clone/assets/114565048/db2aa19d-9ecd-413f-8183-fdd22c4a20e0

- Utilize MongoDB queries for location-based searches.
- Use the Google Maps JavaScript API to display a map and markers for rooms. You can also interact with the markers on the map.

### Room detail page

https://github.com/huyuhong0205/full-stack-airbnb-clone/assets/114565048/d9cb3734-690b-4367-8457-9f714119650c

- You can booking room on this page, of course only logged-in users are allowed.

### Authentication page

https://github.com/huyuhong0205/full-stack-airbnb-clone/assets/114565048/ae2c5495-f506-42d0-b074-826c4fcc9df5

- Sign up and login.
- Use custom hooks to validate user input for better user experience.
- Also validate user input in server side to ensure security.
- USe JWT and Cookies for user authentication.
- Manage authentication and authorization state using Redux.

### Profile page

https://github.com/huyuhong0205/full-stack-airbnb-clone/assets/114565048/e3334588-6d65-4ef6-8069-8e5a8097ba90

- Profile photo upload.
- Modify user information and change password.
- Logout.

### My bookings page

https://github.com/huyuhong0205/full-stack-airbnb-clone/assets/114565048/d114ccdb-bc85-4327-8f08-321dcc7532af

- View user's bookings.

### My rooms page & Edit room page

https://github.com/huyuhong0205/full-stack-airbnb-clone/assets/114565048/cbc68365-b502-43c0-99a2-1834c8a7d13f

- _landlords only_.
- Manage host's rooms.
- Edit room information.
- Delete room. Only rooms without orders can be deleted.

### Create room page

https://github.com/huyuhong0205/full-stack-airbnb-clone/assets/114565048/dd6dc8ec-25bf-42aa-97f5-65b70ebb9b7f

- _landlords only_.
- Upload multiple images.
- Using Google Geocoding API converts the address into latitude and longitude coordinates.
- Support hosts to write descriptions using Markdown.

## Libraries

### Front end

- [vite](https://vitejs.dev/) - Front end development tools.
- [react](https://react.dev/)
- [react-router-dom](https://reactrouter.com/en/main)
- [react-redux](https://react-redux.js.org/), [redux-toolkit](https://redux-toolkit.js.org/) - Application wide state management.
- [react-date-range](https://www.npmjs.com/package/react-date-range) - A date range picker component.
- [react-icons](https://www.npmjs.com/package/react-icons) - Include popular icons in React projects easily.
- [react-markdown](https://www.npmjs.com/package/react-markdown) - React component to render markdown.
- [react-transition-group](https://www.npmjs.com/package/react-transition-group) - Exposes simple components useful for defining entering and exiting transitions.
- [google-maps-react-markers](https://www.npmjs.com/package/google-maps-react-markers) - Easy way to render custom markers in google-maps-javascript-api.

### Back end

- [express](https://expressjs.com/) - Back end web application framework for node.js.
- [express-validator](https://www.npmjs.com/package/express-validator) - An express middleware for validate http request data and sanitize XSS.
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize) - Against NoSQL query injection.
- [mongoose](https://mongoosejs.com/) - Elegant mongodb object modeling for node.js.
- [cors](https://www.npmjs.com/package/cors) - For providing a Connect/Express middleware that can be used to enable CORS with various options.
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a .env file into process.env.
- [helmet](https://www.npmjs.com/package/helmet) - Helps you secure your Express apps by setting various HTTP headers.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - An implementation of JSON Web Tokens.
- [multer](https://www.npmjs.com/package/multer) - Node.js middleware for handling multipart/form-data.
- [node-fetch](https://www.npmjs.com/package/node-fetch) - A light-weight module that brings Fetch API to Node.js.
- [sharp](https://www.npmjs.com/package/sharp) - Node.js image processing.

### Linting

- [eslint](https://www.npmjs.com/package/eslint)
- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- [eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript)

## Run this project

If you want to clone this repo for testing, you will need some additional setup.

### Client

1. add a `./.env` file

```
VITE_SERVER_API={{YOUR_SERVER_URL}}/api/v1
VITE_SERVER_ROOM_IMG={{YOUR_SERVER_URL}}/images/room/
VITE_SERVER_USER_IMG={{YOUR_SERVER_URL}}/images/profile/

VITE_GOOGLE_KEY={{YOUR_GOOGLE_CLOUD_API_KEY}}
```

### server

1. add a `./env/config.env` file

```
NODE_ENV='development'

DB='{{YOUR_MONGODB_CONNECTION_STRING}}'
DB_PASS='{{YOUR_MONGODB_CLOUD_PASSWORD}}'

PORT=3000

JWT_SECRET='{{YOUR_JWT_SECRET}}'
JWT_EXPIRES='30d'
JWT_COOKIE_EXPIRES=30

GOOGLE_API_KEY='{{YOUR_GOOGLE_CLOUD_API_KEY}}'
```

2. modify the `./src/app.ts` file

```typescript
app.use(
  cors({
    origin: ['{{URL1}}', '{{URL2}}'], // CHANGE TO YOUR CLIENT SIDE URL
    credentials: true, // allow to send credentials to origins
  })
);
```

## Reference

- [Airbnb](https://www.airbnb.com/) - UI, feature
