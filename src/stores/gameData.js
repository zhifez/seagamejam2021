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
import GiNinjaMask from 'svelte-icons/gi/GiNinjaMask.svelte';
import GiCarnivalMask from 'svelte-icons/gi/GiCarnivalMask.svelte';
import GiSkullMask from 'svelte-icons/gi/GiSkullMask.svelte';
import GiDualityMask from 'svelte-icons/gi/GiDualityMask.svelte';
import GiUnlitBomb from 'svelte-icons/gi/GiUnlitBomb.svelte';
import GiMeat from 'svelte-icons/gi/GiMeat.svelte';
import GiHotMeal from 'svelte-icons/gi/GiHotMeal.svelte';
import GiNewBorn from 'svelte-icons/gi/GiNewBorn.svelte';
import GiSkeletonKey from 'svelte-icons/gi/GiSkeletonKey.svelte';
import GiBossKey from 'svelte-icons/gi/GiBossKey.svelte';
import GiPiercingSword from 'svelte-icons/gi/GiPiercingSword.svelte';
import GiPointySword from 'svelte-icons/gi/GiPointySword.svelte';
import Gi3DHammer from 'svelte-icons/gi/Gi3DHammer.svelte';
import GiStoneTablet from 'svelte-icons/gi/GiStoneTablet.svelte';
import GiStoneSphere from 'svelte-icons/gi/GiStoneSphere.svelte';
import GiLockedChest from 'svelte-icons/gi/GiLockedChest.svelte';
import GoHome from 'svelte-icons/go/GoHome.svelte';

const nestCapacityDefault = 2;
const nestCapacityPerLevel = 2;
const storageCapacityDefault = 5;
const storageCapacityPerLevel = 3;

export const getNestCapacity = (level) => {
    return nestCapacityDefault + nestCapacityPerLevel * (level - 1);
}

export const getStorageCapacity = (level) => {
    return storageCapacityDefault + storageCapacityPerLevel * (level - 1);
}

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
    // {
    //     name: 'Steal Coin',
    //     type: 'take-action',
    //     actions: [
    //         {
    //             name: 'Take 2 Coins',
    //             rewards: [
    //                 { key: 'coin', quantity: 2 }
    //             ],
    //             space: 1,
    //         },
    //         {
    //             name: 'Take 1 Coin',
    //             rewards: [
    //                 { key: 'coin', quantity: 1 }
    //             ],
    //             space: -1,
    //         }
    //     ]
    // },
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
        name: 'Crown Challenges',
        hint: 'You can take any of these challenges any time during your turn.',
        note: `The next layer of Crown challenges will be unlocked after two third of the current layer's challenges are solved.`,
        type: 'crown-action'
    },
    {
        name: 'Reproduce',
        hint: 'Once per round, send 2 Crows here to reproduce a new Crow, to be used in the next round.',
        note: 'You can only take this action once per round.',
        type: 'reproduce-action',
        rows: 2,
        actions: [
            {
                name: 'Try for baby',
                hint: 'Success rate: 100%',
                conditions: [
                    { key: 'crow', quantity: 2 },
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
        name: 'Trade with Black Market',
        hint: 'Will refresh when all items are sold.',
        type: 'trade-action',
        rows: 2,
    },
    // {
    //     name: 'Hire Animal',
    //     hint: 'Lasts 1 round.',
    //     type: 'action'
    // },
    {
        name: 'Hire Human',
        hint: 'Lasts 1 round.',
        type: 'human-action',
        rows: 2
    },
    // {
    //     name: 'Draw Crow Action',
    //     type: 'action'
    // },
    // {
    //     name: 'Take Crow Action',
    //     type: 'action'
    // },
];

export const crownActions = {
    'crown': {
        name: 'The Crown',
        hint: `The crows' final path to salvation.`,
        icon: GiImperialCrown,
        conditions: [
            {
                name: 'Steal it with 6 Crows',
                conds: [
                    { key: 'crow', quantity: 6 },
                ],
            },
        ],
        rewards: [
            { key: 'vp', quantity: 50 },
        ],
        isEndGame: true,
    },
    'rune': {
        name: 'Protective Rune',
        hint: 'Somehow it prevents any living thing from getting close.',
        icon: GiRuneStone,
        conditions: [
            {
                name: 'Disable it with a Magician',
                conds: [
                    { key: 'magician', quantity: 1 },
                    { key: 'magic-tablet', quantity: 1 },
                    { key: 'magic-sphere', quantity: 1 },
                ],
            },
        ],
        rewards: [
            { key: 'vp', quantity: 20 },
        ],
    },
    'trap': {
        name: 'Trap', // With thief or magician
        hint: 'Kills anyone who steps on it.',
        icon: GiMantrap,
        conditions: [
            {
                name: 'Experienced Trap Disabler',
                conds: [
                    { key: 'mercenary', quantity: 1 },
                ],
            },
            {
                name: 'Inexperienced Trap Disabler',
                conds: [
                    { key: 'thief', quantity: 1 },
                    { key: 'stone', quantity: 5 },
                ],
            }
        ],
        rewards: [
            { key: 'vp', quantity: 18 },
        ],
    },
    'guard-crown': {
        name: 'Crown Guards', // Bribe or kill
        hint: 'Guard the Crown.',
        icon: GiGuards,
        conditions: [
            {
                name: 'Assassinate Them',
                conds: [
                    { key: 'mercenary', quantity: 1 },
                    { key: 'sword-heavy', quantity: 1 },
                ],
            },
            {
                name: 'Bribe Them',
                conds: [
                    { key: 'spy', quantity: 1 },
                    { key: 'gem', quantity: 5 },
                ],
            }
        ],
        rewards: [
            { key: 'vp', quantity: 10 },
        ],
    },
    'guard': {
        name: 'Guard', // With mercenary
        hint: 'Guards the Crown Guards that guard the Crown.',
        icon: GiGuardedTower,
        conditions: [
            {
                name: 'Assassinate Them',
                conds: [
                    { key: 'mercenary', orKeys: ['thief'], quantity: 1 },
                    { key: 'sword-normal', orKeys: ['sword-heavy'], quantity: 1 },
                ],
            },
            {
                name: 'Bribe Them',
                conds: [
                    { key: 'spy', quantity: 1 },
                    { key: 'gem', quantity: 2 },
                ],
            }
        ],
        rewards: [
            { key: 'vp', quantity: 3 },
        ],
    },
    'room': {
        name: 'Treasure Room', // With treasure key
        hint: `There's treasure in them.`,
        icon: GiClosedDoors,
        conditions: [
            {
                name: 'Unlock It',
                conds: [
                    { key: 'thief', quantity: 1 },
                    { key: 'key-treasure', quantity: 1 },
                ],
            },
        ],
        rewards: [
            { key: 'gem', quantity: 10 },
            { key: 'vp', quantity: 5 },
        ],
    },
    'door': {
        name: 'Locked Door', // With normal key
        hint: `It's locked.`,
        icon: GiWoodenDoor,
        conditions: [
            {
                name: 'Unlock It',
                conds: [
                    { key: 'thief', quantity: 1 },
                    { key: 'key-skeleton', quantity: 1 },
                ],
            },
        ],
        rewards: [
            { key: 'vp', quantity: 2 },
        ],
    },
    'wall-str': {
        name: 'Break Strong Wall', // With mercenary
        icon: GiDefensiveWall,
        conditions: [
            {
                name: 'Destroy It',
                conds: [
                    { key: 'thief', orKeys: ['mercenary', 'spy'], quantity: 1 },
                    { key: 'bomb', quantity: 5 },
                ],
            },
            {
                name: `Wreck It`,
                conds: [
                    { key: 'mercenary', quantity: 1 },
                    { key: 'hammer-sledge', quantity: 1 },
                ],
            }
        ],
        rewards: [
            { key: 'vp', quantity: 5 },
        ],
    },
    'wall': {
        name: 'Break Wall', // With mercenary
        icon: GiStoneWall,
        conditions: [
            {
                name: 'Destroy It',
                conds: [
                    { key: 'thief', orKeys: ['mercenary', 'spy'], quantity: 1 },
                    { key: 'bomb', quantity: 2 },
                ],
            },
            {
                name: `Wreck It`,
                conds: [
                    { key: 'mercenary', quantity: 1 },
                    { key: 'hammer-sledge', quantity: 1 },
                ],
            }
        ],
        rewards: [
            { key: 'vp', quantity: 2 },
        ],
    },
};

export const dungeonSize = 7;
export const currentCrownChallengeCount = (layer) => {
    let actualSize = dungeonSize - (layer * 2);
    return (actualSize - layer + actualSize - layer - 1) * 2;
}
export const dungeonLayerIsComplete = (layer, completedCount) => {
    const totalChallenges = currentCrownChallengeCount(layer);
    if (import.meta.env.VITE_BYPASS_CROWN_ACTION_CONDITIONS === 'true') {
        return (completedCount / totalChallenges >= 1/10); // testing
    }
    return (completedCount / totalChallenges >= 2/3);
};

export const dungeonLayers = [
    ['wall', 'door', 'guard'],
    ['wall-str', 'room', 'guard-crown'],
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
    'food-double': {
        name: 'Food',
        hint: 'Not trash; For consumption/trading use',
        icon: GiMeat,
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
    'bomb': {
        name: 'Bomb',
        hint: 'For destruction use.',
        icon: GiUnlitBomb,
        iconColor: 'text-black',
    },
    'nest': {
        name: 'Nest Upgrade',
        icon: GoHome,
        iconColor: 'text-black',
    },
    'storage': {
        name: 'Storage Upgrade',
        icon: GiLockedChest,
        iconColor: 'text-black',
    }
};

export const tradeItems = {
    'ticket-food': {
        name: 'Food Ticket',
        icon: FaDrumstickBite,
        hint: 'Receive 1 food.',
        type: 'food',
        conditions: [
            { key: 'gem', quantity: 2 },
        ],
        rewards: [
            { key: 'food', quantity: 1 },
        ],
        space: 1,
        rarity: 1,
    },
    'ticket-food-2': {
        name: 'Double Food Ticket',
        icon: GiMeat,
        hint: 'Receive 2 food.',
        type: 'food',
        conditions: [
            { key: 'stick', quantity: 2 },
            { key: 'gem', quantity: 3 },
        ],
        rewards: [
            { key: 'food', quantity: 2 },
        ],
        space: 1,
        rarity: 4,
    },
    'ticket-food-3': {
        name: 'Triple Food Ticket',
        icon: GiHotMeal,
        hint: 'Receive 3 food.',
        type: 'food',
        conditions: [
            { key: 'stick', quantity: 2 },
            { key: 'stone', quantity: 2 },
            { key: 'gem', quantity: 2 },
        ],
        rewards: [
            { key: 'food', quantity: 3 },
        ],
        space: 1,
        rarity: 7,
    },
    'upgrade-nest': {
        name: 'Upgrade Nest',
        icon: GoHome,
        hint: 'Instantly upgrade your nest.',
        type: 'nest',
        conditions: [
            { key: 'food', quantity: 2 },
            { key: 'gem', quantity: 6 },
        ],
        rewards: [
            { key: 'nest', quantity: 1 },
        ],
        space: 1,
        rarity: 7,
    },
    'upgrade-storage': {
        name: 'Upgrade Storage',
        icon: GiLockedChest,
        hint: 'Instantly upgrade your storage.',
        type: 'storage',
        conditions: [
            { key: 'food', quantity: 3 },
            { key: 'gem', quantity: 5 },
        ],
        rewards: [
            { key: 'storage', quantity: 1 },
        ],
        space: 1,
        rarity: 7,
    },
    'crow-adopt': {
        name: 'Adopt a Crow',
        icon: GiNewBorn,
        hint: 'Instantly get a crow, as long as you have the nest space.',
        type: 'crow',
        conditions: [
            { key: 'food', quantity: 2 },
            { key: 'gem', quantity: 4 },
        ],
        rewards: [
            { key: 'crow', quantity: 1 },
        ],
        space: 1,
        rarity: 8,
    },
    'key-skeleton': {
        name: 'Skeleton Key',
        icon: GiSkeletonKey,
        hint: 'Unlock certain door.',
        type: 'crown',
        conditions: [
            { key: 'food', quantity: 3 },
            { key: 'gem', quantity: 5 },
        ],
        rewards: [
            { key: 'key-skeleton', quantity: 1 },
        ],
        space: 1,
        rarity: 6,
    },
    'key-treasure': {
        name: 'Treasure Key',
        icon: GiBossKey,
        hint: 'Unlock a very important door.',
        type: 'crown',
        conditions: [
            { key: 'food', quantity: 3 },
            { key: 'gem', quantity: 8 },
        ],
        rewards: [
            { key: 'key-treasure', quantity: 1 },
        ],
        space: 1,
        rarity: 10,
    },
    'sword-normal': {
        name: 'Sword',
        icon: GiPiercingSword,
        hint: 'Can kill a regular guard, when wielded by a human.',
        type: 'weapon',
        conditions: [
            { key: 'food', quantity: 4 },
            { key: 'gem', quantity: 5 },
        ],
        rewards: [
            { key: 'sword-normal', quantity: 1 },
        ],
        space: 1,
        rarity: 5,
    },
    'sword-heavy': {
        name: 'Heavy Sword',
        icon: GiPointySword,
        hint: 'Can kill a tougher guard, when wielded by a human.',
        type: 'weapon',
        conditions: [
            { key: 'gem', quantity: 14 },
        ],
        rewards: [
            { key: 'sword-heavy', quantity: 1 },
        ],
        space: 1,
        rarity: 8,
    },
    'hammer-sledge': {
        name: 'Sledge Hammer',
        icon: Gi3DHammer,
        hint: 'For crushing and breaking hard object, as well as killing living things.',
        type: 'weapon',
        conditions: [
            { key: 'stone', quantity: 1 },
            { key: 'food', quantity: 2 },
            { key: 'gem', quantity: 5 },
        ],
        rewards: [
            { key: 'hammer-sledge', quantity: 1 },
        ],
        space: 1,
        rarity: 6,
    },
    'magic-tablet': {
        name: 'Magic Tablet',
        icon: GiStoneTablet,
        hint: 'For casting magic use.',
        type: 'weapon',
        conditions: [
            { key: 'stone', quantity: 2 },
            { key: 'food', quantity: 3 },
            { key: 'gem', quantity: 7 },
        ],
        rewards: [
            { key: 'magic-tablet', quantity: 1 },
        ],
        space: 1,
        rarity: 10,
    },
    'magic-sphere': {
        name: 'Magic Sphere',
        icon: GiStoneSphere,
        hint: 'For casting magic use.',
        type: 'weapon',
        conditions: [
            { key: 'stone', quantity: 2 },
            { key: 'food', quantity: 2 },
            { key: 'gem', quantity: 5 },
        ],
        rewards: [
            { key: 'magic-sphere', quantity: 1 },
        ],
        space: 1,
        rarity: 10,
    },
    'bomb': {
        name: 'Bomb',
        icon: GiUnlitBomb,
        hint: 'For destruction use.',
        type: 'weapon',
        conditions: [
            { key: 'stone', quantity: 1 },
            { key: 'food', quantity: 2 },
            { key: 'gem', quantity: 3 },
        ],
        rewards: [
            { key: 'bomb', quantity: 1 },
        ],
        space: 1,
        rarity: 5,
    },
};

export const getRandomTradableItems = (quantity) => {
    let tradableItems = [];

    while (tradableItems.length < quantity) {
        const keys = Object.keys(tradeItems);
        let rand = Math.random();
        let randKey = keys[Math.floor(rand * keys.length)];
        let item = tradeItems[randKey];

        let rarityCondition = 0;
        for (let r=0; r<12; ++r) {
            rand = Math.random();
            if (rand <= 0.4) {
                ++rarityCondition;
            }
        }

        if (rarityCondition >= item.rarity) {
            tradableItems.push({
                ...item,
                key: randKey,
                sold: false,
            });
        }
    }
    return tradableItems;
}

export const humanHires = {
    'thief': {
        name: 'Thief',
        icon: GiNinjaMask,
        hint: 'Can open doors, unlock traps, bomb stuff.',
        type: 'thief',
        conditions: [
            { key: 'food', quantity: 4 },
            { key: 'gem', quantity: 3 },
        ],
        rewards: [
            { key: 'thief', quantity: 1 },
        ],
        lifespan: 2,
        space: 0,
    },
    'magician': {
        name: 'Magician',
        icon: GiCarnivalMask,
        hint: 'Can cast useful magic.',
        type: 'magician',
        conditions: [
            { key: 'food', quantity: 3 },
            { key: 'gem', quantity: 7 },
        ],
        rewards: [
            { key: 'magician', quantity: 1 },
        ],
        lifespan: 1,
        space: 0,
    },
    'mercenary': {
        name: 'Mercenary',
        icon: GiSkullMask,
        hint: 'Does all the killings, and nothing else.',
        type: 'mercenary',
        conditions: [
            { key: 'food', quantity: 5 },
            { key: 'gem', quantity: 5 },
        ],
        rewards: [
            { key: 'mercenary', quantity: 1 },
        ],
        lifespan: 1,
        space: 0,
    },
    'spy': {
        name: 'Spy',
        icon: GiDualityMask,
        hint: 'Bribe people, get things moving, with the right amount of gems.',
        type: 'spy',
        conditions: [
            { key: 'food', quantity: 2 },
            { key: 'gem', quantity: 8 },
        ],
        rewards: [
            { key: 'spy', quantity: 1 },
        ],
        lifespan: 1,
        space: 0,
    }
};

export const instructions = [
    'Click on an action slot to take the action.',
    'You are only allowed to take one action per turn, with the exception of the <b>Crown Challenge</b>.',
    'You can take as many <b>Crown Challenges</b> as you want as long as you have the right resources.',
    'Every 3 rounds, the game will enter a <b>Feeding Phase</b>, where each crow will have to be fed exactly 1 food.',
    '<b>1 VP</b> will be deducted per unfed crow.',
    'The game ends when a player has retrieve the <b>Crown</b> (center of "Crown Challenges").',
];