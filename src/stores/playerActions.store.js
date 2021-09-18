import { readable } from "svelte/store";

export const actions = readable([
    {
        name: 'Steal Food',
        type: 'action'
    },
    {
        name: 'Steal Gem',
        type: 'action'
    },
    {
        name: 'Steal Ring',
        type: 'action'
    },
    {
        name: 'Collect Stick',
        type: 'action'
    },
    {
        name: 'Collect Stone',
        type: 'action'
    },
    {
        name: 'Crown',
        type: 'crown-action'
    },
    {
        name: 'Build (Nest/Storage)',
        type: 'action'
    },
    {
        name: 'Upgrade Building',
        type: 'action'
    },
    {
        name: 'Reproduce',
        type: 'action'
    },
    {
        name: 'Buy Crow Action',
        type: 'action'
    },
    {
        name: 'Take Crow Action',
        type: 'action'
    },
    {
        name: 'Trade Item', // With Black Market or Player
        type: 'action'
    },
    {
        name: 'Hire (Last 2 Rounds)',
        type: 'action'
    },
]);

export const crownActions = readable([
    {
        name: "Steal Crown",
    },
    {
        name: "Destroy Rune",
    },
    {
        name: "Disable Trap", // With thief or magician
    },
    {
        name: "Crown Guard", // Bribe or kill
    },
    {
        name: "Guard", // With mercenary
    },
    {
        name: "Unlock Treasure Room", // With key
    },
    {
        name: "Break Wall", // With mercenary
    },
    {
        name: "Unlock Door", // With mercenary
    },
]);