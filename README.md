<a href="http://accretence.com">![next-dashboard](https://i.imgur.com/hNovO0U.png)</a>

<a href="https://npmjs.com/package/create-next-dashboard">
   <p align="center">
   <img src="https://img.shields.io/npm/v/create-next-dashboard?style=for-the-badge&labelColor=000000">
   <img src="https://img.shields.io/npm/dw/create-next-dashboard?color=000&style=for-the-badge">
   </p>
</a>

## Live Demo

You can find a live demo at [accretence.com](https://accretence.com)!

## Usage

1. Setup a local deployment using this command:

```bash
npx create-next-dashboard my-app
```

2. Create your `.env` file and provide `JWT_SECRET` & `MOGNO_ATLAS_URI` variables.
3. Fill in the `main.config.js` file with your preferred information.
4. Run `cd my-app` and `npm run dev`, the app should be running in `localhost:3000`!

## Authentication

Authentication is implemented using `httpOnly` cookies served from serverless API functions.

## Database

You can spin up a MongoDB database instance using MongoDB Atlas. Provide the `MOGNO_ATLAS_URI` in `.env`.

## Google Analytics

You only need to provide your `googleAnalyticsID` in `main.config.js` file to activate your Google Analytics.

## About

Running the `npx` script above should create a Next.js dashboard built using:

-   [create-next-dashboard](https://github.com/accretence/create-next-dashboard) the `npx` script to set up a smarter web app by running one command!
-   [geist-ui](https://github.com/geist-org/geist-ui) UI library which adheres to the design language of [Vercel](https://vercel.com/)!
-   [react-dashboard-design](https://github.com/ofekashery/react-dashboard-design) as inspiration and much of the initial codebase!
-   [nextjs-client-auth-architectures](https://github.com/justincy/nextjs-client-auth-architectures) as the route protection architecture!

## Dependencies

```json
   "@geist-ui/core": "^2.3.8",
   "apadana": "^0.0.4",
   "axios": "^0.27.2",
   "bcryptjs": "^2.4.3",
   "cookie": "^0.5.0",
   "jose": "^4.8.3",
   "mongoose": "^6.5.0",
   "next": "^12.2.3",
   "nodemailer": "^6.7.7",
   "react": "^18.2.0",
   "react-usestateref": "^1.0.8"
```
