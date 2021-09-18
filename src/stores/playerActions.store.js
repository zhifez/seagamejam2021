import { readable } from 'svelte/store';
import GiImperialCrown from 'svelte-icons/gi/GiImperialCrown.svelte';
import GiRuneStone from 'svelte-icons/gi/GiRuneStone.svelte';
import GiMantrap from 'svelte-icons/gi/GiMantrap.svelte';
import GiGuards from 'svelte-icons/gi/GiGuards.svelte';
import GiGuardedTower from 'svelte-icons/gi/GiGuardedTower.svelte';
import GiClosedDoors from 'svelte-icons/gi/GiClosedDoors.svelte';
import GiWoodenDoor from 'svelte-icons/gi/GiWoodenDoor.svelte';
import GiDefensiveWall from 'svelte-icons/gi/GiDefensiveWall.svelte';
import GiStoneWall from 'svelte-icons/gi/GiStoneWall.svelte';

export const actions = readable([
    {
        name: 'Collect Stick',
        type: 'action'
    },
    {
        name: 'Steal Food',
        type: 'action',
        actions: [
            {
                name: 'Take 2 food',
                rewards: ['food', 'food'],
                space: 1,
            },
            {
                name: 'Take 1 food',
                rewards: ['food'],
                space: -1,
            }
        ]
    },
    {
        name: 'Steal Gem',
        type: 'action',
        actions: [
            {
                name: 'Take 2 gems',
                rewards: ['gem', 'gem'],
                space: 1,
            },
            {
                name: 'Take 1 gem',
                rewards: ['gem'],
                space: -1,
            }
        ]
    },
    {
        name: 'Steal Ring',
        type: 'action'
    },
    {
        name: 'Collect Stone',
        type: 'action'
    },
    {
        name: 'Crown',
        hint: 'You can take this action any time.',
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
        name: 'Hire',
        hint: 'Lasts 3 rounds.',
        type: 'action'
    },
]);

export const crownActions = readable({
    'crown': {
        name: "Steal the Crown",
        vp: 50,
        icon: GiImperialCrown,
    },
    'rune': {
        name: "Destroy Rune",
        vp: 20,
        icon: GiRuneStone,
    },
    'trap': {
        name: "Disable Trap", // With thief or magician
        vp: 20,
        icon: GiMantrap,
    },
    'crown-guard': {
        name: "Crown Guard", // Bribe or kill
        vp: 10,
        icon: GiGuards,
    },
    'guard': {
        name: "Guard", // With mercenary
        vp: 2,
        icon: GiGuardedTower,
    },
    'room': {
        name: "Unlock Treasure Room", // With treasure key
        vp: 5,
        icon: GiClosedDoors,
    },
    'door': {
        name: "Unlock Door", // With normal key
        vp: 3,
        icon: GiWoodenDoor,
    },
    'wall-str': {
        name: "Break Strong Wall", // With mercenary
        vp: 5,
        icon: GiDefensiveWall,
    },
    'wall': {
        name: "Break  Wall", // With mercenary
        vp: 3,
        icon: GiStoneWall,
    },
});

export const dungeonSize = 7;

export const dungeonLayers = readable([
    ['wall', 'door', 'guard'],
    ['wall-str', 'room', 'crown-guard'],
    ['rune', 'trap'],
    ['crown']
]);