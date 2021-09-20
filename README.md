# A Crown for Crows (SEA Game Jam 2021)

A worker placement game about managing crows to steal a crown, in the long run.

# Stacks

Svelte
TailwindCSS

# To run the game

1. First install the dependencies:

```yarn```

2. Then run:

```yarn dev```

# Making changes to the design

1. Fork this project.
2. If game design changes is all you want to make, you can navigate to /src/stores/gameData.js.

## What each design data means

1. **actions** - Define all the actions player can take.
2. **crownActions** - Define all the Crown actions player can take.
3. **dungeonSize** - Define the size of dungeon. (Note: Would advice against changing this one unless you know what you're doing.)
4. **dungeonLayers** - Defind what each layer of the dungeon that player will encounter.
5. **itemIconMap** - For system to decide what icon to display for which item key.
6. **tradeItems** - For "Trade with Black Market" action to randomly select (can repeat) 3 items to sell, also come with its own icon reference.
7. **humanHires** - For "Hire Human" action to display what kind of human player can hire for their quest.