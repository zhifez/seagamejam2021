import { get, writable } from "svelte/store";
import { actions, getNestCapacity, getStorageCapacity, humanHires } from "./gameData";

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
    };
}

export const game = writable({
    players: [
        createPlayer('Player 1', colors[0], 2),
        createPlayer('Player 2', colors[1], 2),
        // createPlayer('Player 3', colors[2], 2),
    ],
    round: 0, turn: 0, 
    canEndRound: false,
    endRoundResults: null,
    layer: 0,
    roundActions: {},
    completedCrownActions: {},
});

export const setupPlayers = (playerCount) => {
    game.update(state => {
        let nextState = {...state};
        nextState.players = [];
        for (let a=0; a<playerCount; ++a) {
            nextState.players.push(
                createPlayer(
                    `Player ${a + 1}`, 
                    colors[a], 
                    2
                )
            );
        }
        return nextState;
    });
}

export const system = writable({
    hasStarted: false,
    showActiveHumanHire: false,
    activeHumanHire: null,
    showActiveCrownAction: false,
    activeCrownAction: null,
});

export const setHasStarted = () => {
    system.update(state => {
        let nextState = {...state};
        nextState.hasStarted = true;
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

export const canTakeAction = (player, coreActionIndex, selectedActionIndex) => {
    let gameState = get(game);
    if (gameState.canEndRound) {
        return 'The round has ended.';
    }

    if (player.hasTakenAction) {
        return 'You have already taken an action!\nTake a Crown Action or end your turn.';
    }
    
    if (coreActionIndex in gameState.roundActions) {
        if (selectedActionIndex in gameState.roundActions[coreActionIndex]) {
            return 'Action has already been taken.';
        }
    }
    
    let coreAction = actions[coreActionIndex];
    let activeAction = null;
    if (coreAction.actions) {
        activeAction = coreAction.actions[Math.min(selectedActionIndex, coreAction.actions.length - 1)];
    }
    
    if (coreAction.type.includes('human')) {
        let key = Object.keys(humanHires)[selectedActionIndex];
        activeAction = humanHires[key];
    }

    let conditionsAreMet = false;
    if (player.storedItems.length > 0) {
        if (activeAction.conditions
            && activeAction.conditions.length > 0) {
            let conds = activeAction.conditions.reduce((results, item, index) => {
                for (let a=0; a<item.quantity; ++a) {
                    results.push(item.key);
                }
                return results;
            }, []);
            player.storedItems.forEach(item => {
                let index = conds.indexOf(item);
                if (index >= 0) {
                    conds.splice(index, 1);
                }
            });
            conditionsAreMet = (conds.length <= 0);
        }
    }
    
    if (coreAction.type.includes('take')) {
        if (player.storedItems.length >= getStorageCapacity(player.storageLevel)) {
            return 'Your Storage is full.';
        }
    }
    else if (coreAction.type.includes('upgrade')) {
        if (!conditionsAreMet) {
            return `Your do not have enough resource to take this action.`;
        }
    }
    else if (coreAction.type.includes('reproduce')) {
        if (player.isReproducing) {
            return `You can only take this action once per round.`;
        }
        if (player.crows >= getNestCapacity(player.nestLevel)) {
            return `Your Nest cannot occupy anymore Crow.`;
        }
        if (player.crows - player.utilizedCrows < 2) {
            return 'You do not have enough Crow for this action.';
        }
    }
    else if (coreAction.type.includes('human')) {
        if (!conditionsAreMet) {
            return `Your do not have enough resource to hire this human.`;
        }
    }
    return null;
}

export const takeAction = (coreActionIndex, selectedActionIndex) => {
    game.update(state => {
        let nextState = {...state};
        let nextPlayers = [...state.players];
        let nextRoundActions = {...state.roundActions};

        let coreAction = actions[coreActionIndex];
        let activeAction = null;
        if (coreAction.actions) {
            activeAction = coreAction.actions[Math.min(selectedActionIndex, coreAction.actions.length - 1)];
        }

        if (coreAction.type.includes('human')) {
            let key = Object.keys(humanHires)[selectedActionIndex];
            activeAction = humanHires[key];
        }

        if (activeAction.conditions && activeAction.conditions.length > 0) {
            activeAction.conditions.forEach(item => {
                for (let a=0; a<item.quantity; ++a) {
                    nextPlayers[nextState.turn].storedItems.splice(item.key, 1);
                }
            });
        }
        
        if (coreAction.type.includes('take')) {
            if (activeAction.rewards) {
                let storageIsMax = false;
                const maxStorage = getStorageCapacity(nextPlayers[nextState.turn].storageLevel);
                for (let a=0; a<activeAction.rewards.length; ++a) {
                    if (storageIsMax) {
                        break;
                    }

                    for (let b=0; b<activeAction.rewards[a].quantity; b++) {
                        switch (activeAction.rewards[a].key) {
                        case 'nest':
                        case 'storage':
                        case 'crow':
                            break;

                        default:
                            if (nextPlayers[nextState.turn].storedItems.length >= maxStorage) {
                                storageIsMax = true;
                                break;
                            }
    
                            nextPlayers[nextState.turn].storedItems.push(activeAction.rewards[a].key);
                            break;
                        }
                    }
                }
            }
        }
        else if (coreAction.type.includes('upgrade')) {
            if (coreAction.type.includes('nest')) {
                ++nextPlayers[nextState.turn].nestLevel;
            }
            else if (coreAction.type.includes('storage')) {
                ++nextPlayers[nextState.turn].storageLevel;
            }
        }
        else if (coreAction.type.includes('reproduce')) {
            nextPlayers[nextState.turn].utilizedCrows += 2;
            nextPlayers[nextState.turn].isReproducing = true;
        }
        else if (coreAction.type.includes('human')) {
            let key = Object.keys(humanHires)[selectedActionIndex];
            nextPlayers[nextState.turn].humanHires.push(
                {
                    ...humanHires[key],
                    hiredLifespan: 0,
                }
            );
            console.log(nextPlayers[nextState.turn].humanHires);
        }

        if (!nextPlayers[nextState.turn].hasTakenAction) {
            // Store action log
            nextRoundActions[coreActionIndex] = {...nextRoundActions[coreActionIndex]};
            nextRoundActions[coreActionIndex][selectedActionIndex] = nextPlayers[nextState.turn].color;
            // Update current player's status
            ++nextPlayers[nextState.turn].utilizedCrows;
            nextPlayers[nextState.turn].hasTakenAction = true;
        }

        nextState.players = nextPlayers;
        nextState.roundActions = nextRoundActions;
        return nextState;
    });
}

export const canTakeCrownAction = (crownAction) => {
    return null;
}

export const takeCrownAction = (crownAction) => {

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
            nextState.canEndRound = true;
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
        nextState.players = nextPlayers;
        return nextState;
    });
}

export const endRound = () => {
    game.update(state => {
        let nextState = {...state};

        ++nextState.round;
        nextState.turn = 0;
        nextState.canEndRound = false;
    
        // Reset players stats
        let nextPlayers = [...state.players];
        for (let a=0; a<nextPlayers.length; ++a) {
            nextPlayers[a].utilizedCrows = 0;
            nextPlayers[a].vp -= nextState.endRoundResults[a].minusVP;

            if (nextPlayers[a].isReproducing) {
                ++nextPlayers[a].crows;
                nextPlayers[a].isReproducing = false;
            }

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

        nextState.players = nextPlayers;
        nextState.roundActions = {};
        return nextState;
    });
}