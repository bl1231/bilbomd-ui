# bilbomd-ui

`bilbomd-ui` is the frontend GUI for BilboMD. It is a Single Page Application [SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA). The deploy [instructions](https://github.com/bl1231/bilbomd#2-deploy-the-bilbomd-front-end-ui) are outlined in more detail the [bilbomd](https://github.com/bl1231/bilbomd) repo, and give instructions for deploying a production instance to `https://bilbomd.bl1231.als.lbl.gov`, but if you want to start a development version you can just check this code out and fire it up interactively.

## Getting Started with Vite

This project uses [Vite](https://vite.dev/guide/why.html) for bundling, to provide a dev server, and we are beginning to use the closly related [Vitest](https://vitest.dev/) to help us write unit tests. Have a look at the Vite documentation to see why we use it.

## Available Scripts

There are a number of scripts defined in the `package.json` file:

```json
  "scripts": {
    "clean": "rimraf dist/*",
    "dev": "GIT_HASH=$(git rev-parse --short HEAD) vite",
    "prebuild": "tsc",
    "build": "vite build",
    "lint": "eslint",
    "preview": "vite preview",
    "optimize": "vite optimize"
  }
```

### `npm run dev`

Runs the app in the development mode, and will serve on port 3002.\

Open [http://localhost:3002](http://localhost:3002) to view the developemnt instance in the browser.

The page will automagically refresh if you make edits. You will also see any linting errors in the console.

### `npm run build`

Will transpile the Typescript code using `tsc` then optimize for production. Output goes into `dist` directory.

### `npm run lint`

Will run eslint on code.

## Deploy production

The production instance is served from an `ngnix` [Docker container](https://hub.docker.com/_/nginx). Have a look at the `bilbomd-ui.dockerfile` for details of the docker build. The entire production ecosystem is deployed as a single Docker compose setup. Details are in the [bilbomd](https://github.com/bl1231/bilbomd) repo.

## NERSC Notes

When deployed to NERSC/SPIN in order to develop the frontend with a simple `npm run dev` you must forward the backend proxy. We can expose a loadbalancing port from the Rancher K8 control plane and then use SSH tunnels.

```bash
ssh -L 3501:backend-loadbalancer.bilbomd.development.svc.spin.nersc.org:5432 perlmutter
```

Then you should be able to start a local development instance of `bilbomd-ui` with `npm run dev` and point your browser to `localhost:3002` and you should be connected to the development backend service running on SPIN.

## Authors

- Scott Classen sclassen at lbl dot gov
- Shreyas Prabhakar shreyasprabhakar at lbl dot gov
- Michal Hammel mhammel at lbl dot gov

## Version History

- 1.13.1 (10/21/2024)
  - Improve colors for the Home component
  - Add dark mode schematic image files
- 1.13.0 (10/18/2024)
  - Add User Account component that allows user to change email address and delete account
  - Implement Vitest and add a few initial tests
  - Improve the Home page component seen by unauthenticated users
- 1.12.4 (10/10/2024)
  - Add schematic diagrams for BilboMD AF and BilboMD SANS pipelines
- 1.12.3
  - Improve error handling for the Jobs page when user has no jobs
- 1.12.2
  - Add schematic diagrams showing various steps of BilboMD pipelines
- 1.12.1
  - Add feedback components and conditionally display based on presence in MongoDB
- 1.12.0
  - Add initial BilboMD SANS forms
  - Add @bl1231/bilbomd-mongodb-schema as a dependency
- 1.11.3
  - Remove line length validation (70 character limit) for user-uploaded `const.inp` files.
  - Instead we will sanitize `const.inp` files on the backend.
- 1.11.2
  - Add line length validation (70 character limit) for user-uploaded `const.inp` files
- 1.11.1
  - Add "experimental" tag to the MolStar Viewer
  - Single Job Page loads with NERSC Steps Accordian unexpanded if job is Completed
- 1.11.0
  - Add BilboMD AF (AlphaFold) job type
  - Add NERSC status checker so that new jobs cannot be submitted if Perlmutter is down.
  - Various UI improvements
- 1.10.3
  - Add Perlmutter outage notices to the NERSC status component
- 1.10.2
  - Improve caching during GitHub Actions
  - Migrate MUI Grid to Grid2
- 1.10.1
  - Fix git hash value display in footer
  - Add checks for null/undefined data in FoXSAnalysis component
- 1.10.0
  - Add config information table to the Admin panel
  - Improvements to CI/CD workflow
- 1.9.7
  - Use new config API for config info (e.g. dev/prod, useNersc, repo, etc.)
  - remove all `VITE_*` references from frontend code
- 1.9.6
  - Implement separate "latest" and "versioned" GitHub Actions for building Docker images
- 1.9.5
  - Improvements to the NERSC Status component
  - Add conditional visibility to some columns in Jobs table
  - Add NERSC logo to header when deployed to SPIN
  - Increase maximum allowed file size for uploaded PAE json files
- 1.9.4
  - Add CI/CD GitHub action workflow to build docker images on push to main
  - Add validation function for SAXS data files
  - Add validation function for RNA
  - Improvements to Instructions
  - Many dependency updates including to eslint 9.x
- 1.9.3
  - Add new NERSC step status component
  - Fix the unresponsive footer
- 1.9.2
  - Use `.env` to toggle NERSC-specific UI elements.
  - Add clarification to some instructions
  - Remove pm2 dependency
- 1.9.1
  - Changes for NERSC deployment
- 1.9.0
  - Using Content-Disposition headers for more precise results downloading
  - Fix to `inp Jiffy` to handle PDB files with more than `A-Z` ChainIDs.
  - All File Select input elements now enforce specific file suffixes.
- 1.8.4
  - Adjust INP Jiffy to procude inp files with CHARMM-specific segid naming.
  - Update summary information on the unauthenticated home page.
- 1.8.3
  - Add a slider to control the weight value used by `igraph` `cluster_leiden()` function.
- 1.8.2
  - Changes to allow PDB or CRD/PSF files for BilboMD Classic
  - Now using createBrowserRouter from react-router-dom
  - Add global ErrorBoundary
  - Convert some `*.js` file to `*.ts`
- 1.8.1
  - Improve NERSC status component
  - Fix bug in INP Jiffy multistep form
- 1.8.0
  - Mainly changes to allow building and deploying on local laptop and NERSC SPIN.
  - Added new Admin panel with view of BullMQ queues
- 1.7.3
  - INP Jiffy now accepts only `PDB` files instead of CRD.
- 1.7.2
  - PAE Jiffy now accepts only `PDB` files instead of CRD.
- 1.7.1
  - Hide delete button for jobs that are "Submitted" or "Running"
  - Comment out some verbose unneeded console logs
- 1.7.0
  - Add components for displaying `FoXS` analysis for BilboMD classic/auto jobs.
- 1.6.2
  - Fix bug when `rg_min` and `rg_max` are too close.
- 1.6.1
  - Better feedback about status of `bilbomd` and `scoper` BullMQ queues.
- 1.6.0
  - Add ability to toggle between Dark and Light mode.
- 1.5.1
  - Refactor and improve the Scoper job details page
- 1.5.0
  - Add `rechart` dependency for displaying `FoXS` plots.
  - Display `FoXS` plots and Chi^2 values for Scoper results
- 1.4.2
  - Improvements to the Molstar viewer.
- 1.4.1
  - Forgot to merge the feature branch... oops.
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
  - Changes to allow Docker deployment for UI
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
  - Bug fixes for AutoRg
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
