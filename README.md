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

## Deploy production

```bash
pm2 deploy ecosystem.config.cjs production update
```

## Version History

- 1.5.1
  - Refactor and improve the Scoper job details page
- 1.5.0
  - Add `rechart` dependency for displaying `FoXS` plots.
  - Display `FoXS` plots and Chi^2 values for Scoper results
- 1.4.2
  - Improvements to the Molstar viewer.
- 1.4.1
  - Forgot to merge the feature brnach... oops.
  - Now we should have a Molstar viewer.
- 1.4.0
  - Add [Molstar][Molstar] viewer for Scoper Job detail page.
- 1.3.1
  - Add better Scoper status information in the `SingleJobPage`
    It still needs work, but I want to release what's been done so far.
- 1.3.0
  - Add new Scoper options for RNA
- 1.2.4
  - Upgrade redux and redux toolkit
- 1.2.3
  - Some improvements to the Job details component
  - Changes to allow Docker deployment
  - update Vite from 4.5.0 to 5.0.0
- 1.2.2
  - Add better information about number of MD runs and conformation to Job details
- 1.2.1
  - Fix bug in Job/Jobs components when there is no BullMQ entry
  - Changed default `conformational_sampling` to `3` for BilboMD Auto jobs
- 1.2.0
  - Changes to accomodate new Typescript backend code
- 1.1.2
  - Increase max upload for PAE json files in `af2paeJiffySchema`
- 1.1.1
  - Fix bug when directly loading Job component with error
- 1.1.0
  - Add better error reporting for CHARMM steps
- 1.0.0
  - Add BilboMD Auto job submission form
  - Fix bug in MultiFoXS with Eigne library
  - Simplify the result PDBs bundled into `results.tar.gz`
- 0.0.20
  - Increase the max allowed file size of uploaded `PAE.json`` files from 20MB to 40MB
- 0.0.19
  - Add necessary changes to make compatible with the new `v1` API
- 0.0.18
  - Bug fixes fro AutoRg
- 0.0.17
  - Add AutoRG functionality to the New Job Form
- 0.0.16
  - Update NPM dependencies
  - Bump NodeJS to 18.18.0
- 0.0.15
  - Add Number of Workers to BullMQ Summary component
- 0.0.14
  - Add BullMQ Summary component
- 0.0.13
  - Improve Job Detail page
  - Add step indicators for BilboMD
  - Display information about queue position in the Job List page
- 0.0.12
  - Update the Welcome component
  - Add better references to Welcome page
  - Update nodejs dependencies
- 0.0.11
  - Add PAE jiffy (creates const.inp from AlphaFold PAE JSON input file).

[Molstar]: https://github.com/molstar/molstar
