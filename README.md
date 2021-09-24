# A Crown for Crows (SEA Game Jam 2021)

A worker placement game about managing crows to steal a crown, in the long run.

# Stacks

- Svelte
- TailwindCSS

# To run the game

Install the dependencies:

```yarn```

Then run:

```yarn dev```

# Making changes to the design

1. Fork this project.
2. If game design changes is all you want to make, you can navigate to: **/src/stores/gameData.js**.

## What each gameData means

| Variables | Definitions |
|---|---|
| **nestCapacityDefault** | Default capacity for crows before levelling up. |
| **nestCapacityPerLevel** | Additional capacity for crows per level after level 1. |;
| **storageCapacityDefault** | Default capacity for items before levelling up. |
| **storageCapacityPerLevel** | Additional capacity for items per level after level 1. |;
| **actions** | Define all the actions player can take. |
| **crownActions** | Define all the Crown actions player can take. |
| **dungeonSize** | Define the size of dungeon. (Note: Would advice against changing this one unless you know what you're doing.) |
| **dungeonLayers** | Define what each layer of the dungeon that player will encounter. |
| **itemIconMap** | For system to decide what icon to display for which item key. |
| **tradeItems** | For "Trade with Black Market" action to randomly select (can repeat) 3 items to sell, also come with its own icon reference. |
| **humanHires** | For "Hire Human" action to display what kind of human player can hire for their quest. |

# Environment Variables

There are a few .env variables in the game for testing purposes, namely:

| Variables | Definitions |
|---|---|
| VITE_BYPASS_CROWN_ACTION_CONDITIONS | Crown challenge's conditions won't be checked when taking the action. |
| VITE_BYPASS_TRADE_CONDITIONS | Trade Item's conditions won't be checked when buying an item |
| VITE_BYPASS_TRADE_REFRESH_CONDITIONS | Player's gem won't be checked when refreshing Trade Item. |
| VITE_BYPASS_HUMAN_HIRE_CONDITIONS | Human Hire's conditions won't be checked when hiring a human. |
| VITE_SHOW_ALL_CROWN_ACTION | All Crown challenges will be revealed. |