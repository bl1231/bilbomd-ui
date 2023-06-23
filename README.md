# bilbomd-ui

`bilbomd-ui` is the frontend GUI for BilboMD. It is a Single Page Application [SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA). The deploy [instructions](https://github.com/bl1231/bilbomd#2-deploy-the-bilbomd-front-end-ui) are outlined in more detail the [bilbomd](https://github.com/bl1231/bilbomd) repo, and give instructions for using [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) to deploy a production instance to `https://bilbomd.bl1231.als.lbl.gov`, but if you want to start a development version you can just check this code out and fire it up interactively.

## Getting Started with Create React App

This project was initially bootstrapped with [Create React App](https://github.com/facebook/create-react-app), but since CRA seems is no longer maintained I switched to using [Vite](https://vitejs.dev/)

## Available Scripts

There are a number of scripts defined in the `package.json` file:

```json
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "optimize": "vite optimize"
```

### `npm run dev`

Runs the app in the development mode, and will serve on port 3003.\
Open [http://localhost:3003](http://localhost:3003) to view it in the browser.

The page will automagically refresh if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Will transpile the Typescript code using `tsc` then optimize for production. Output goes into `dist` directory.

### `npm run lint`

I haven't played with this much. I do most linting in VSCode

### `npm run preview`

Locally preview the production build. Do not use this as a production server as it's not designed for it.

### `npm run optimize`

Pre-bundle dependencies.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
