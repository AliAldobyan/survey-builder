# Survey Builder

A three-step survey builder for configuring settings, adding and answering questions, and reviewing the survey before submission. Built with React, TypeScript, Mantine, Redux Toolkit, and Vite.

Supports English and Arabic, light and dark themes, survey templates, question reordering, and image/document attachments with validation and previews.

## Run locally

Requires Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local URL shown in the terminal. The mock API runs with Vite and does not persist submitted surveys. Attachments stay in browser memory; submission sends their metadata.

## Project structure

```text
mocks/                  Mock API handlers and bilingual survey templates
src/
  app/                  App layout and Mantine theme
  components/           Shared UI and survey components
    survey/
      steps/            Settings, questions, and review screens
      attachments/      File selection, validation, and previews
  i18n/                 Translations and language switching
  services/             RTK Query API definitions
  store/                Redux store, survey state, and typed hooks
  types/                Shared survey types
  utils/                Text direction helper
  main.tsx              App entry point
  index.css             Global styles
```

## Checks

```sh
npm run build
npm run lint
```
