import GiImperialCrown from 'svelte-icons/gi/GiImperialCrown.svelte';
import GiRuneStone from 'svelte-icons/gi/GiRuneStone.svelte';
import GiMantrap from 'svelte-icons/gi/GiMantrap.svelte';
import GiGuards from 'svelte-icons/gi/GiGuards.svelte';
import GiGuardedTower from 'svelte-icons/gi/GiGuardedTower.svelte';
import GiClosedDoors from 'svelte-icons/gi/GiClosedDoors.svelte';
import GiWoodenDoor from 'svelte-icons/gi/GiWoodenDoor.svelte';
import GiDefensiveWall from 'svelte-icons/gi/GiDefensiveWall.svelte';
import GiStoneWall from 'svelte-icons/gi/GiStoneWall.svelte';
import GiWoodStick from 'svelte-icons/gi/GiWoodStick.svelte'
import GiRock from 'svelte-icons/gi/GiRock.svelte';
import FaDrumstickBite from 'svelte-icons/fa/FaDrumstickBite.svelte';
import FaGem from 'svelte-icons/fa/FaGem.svelte';
import GiRing from 'svelte-icons/gi/GiRing.svelte';
import GiCrownCoin from 'svelte-icons/gi/GiCrownCoin.svelte';

export const actions = [
    {
        name: 'Collect Stick',
        type: 'take-action',
        actions: [
            {
                name: 'Take 2 Sticks',
                rewards: [
                    { key: 'stick', quantity: 2 }
                ],
                space: 1,
            },
            {
                name: 'Take 1 Stick',
                rewards: [
                    { key: 'stick', quantity: 1 }
                ],
                space: -1,
            }
        ]
    },
    {
        name: 'Collect Stone',
        type: 'take-action',
        actions: [
            {
                name: 'Take 2 Stones',
                rewards: [
                    { key: 'stone', quantity: 2 }
                ],
                space: 1,
            },
            {
                name: 'Take 1 Stone',
                rewards: [
                    { key: 'stone', quantity: 1 }
                ],
                space: -1,
            }
        ]
    },
    {
        name: 'Steal Food',
        type: 'take-action',
        actions: [
            {
                name: 'Take 2 Food',
                rewards: [
                    { key: 'food', quantity: 2 }
                ],
                space: 1,
            },
            {
                name: 'Take 1 Food',
                rewards: [
                    { key: 'food', quantity: 1 }
                ],
                space: -1,
            }
        ]
    },
    {
        name: 'Steal Gem',
        type: 'take-action',
        actions: [
            {
                name: 'Take 2 Gems',
                rewards: [
                    { key: 'gem', quantity: 2 }
                ],
                space: 1,
            },
            {
                name: 'Take 1 Gem',
                rewards: [
                    { key: 'gem', quantity: 1 }
                ],
                space: -1,
            }
        ]
    },
    {
        name: 'Steal Coin',
        type: 'take-action',
        actions: [
            {
                name: 'Take 2 Coins',
                rewards: [
                    { key: 'coin', quantity: 2 }
                ],
                space: 1,
            },
            {
                name: 'Take 1 Coin',
                rewards: [
                    { key: 'coin', quantity: 1 }
                ],
                space: -1,
            }
        ]
    },
    {
        name: 'Crown Action',
        hint: 'You can take any one of these actions any time during your turn.',
        type: 'crown-action'
    },
    {
        name: 'Upgrade Nest',
        type: 'upgrade-nest-action',
        actions: [
            {
                name: 'Upgrade your Nest',
                conditions: [
                    { key: 'stick', quantity: 3, additionPerLevel: 1 },
                    { key: 'stone', quantity: 3, additionPerLevel: 2 }
                ],
                space: 0,
            },
        ]
    },
    {
        name: 'Upgrade Storage',
        type: 'upgrade-storage-action',
        actions: [
            {
                name: 'Upgrade your Storage',
                conditions: [
                    { key: 'stick', quantity: 3, additionPerLevel: 1 },
                    { key: 'stone', quantity: 0, additionPerLevel: 3 }
                ],
                space: 0,
            },
        ]
    },
    {
        name: 'Reproduce (once per round)',
        hint: 'Once per round, send 2 Crows here to reproduce a new Crow, to be used in the next round.',
        type: 'action',
        rows: 2,
    },
    // {
    //     name: 'Trade with Black Market',
    //     type: 'action'
    // },
    // {
    //     name: 'Hire Animal',
    //     hint: 'Lasts 1 round.',
    //     type: 'action'
    // },
    {
        name: 'Hire Human',
        hint: 'Lasts 1 round.',
        type: 'action'
    },
    {
        name: 'Draw Crow Action',
        type: 'action'
    },
    {
        name: 'Take Crow Action',
        type: 'action'
    },
];

export const crownActions = {
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
        vp: 18,
        icon: GiMantrap,
    },
    'crown-guard': {
        name: "Crown Guard", // Bribe or kill
        vp: 10,
        icon: GiGuards,
    },
    'guard': {
        name: "Guard", // With mercenary
        vp: 3,
        icon: GiGuardedTower,
    },
    'room': {
        name: "Unlock Treasure Room", // With treasure key
        vp: 5,
        icon: GiClosedDoors,
    },
    'door': {
        name: "Unlock Door", // With normal key
        vp: 2,
        icon: GiWoodenDoor,
    },
    'wall-str': {
        name: "Break Strong Wall", // With mercenary
        vp: 5,
        icon: GiDefensiveWall,
    },
    'wall': {
        name: "Break Wall", // With mercenary
        vp: 2,
        icon: GiStoneWall,
    },
};

export const dungeonSize = 7;

export const dungeonLayers = [
    ['wall', 'door', 'guard'],
    ['wall-str', 'room', 'crown-guard'],
    ['rune', 'trap'],
    ['crown']
];

export const itemIconMap = {
    'stick': {
        name: 'Stick',
        hint: 'For building use',
        icon: GiWoodStick,
        iconColor: 'text-yellow-800',
    },
    'stone': {
        name: 'Stone',
        hint: 'For building use',
        icon: GiRock,
        iconColor: 'text-gray-600',
    },
    'food': {
        name: 'Food',
        hint: 'Probably trash; For consumption/trading use',
        icon: FaDrumstickBite,
        iconColor: 'text-yellow-600',
    },
    'gem': {
        name: `Someone's Gem`,
        hint: 'Stolen; For trading use',
        icon: FaGem,
        iconColor: 'text-green-400',
    },
    'ring': {
        name: `Someone's Ring`,
        hint: 'Stolen; For trading use',
        icon: GiRing,
        iconColor: 'text-yellow-500',
    },
    'coin': {
        name: 'Stolen Coin',
        hint: 'Stolen; For trading use',
        icon: GiCrownCoin,
        iconColor: 'text-yellow-500',
    },
};