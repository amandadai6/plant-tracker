# Pokemon Ruby/Sapphire-Style Grid View for Plant Tracker

## Context
The plant tracker currently displays plants in a standard list of white cards. The goal is to replace the HomeScreen list view with a pixel art grid inspired by the Berry patch system from Pokemon Ruby/Sapphire/Emerald (GBA era). Each plant appears as a soil patch with a plant sprite on a grassy overworld background. Tapping a plant opens a clean modal with all editable details.

## Files to Modify
- `src/screens/HomeScreen.js` — major rewrite from FlatList to ScrollView grid with grass background
- `babel.config.js` — add `react-native-reanimated/plugin`

## Files to Create
- `src/components/PlantGridCell.js` — grid cell: soil + plant sprite + name label + sway animation
- `src/components/PlantDetailModal.js` — clean modal with name edit, water/pest dates, delete
- `assets/sprites/grass-tile.png` — 32x32 repeating grass tile (GBA green palette)
- `assets/sprites/soil-patch.png` — 64x64 pixel art soil mound
- `assets/sprites/plant-generic.png` — 64x64 generic pixel art plant (transparent bg)

## Files Unchanged
- `CalendarPickerModal.js`, `ConfirmModal.js`, `EditNameModal.js` — reused as-is inside PlantDetailModal
- `PlantContext.js` — no changes needed
- `AddPlantScreen.js`, `App.js` — unchanged for this iteration

## Files to Remove
- `src/components/PlantCard.js` — retired after logic is moved to PlantGridCell + PlantDetailModal

## Implementation Steps

### Step 1: Install react-native-reanimated
- Run `npx expo install react-native-reanimated`
- Add `'react-native-reanimated/plugin'` as the **last** plugin in `babel.config.js`

### Step 2: Create pixel art assets
Create three PNG sprites in `assets/sprites/`:
- **grass-tile.png** (32x32): Repeating grass tile using GBA greens (`#58A858`, `#388838`, `#78C878`)
- **soil-patch.png** (64x64): Brown dirt mound (`#8B6914`, `#6B4C12`, `#A07828`), hard pixel edges, no anti-aliasing
- **plant-generic.png** (64x64): Green stem with 2-3 leaves on transparent background, GBA greens (`#48B048`, `#208020`, `#78D878`)

These will be created as original pixel art inspired by the GBA style.

### Step 3: Create PlantGridCell component
New file: `src/components/PlantGridCell.js`
- Renders a `Pressable` containing layered soil patch image + plant sprite image + nickname text
- Plant sprite wrapped in Reanimated `Animated.View` with a gentle idle sway (rotation +/- 3 degrees)
- Animation staggered with random delay per cell for organic feel
- Props: `plant`, `onPress`, `cellSize`
- Nickname truncated to 1 line with ellipsis

### Step 4: Create PlantDetailModal component
New file: `src/components/PlantDetailModal.js`
- Modal with **clean/modern style** (not pixel art) — white card, rounded corners, existing green palette
- Contains all handler logic currently in `PlantCard.js` (lines 29-58)
- Layout: plant name (tappable to edit) > last watered date (tappable) > last pest treatment date (tappable) > delete button
- Renders CalendarPickerModal, ConfirmModal, EditNameModal as sub-modals (same pattern as current PlantCard)
- Calls `usePlants()` for `deletePlant`, `updatePlantCare`, `updatePlantName`
- On delete: closes itself via `onClose()`, then calls `deletePlant()`

### Step 5: Rewrite HomeScreen
Replace the current FlatList implementation:
- **Background**: `ImageBackground` with `grass-tile.png` and `resizeMode="repeat"`
- **Grid**: `ScrollView` > `View` with `flexDirection: 'row'` + `flexWrap: 'wrap'`
- **Cell sizing**: Dynamic calculation — `const numColumns = Math.min(5, Math.floor((availableWidth + gap) / (minCellWidth + gap)))` where `minCellWidth = 72`
- **State**: `selectedPlant` — set on grid cell tap, cleared on modal close
- **Detail modal**: Single `PlantDetailModal` instance, receives live plant from context (`plants.find(p => p.id === selectedPlant.id)`)
- **Auto-close**: `useEffect` detects if selected plant was deleted and clears selection
- **Empty state**: Keep existing "No plants yet!" UI, displayed over grass background
- **FAB**: Unchanged

### Step 6: Remove PlantCard.js
Delete `src/components/PlantCard.js` after confirming all flows work correctly.

## Verification
1. Run `npx expo start` and open the app
2. Verify grass background tiles seamlessly across the screen
3. Add 6+ plants and verify 5-per-row grid with left-aligned second row
4. Verify plant sprites sway gently with staggered timing
5. Tap a plant — detail modal should open with name, dates, delete
6. Edit name from modal — verify it updates on the grid cell
7. Set/clear water and pest dates — verify they persist
8. Delete a plant from modal — verify modal closes and grid updates
9. Verify scrolling works when plants exceed screen height
10. Test on different screen widths to verify column count adapts
