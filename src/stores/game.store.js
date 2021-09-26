import { warning } from "../common/toastTheme";
import { get, writable } from "svelte/store";
import { actions, dungeonLayerIsComplete, getNestCapacity, getRandomTradableItems, getStorageCapacity, humanHires, buildingMaxLevel } from "./gameData";

const ERROR_NOT_ENOUGH_RESOURCES_ACTION = 'You do not have sufficient resources to take this action.';
const ERROR_NOT_ENOUGH_RESOURCES_ITEM = 'You do not have sufficient resources to trade this item.';
const ERROR_NOT_ENOUGH_RESOURCES_HUMAN = 'You do not have sufficient resources to hire this human.';
const ERROR_NOT_ENOUGH_CROW = 'You do not have enough unutilized crow for this action.';

const colors = [
    'red-500',
    'blue-500',
    'green-500',
    'purple-500',
];

const createPlayer = (name, color, crows) => {
    return {
        name,
        color,
        crows,
        utilizedCrows: 0, 
        nestLevel: 1, 
        storageLevel: 1,
        storedItems: [],// [ 'stick', 'stone', 'food', 'gem', 'ring', 'coin', ],
        vp: 0,
        hasTakenAction: false,
        isReproducing: false,
        humanHires: [],
        crownChallenges: 0,
    };
}

const initGameState = {
    players: [
        createPlayer('Player 1', colors[0], 2),
    ],
    round: 0, turn: 0, 
    canEndRound: false,
    isFeedingPhase: false,
    endRoundResults: null,
    roundActions: {},
    crownActionLayer: 0,
    completedCrownActions: {},
    isEndGame: false,
    endGameResults: {
        'Player 1': {
            total: 100,
            winner: false
        }
    },
    tradableItems: [],
};

export const game = writable({...initGameState});

export const tradableItemsMax = 4;
export const roundsPerFeedingPhase = 3;

export const formatInstruction = (instruction) => {
    return instruction
    .replaceAll('{roundsPerFeedingPhase}', roundsPerFeedingPhase);
}

export const initGame = (playerCount) => {
    let gameState = {...initGameState};
    gameState.players = [];
    for (let a=0; a<playerCount; ++a) {
        gameState.players.push(
            createPlayer(
                `Player ${a + 1}`, 
                colors[a], 
                2
            )
        );
    }
    gameState.tradableItems = getRandomTradableItems(tradableItemsMax);
    game.set(gameState);
}

export const refreshTradableItems = () => {
    game.update(state => {
        let nextState = {...state};
        nextState.tradableItems = getRandomTradableItems(tradableItemsMax);
        return nextState;
    });
}

export const system = writable({
    hasStarted: false,
    showInstructions: false,
    showExchangeItems: false,
    exchangeItemsInfo: {
        min: 3,
    },
    showEndRound: false,
    showActiveHumanHire: false,
    activeHumanHire: null,
    showActiveCrownAction: false,
    activeCrownAction: null,
    showActiveTradeItem: false,
    activeTradeItem: null,
    canEndGame: false,
});

export const setHasStarted = () => {
    system.update(state => {
        let nextState = {...state};
        nextState.hasStarted = true;
        return nextState;
    });
}

export const setShowInstructions = (show) => {
    system.update(state => {
        let nextState = {...state};
        nextState.showInstructions = show;
        return nextState;
    });
}

export const setExchangeItemsInfo = (show, info = null) => {
    system.update(state => {
        let nextState = {...state};
        nextState.showExchangeItems = show;
        if (info) {
            nextState.exchangeItemsInfo = info;
        }
        return nextState;
    });
}

export const setShowEndRound = (show) => {
    system.update(state => {
        let nextState = {...state};
        nextState.showEndRound = show;
        return nextState;
    });
}

export const setActiveHumanHire = (data) => {
    system.update(state => {
        let nextState = {...state};
        if (data) {
            nextState.showActiveHumanHire = true;
            nextState.activeHumanHire = data;
        }
        else {
            nextState.showActiveHumanHire = false;
        }
        return nextState;
    });
}

export const setActiveCrownAction = (data) => {
    system.update(state => {
        let nextState = {...state};
        if (data) {
            nextState.showActiveCrownAction = true;
            nextState.activeCrownAction = data;
        }
        else {
            nextState.showActiveCrownAction = false;
        }
        return nextState;
    });
}

export const setActiveTradeItem = (data) => {
    system.update(state => {
        let nextState = {...state};
        if (data) {
            nextState.showActiveTradeItem = true;
            nextState.activeTradeItem = data;
        }
        else {
            nextState.showActiveTradeItem = false;
        }
        return nextState;
    });
}

const playerHasItem = (player, condition, level = 0) => {
    let quantity = condition.quantity;
    if (level > 0) {
        if ('additionPerLevel' in condition) {
            quantity += condition.additionPerLevel * (level - 1);
        }
    }

    switch (condition.key) {
    case 'any-same':
        let systemState = get(system);
        let itemGroups = {};
        player.storedItems.forEach(item => {
            if (!(item in itemGroups)) {
                itemGroups[item] = 0;
            }
            ++itemGroups[item];
            if (itemGroups[item] >= systemState.exchangeItemsInfo.min) {
                quantity = 0;
            }
        });
        break;

    case 'crow':
        const crowsLeft = (player.crows - player.utilizedCrows);
        quantity -= crowsLeft;
        break;

    default:
        // Check from storage
        player.storedItems.forEach(item => {
            if (item === condition.key
                || (condition.orKeys && condition.orKeys.indexOf(item) >= 0) ) {
                --quantity;
            }
        });
        // Check from human hires
        player.humanHires.forEach(hire => {
            if (hire.type === condition.key
                || (condition.orKeys && condition.orKeys.indexOf(hire.type) >= 0)) {
                --quantity;
            }
        });
        break;
    }

    return quantity <= 0;
}

export const playerHasMetConditions = (player, conditions, level = 0) => {
    if (!conditions || conditions.length <= 0) {
        return true;
    }

    let condCount = conditions.length;
    for (let i=0; i<conditions.length; ++i) {
        let cond = conditions[i];
        if ('conds' in cond) {
            let subCondCount = cond.conds.length;
            for (let a=0; a<cond.conds.length; ++a) {
                if (!playerHasItem(player, cond.conds[a], level)) {
                    break;
                }

                --subCondCount;
            }
            if (subCondCount <= 0) {
                return true;
            }
        }
        else {
            if (playerHasItem(player, cond, level)) {
                --condCount;
            }
            else {
                return false;
            }
        }
    }
    return condCount <= 0;
}

export const hasEnoughItem = (itemKey, quantity) => {
    let gameState = get(game);
    let activePlayer = gameState.players[gameState.turn];
    // if (activePlayer.hasTakenAction) {
    //     return 'You have already taken an action!<br />Take a Crown Challenge or end your turn.';
    // }

    let totalInStorage = 0;
    for (let a=0; a<activePlayer.storedItems.length; ++a) {
        if (activePlayer.storedItems[a] === itemKey) {
            ++totalInStorage;
        }
    }
    if (totalInStorage < quantity) {
        return ERROR_NOT_ENOUGH_RESOURCES_ACTION;
    }
    return null;
}

export const useItem = (itemKey, quantity) => {
    game.update(state => {
        let nextState = {...state};
        let nextPlayers = [...state.players];

        for (let a=0; a<quantity; ++a) {
            let itemIndex = nextPlayers[nextState.turn].storedItems.indexOf(itemKey);
            if (itemIndex >= 0) {
                nextPlayers[nextState.turn].storedItems.splice(itemIndex, 1);
            }
        }

        nextState.players = nextPlayers;
        return nextState;
    });
}

export const canExchangeItemsForOne = () => {
    let gameState = get(game);
    let systemState = get(system);
    let activePlayer = gameState.players[gameState.turn];

    let counts = {};
    for (let a=0; a<activePlayer.storedItems.length; ++a) {
        let item = activePlayer.storedItems[a];
        if (!(item in counts)) {
            counts[item] = 0;
        }
        ++counts[item];
        if (counts[item] >= systemState.exchangeItemsInfo.min) {
            return null;
        }
    }
    
    return ERROR_NOT_ENOUGH_RESOURCES_ACTION;
}

export const exchangeItemsForOne = (fromItemKey, toItemKey) => {
    let systemState = get(system);
    let exchangeInfo = systemState.exchangeItemsInfo;

    game.update(state => {
        let nextState = {...state};
        let nextPlayers = [...state.players];

        for (let a=0; a<exchangeInfo.min; ++a) {
            let itemIndex = nextPlayers[nextState.turn].storedItems.indexOf(fromItemKey);
            if (itemIndex >= 0) {
                nextPlayers[nextState.turn].storedItems.splice(itemIndex, 1);
            }
        }
        nextPlayers[nextState.turn].storedItems.push(toItemKey);

        nextState.players = nextPlayers;
        return nextState;
    });
}

export const canTakeAction = (coreActionIndex, selectedActionIndex) => {
    let gameState = get(game);
    if (gameState.canEndRound) {
        return 'The round has ended.';
    }

    let activePlayer = gameState.players[gameState.turn];
    if (activePlayer.hasTakenAction) {
        return 'You have already taken an action!<br />Take a Crown Challenge or end your turn.';
    }
    
    let coreAction = actions[coreActionIndex];
    if (!coreAction.type.includes('trade') // Skip for trade
        && !coreAction.type.includes('human')) { // Skip for human
        if (coreActionIndex in gameState.roundActions) {
            if (selectedActionIndex in gameState.roundActions[coreActionIndex]) {
                return 'Action has already been taken.';
            }
        }
    }
    
    // Select active action
    let activeAction = null;
    if (coreAction.type.includes('trade')) {
        // Select Action directly from Tradable Items list
        activeAction = gameState.tradableItems[selectedActionIndex];
    }
    else if (coreAction.type.includes('human')) {
        // Select Action directly from Human Hire list
        let key = Object.keys(humanHires)[selectedActionIndex];
        activeAction = humanHires[key];
    }
    else {
        activeAction = coreAction.actions[Math.min(selectedActionIndex, coreAction.actions.length - 1)];
    }

    // Check conditions
    let level = 0;
    if (coreAction.type.includes('upgrade')) {
        if (coreAction.type.includes('nest')) {
            level = activePlayer.nestLevel;
        }
        else {
            level = activePlayer.storageLevel;
        }
        if (level >= buildingMaxLevel) {
            return 'You have reached the maximum level of upgrade for this building.'
        }
    }

    let conditionsAreMet = playerHasMetConditions(
        activePlayer, 
        activeAction ? activeAction.conditions : [],
        level
    );
    
    // Send error message
    if (coreAction.type.includes('take')) {
        if (activePlayer.storedItems.length >= getStorageCapacity(activePlayer.storageLevel)) {
            return 'Your Storage is full.';
        }
    }
    else if (coreAction.type.includes('upgrade')) {
        if (!conditionsAreMet) {
            return ERROR_NOT_ENOUGH_RESOURCES_ACTION;
        }
    }
    else if (coreAction.type.includes('reproduce')) {
        if (activePlayer.isReproducing) {
            return `You can only take this action once per round.`;
        }
        if (activePlayer.crows >= getNestCapacity(activePlayer.nestLevel)) {
            return `Your Nest cannot occupy anymore Crow.`;
        }
        if (activePlayer.crows - activePlayer.utilizedCrows < 2) {
            return ERROR_NOT_ENOUGH_CROW;
        }
    }
    else if (coreAction.type.includes('trade')) {
        if (import.meta.env.VITE_BYPASS_TRADE_CONDITIONS !== 'true') {
            if (!conditionsAreMet) {
                return ERROR_NOT_ENOUGH_RESOURCES_ITEM;
            }
        }
    }
    else if (coreAction.type.includes('human')) {
        if (import.meta.env.VITE_BYPASS_HUMAN_HIRE_CONDITIONS !== 'true') {
            if (!conditionsAreMet) {
                return ERROR_NOT_ENOUGH_RESOURCES_HUMAN;
            }
        }
    }
    else if (coreAction.type.includes('exchange')) {
        if (!conditionsAreMet) {
            return ERROR_NOT_ENOUGH_RESOURCES_ACTION;
        }
    }
    return null;
}

const fulfilActionConditions = (player, conditions, level = 0) => {
    const _fulfil = (cond) => {
        let quantity = cond.quantity;
        if (level > 0) {
            if ('additionPerLevel' in cond) {
                quantity += cond.additionPerLevel * (level - 1);
            }
        }
        if (quantity <= 0) {
            return;
        }

        if (cond.key === 'crow') {
            player.utilizedCrows += quantity;
            return;
        }
        
        for (let a=0; a<quantity; ++a) {
            let allKeys = [
                cond.key,
                ...(cond.orKeys ?? [])
            ];
            allKeys.forEach(key => {
                let index = player.storedItems.indexOf(key);
                if (index >= 0) {
                    player.storedItems.splice(index, 1);
                }
                else {
                    for (let h=0; h<player.humanHires.length; ++h) {
                        if (player.humanHires[h].type === key) {
                            ++player.humanHires[h].hiredLifespan;
                            break;
                        }
                    }
                }
            });
        }
    }

    if (conditions && conditions.length > 0) {
        for (let c=0; c<conditions.length; ++c) {
            let cond = conditions[c];
            if ('conds' in cond) {
                let subCondsMet = cond.conds.length;
                for (let a=0; a<cond.conds.length; ++a) {
                    if (!playerHasItem(player, cond.conds[a], level)) {
                        break;
                    }

                    --subCondsMet;
                }
                if (subCondsMet <= 0) {
                    for (let a=0; a<cond.conds.length; ++a) {
                        _fulfil(cond.conds[a]);
                    }
                    break;
                }
            }
            else {
                _fulfil(cond);
            }
        }
    }

    // Remove human hire once lifespan has ended
    let nextHumanHires = [];
    player.humanHires.forEach(hire => {
        if (hire.hiredLifespan < hire.lifespan) {
            nextHumanHires.push(hire);
        }
        else {
            warning(`${hire.name} has left.`);
        }
    });
    player.humanHires = nextHumanHires;

    return player;
}

const fulfilActionRewards = (player, rewards) => {
    if (rewards && rewards.length > 0) {
        let storageIsMax = false;
        const maxStorage = getStorageCapacity(player.storageLevel);
        
        for (let r=0; r<rewards.length; ++r) {
            if (storageIsMax) {
                break;
            }

            let reward = rewards[r];
            switch (reward.key) {
            case 'vp': // Add VP
                player.vp += reward.quantity;
                break;

            case 'nest': // Upgrade nest
                ++player.nestLevel;
                break;

            case 'storage': // Upgrade storage
                ++player.storageLevel;
                break;

            case 'crow': // Add a crow to Nest (if there's space)
                ++player.crows;
                break;

            default:
                for (let a=0; a<reward.quantity; ++a) {
                    if (player.storedItems.length >= maxStorage) {
                        storageIsMax = true;
                        break;
                    }

                    player.storedItems.push(reward.key);
                }
                break;
            }
        }
    }
    return player;
}

export const takeAction = (coreActionIndex, selectedActionIndex) => {
    game.update(state => {
        let nextState = {...state};
        let nextPlayers = [...state.players];
        let nextRoundActions = {...state.roundActions};

        let coreAction = actions[coreActionIndex];
        let activeAction = null;
        if (coreAction.type.includes('trade')) {
            // Select Action directly from Tradable Items list
            activeAction = nextState.tradableItems[selectedActionIndex];
        }
        else if (coreAction.type.includes('human')) {
            // Select Action directly from Human Hire list
            let key = Object.keys(humanHires)[selectedActionIndex];
            activeAction = humanHires[key];
        }
        else {
            activeAction = coreAction.actions[Math.min(selectedActionIndex, coreAction.actions.length - 1)];
        }
        
        // Fulfil conditions
        let level = 0;
        if (coreAction.type.includes('upgrade')) {
            if (coreAction.type.includes('nest')) {
                level = nextPlayers[nextState.turn].nestLevel;
            }
            else {
                level = nextPlayers[nextState.turn].storageLevel;
            }
        }

        nextPlayers[nextState.turn] = fulfilActionConditions(
            nextPlayers[nextState.turn],
            activeAction.conditions,
            level
        );

        // Fulfil rewards
        if (!coreAction.type.includes('human')) {
            nextPlayers[nextState.turn] = fulfilActionRewards(
                nextPlayers[nextState.turn],
                activeAction.rewards
            );
        }
        
        if (coreAction.type.includes('upgrade')) {
            if (coreAction.type.includes('nest')) {
                ++nextPlayers[nextState.turn].nestLevel;
            }
            else if (coreAction.type.includes('storage')) {
                ++nextPlayers[nextState.turn].storageLevel;
            }
        }
        else if (coreAction.type.includes('reproduce')) {
            nextPlayers[nextState.turn].isReproducing = true;
        }
        else if (coreAction.type.includes('trade')) {
            nextState.tradableItems[selectedActionIndex].sold = true;
            let allSold = true;
            for (let a=0; a<nextState.tradableItems.length; ++a) {
                if (!nextState.tradableItems[a].sold) {
                    allSold = false;
                    break;
                }
            }
            if (allSold) { // Auto refresh when all tradable items are sold
                nextState.tradableItems = getRandomTradableItems(tradableItemsMax);
            }
        }
        else if (coreAction.type.includes('human')) {
            let key = Object.keys(humanHires)[selectedActionIndex];
            nextPlayers[nextState.turn].humanHires.push(
                {
                    ...humanHires[key],
                    hiredLifespan: 0,
                }
            );
        }
        
        if (!nextPlayers[nextState.turn].hasTakenAction) {
            // Store action log
            nextRoundActions[coreActionIndex] = {...nextRoundActions[coreActionIndex]};
            nextRoundActions[coreActionIndex][selectedActionIndex] = [
                ...(nextRoundActions[coreActionIndex][selectedActionIndex] ?? [])
            ];
            console.log(coreActionIndex, selectedActionIndex);
            nextRoundActions[coreActionIndex][selectedActionIndex].push(
                nextPlayers[nextState.turn].color
            );

            // Update current player's status
            if (nextPlayers[nextState.turn].isReproducing) {
                nextPlayers[nextState.turn].utilizedCrows += 2;
            }
            else {
                ++nextPlayers[nextState.turn].utilizedCrows;
            }
            nextPlayers[nextState.turn].hasTakenAction = true;
        }

        nextState.players = nextPlayers;
        nextState.roundActions = nextRoundActions;
        return nextState;
    });
}

export const canTakeCrownAction = (crownAction) => {
    let gameState = get(game);
    if (gameState.canEndRound) {
        return 'The round has ended.';
    }

    let activePlayer = gameState.players[gameState.turn];
    if (!playerHasMetConditions(activePlayer, crownAction.conditions)) {
        return ERROR_NOT_ENOUGH_RESOURCES_ACTION;
    }
    return null;
}

export const takeCrownAction = (crownAction) => {
    game.update(state => {
        let nextState = {...state};

        let activePlayer = {...nextState.players[nextState.turn]};

        // Fulfil conditions
        activePlayer = fulfilActionConditions(activePlayer, crownAction.conditions);

        // Fulfil rewards
        let successMessage = `Crown Challenge: "${crownAction.name}" completed!`;
        let prevVP = activePlayer.vp;
        activePlayer = fulfilActionRewards(activePlayer, crownAction.rewards);
        if (activePlayer.vp !== prevVP) {
            const vpAdd = (activePlayer.vp - prevVP);
            successMessage += `<br /><br />${activePlayer.name} received ${vpAdd} VP${vpAdd > 1 ? 's' : ''}.`;
        }
        warning(successMessage);

        ++activePlayer.crownChallenges;

        // Store a record of completion
        if (!(crownAction.layer in nextState.completedCrownActions)) {
            nextState.completedCrownActions[crownAction.layer] = {};
        }

        let nextCrownActions = {...nextState.completedCrownActions[crownAction.layer]};
        let crownActionKey = `${crownAction.x}-${crownAction.y}`;
        nextCrownActions[crownActionKey] = {
            playerName: activePlayer.name,
            playerColor: activePlayer.color,
            layer: crownAction.layer,
        };
        nextState.completedCrownActions[crownAction.layer] = nextCrownActions;

        if (crownAction.isEndGame) {
            nextState.isEndGame = true;
            activePlayer.hasTakenAction = (activePlayer.utilizedCrows >= activePlayer.crows);
            warning(`${activePlayer.name} stole the crown!`.toUpperCase());
        }
        else {
            if (dungeonLayerIsComplete(
                    crownAction.layer, 
                    Object.keys(nextCrownActions).length,
                    nextState.players.length
                )) {
                if (nextState.crownActionLayer < crownAction.layer + 1) {
                    ++nextState.crownActionLayer;
                    warning(`Crown Challenges Layer ${nextState.crownActionLayer + 1} Unlocked!`);
                }
            }
        }

        nextState.players[nextState.turn] = activePlayer;
        return nextState;
    });
}

export const endTurn = (passed = false) => {
    game.update(state => {
        let nextState = {...state};
        let nextPlayers = [...state.players];

        // Current player update
        if (passed) {
            ++nextPlayers[nextState.turn].utilizedCrows;
        }
        nextPlayers[nextState.turn].hasTakenAction = false;

        let hasNextPlayer = false;
        let turn = nextState.turn + 1; // Switch to next player
        for (let a=0; a<nextPlayers.length; ++a) {
            let index = turn % nextPlayers.length;
            let player = nextPlayers[index];
            if (player.utilizedCrows < player.crows) { // Still has crow yet to deploy
                hasNextPlayer = true;
                break;
            }
            else {
                ++turn; // If no more crow, go to next player
            }
        }
        if (hasNextPlayer) {
            nextState.turn = turn % nextPlayers.length;
        }
        else {
            setShowEndRound(true);
            nextState.canEndRound = true;
            nextState.isFeedingPhase = (nextState.round % roundsPerFeedingPhase === 2);
            if (nextState.isFeedingPhase) {
                nextState.endRoundResults = {};
                nextPlayers.forEach((player, p) => {
                    let food = player.storedItems.filter(item => item === 'food').length;
                    let minusVP = player.crows - food;
                    nextState.endRoundResults[p] = {
                        food,
                        minusVP,
                    };
                });
            }
        }
        nextState.players = nextPlayers;
        return nextState;
    });
}

const calcPlayerTotalVP = (player) => {
    return player.vp 
    + player.crows
    + player.nestLevel
    + player.storageLevel
    + player.crownChallenges;
}

export const endRound = () => {
    game.update(state => {
        let nextState = {...state};

        ++nextState.round;
        nextState.turn = 0;
        nextState.canEndRound = false;
    
        // Reset players stats
        let nextPlayers = [...state.players];
        let vps = [];
        for (let a=0; a<nextPlayers.length; ++a) {
            nextPlayers[a].utilizedCrows = 0;
            if (nextState.isFeedingPhase) {
                nextPlayers[a].vp -= nextState.endRoundResults[a].minusVP;
            
                // Consume one food per crow
                for (let c=0; c<nextPlayers[a].crows; ++c) {
                    let itemIndex = nextPlayers[a].storedItems.indexOf('food');
                    if (itemIndex >= 0) {
                        nextPlayers[a].storedItems.splice(itemIndex, 1);
                    }
                }
            }

            // Add one more crow if reproducing
            if (nextPlayers[a].isReproducing) {
                ++nextPlayers[a].crows;
                nextPlayers[a].isReproducing = false;
            }
            vps.push(calcPlayerTotalVP(nextPlayers[a]));

            // Make human hire leaves after lifespan reached max
            let nextHumanHires = [];
            for (let h=0; h<nextPlayers[a].humanHires.length; h++) {
                ++nextPlayers[a].humanHires[h].hiredLifespan;
                if (nextPlayers[a].humanHires[h].hiredLifespan < nextPlayers[a].humanHires[h].lifespan) {
                    nextHumanHires.push(nextPlayers[a].humanHires[h]);
                }
            }
            nextPlayers[a].humanHires = nextHumanHires;
        }
        nextState.isFeedingPhase = false;

        // Calculate end game results
        let max = Math.max(...vps);
        nextPlayers.forEach(player => {
            let total = calcPlayerTotalVP(player);
            nextState.endGameResults[player.name] = {
                total,
                winner: (total > 2 && total == max),
            };
        });
        
        nextState.players = nextPlayers;
        nextState.roundActions = {};
        return nextState;
    });

    let gameState = get(game);
    if (gameState.isEndGame) {
        system.update(state => {
            let nextState = {...state};
            nextState.canEndGame = true;
            return nextState;
        });
    }
}