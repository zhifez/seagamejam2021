import { warning } from "../common/toastTheme";
import { get, writable } from "svelte/store";
import { actions, dungeonLayerIsComplete, getNestCapacity, getRandomTradableItems, getStorageCapacity, humanHires } from "./gameData";

const ERROR_NOT_ENOUGH_RESOURCES = 'You do not have the resource to take this action.';

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

const tradableItemsMax = 4;
export const roundsPerFeedingPhase = 3;

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

export const playerHasMetConditions = (player, conditions) => {
    let conds = (conditions ?? []).reduce((results, item, index) => {
        for (let a=0; a<item.quantity; ++a) {
            results.push(item.key);
        }
        return results;
    }, []);
    // Check from storage
    player.storedItems.forEach(item => {
        let index = conds.indexOf(item);
        if (index >= 0) {
            conds.splice(index, 1);
        }
    });
    // Check from human hires
    player.humanHires.forEach(hire => {
        let index = conds.indexOf(hire.type);
        if (index >= 0) {
            conds.splice(index, 1);
        }
    });
    return (conds.length <= 0);
}

export const hasEnoughItem = (itemKey, quantity) => {
    let gameState = get(game);
    let activePlayer = gameState.players[gameState.turn];
    if (activePlayer.hasTakenAction) {
        return 'You have already taken an action!<br />Take a Crown Challenge or end your turn.';
    }

    let totalInStorage = 0;
    for (let a=0; a<activePlayer.storedItems.length; ++a) {
        if (activePlayer.storedItems[a] === itemKey) {
            ++totalInStorage;
        }
    }
    if (totalInStorage < quantity) {
        return ERROR_NOT_ENOUGH_RESOURCES;
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


    let conditionsAreMet = playerHasMetConditions(
        activePlayer, 
        activeAction ? activeAction.conditions : []
    );
    
    if (coreAction.type.includes('take')) {
        if (activePlayer.storedItems.length >= getStorageCapacity(activePlayer.storageLevel)) {
            return 'Your Storage is full.';
        }
    }
    else if (coreAction.type.includes('upgrade')) {
        if (!conditionsAreMet) {
            return `You do not have the resource to take this action.`;
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
            return 'You do not have enough Crow for this action.';
        }
    }
    else if (coreAction.type.includes('trade')) {
        if (import.meta.env.VITE_BYPASS_TRADE_CONDITIONS !== 'true') {
            if (!conditionsAreMet) {
                return `You do not have the resource to trade this item.`;
            }
        }
    }
    else if (coreAction.type.includes('human')) {
        if (import.meta.env.VITE_BYPASS_HUMAN_HIRE_CONDITIONS !== 'true') {
            if (!conditionsAreMet) {
                return `You do not have the resource to hire this human.`;
            }
        }
    }
    return null;
}

const fulfilActionConditions = (player, conditions) => {
    if (conditions && conditions.length > 0) {
        conditions.forEach(item => {
            for (let a=0; a<item.quantity; ++a) {
                let index = player.storedItems.indexOf(item.key);
                if (index >= 0) {
                    player.storedItems.splice(item.key, 1);
                }
                else {
                    for (let h=0; h<player.humanHires.length; ++h) {
                        if (player.humanHires[h].type === item.key) {
                            ++player.humanHires[h].hiredLifespan;
                        }
                    }
                }
            }
        });
    }

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
        nextPlayers[nextState.turn] = fulfilActionConditions(
            nextPlayers[nextState.turn],
            activeAction.conditions
        );

        // Fulfil rewards
        nextPlayers[nextState.turn] = fulfilActionRewards(
            nextPlayers[nextState.turn],
            activeAction.rewards
        );
        
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
        return ERROR_NOT_ENOUGH_RESOURCES;
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
        };
        nextState.completedCrownActions[crownAction.layer] = nextCrownActions;

        if (crownAction.isEndGame) {
            nextState.isEndGame = true;
            warning(`${activePlayer.name} stole the crown!`.toUpperCase());
        }
        else {
            if (dungeonLayerIsComplete(
                    crownAction.layer, 
                    Object.keys(nextCrownActions).length
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
            }
            
            // Consume one food per crow
            for (let c=0; c<nextPlayers[a].crows; ++c) {
                let itemIndex = nextPlayers[a].storedItems.indexOf('food');
                if (itemIndex >= 0) {
                    nextPlayers[a].storedItems.splice(itemIndex, 1);
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