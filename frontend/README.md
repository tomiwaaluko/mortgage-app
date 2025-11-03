# Mortgage Full-Stack Application

This project is for Group 8's Large Project, for John Aedo's COP4331C at the University of Central Florida.

## Running Locally

### Frontend

Once you `git clone` this repo, run:
```bash
cd frontend
```

From here, run:
```bash
npm install
```
This will download all relevant packages for this project.

After this completes, run:
```bash
npm run dev
```

### Backend

Once you `git clone` this repo, run:
```bash
cd backend
```

Once in this folder, create a new file called `.env`, and add this to the file:
```bash
MONGO_URL="<INSERT URL HERE>"
```
You may want to set up your own [MongoDB Atlas cluster](https://www.mongodb.com/docs/atlas/getting-started/), and use the given link.

From here, run:
```bash
npm install
```
This will download all relevant packages for this project.

After this completes, run:
```bash
node server.js
```