# Feature Implementation Plan

**Overall Progress:** `100%`

## TLDR
Connect the plant tracker app to the Perenual plant database via a Vercel serverless proxy. In the Add Plant flow, users can optionally search for a species, select a result, give it a nickname, and save it with all available care data stored locally for future use.

## Critical Decisions
- **API:** Perenual — free tier with species names and care data (watering, sunlight, humidity, etc.)
- **Backend proxy:** Vercel Serverless Functions — keeps API key server-side, JS ecosystem, free tier
- **UX flow:** Search species first → select → nickname → save. Search is optional (skip to nickname).
- **Care data storage:** Store all available fields from API, but no new display UI yet
- **Security:** API key never reaches client; proxy handles all Perenual communication

## Tasks

- [x] 🟩 **Step 1: Vercel serverless proxy**
  - [x] 🟩 Init Vercel project (`plant-tracker-api/`)
  - [x] 🟩 Create `api/plants/search.js` — accepts `?q=`, forwards to Perenual `/v2/species-list`, returns results
  - [ ] 🟥 Add `PERENUAL_API_KEY` env var in Vercel dashboard *(manual — requires your Perenual key)*
  - [ ] 🟥 Verify with `vercel dev` *(manual — requires Vercel CLI + API key)*

- [x] 🟩 **Step 2: API service layer in React Native app**
  - [x] 🟩 Create `src/services/plantApi.js` with `searchPlants(query)` calling the Vercel proxy
  - [x] 🟩 Normalize Perenual response into a clean shape (species id, name, watering, sunlight, etc.)

- [x] 🟩 **Step 3: Expand plant data model**
  - [x] 🟩 Update `addPlant()` in `PlantContext.js` to accept optional species data alongside nickname
  - [x] 🟩 Store all care fields on the plant object when provided

- [x] 🟩 **Step 4: Update AddPlantScreen**
  - [x] 🟩 Add species search input and trigger
  - [x] 🟩 Display search results in a scrollable list
  - [x] 🟩 Allow selecting a result or tapping "Skip"
  - [x] 🟩 Show nickname input after selection/skip
  - [x] 🟩 Pass species data to `addPlant()` on save

- [x] 🟩 **Step 5: Loading and error states**
  - [x] 🟩 Loading indicator during API search
  - [x] 🟩 Error message on search failure
  - [x] 🟩 Empty results handling ("No plants found")
