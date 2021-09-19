import { writable } from "svelte/store";
import { actions } from "./gameData";

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
    };
}

export const nestCapacityPerLevel = 2;
export const storageCapacityPerLevel = 6;

export const game = writable({
    players: [
        createPlayer('Player 1', colors[0], 2),
        createPlayer('Player 2', colors[1], 2),
        createPlayer('Player 3', colors[2], 2),
    ],
    round: 0, turn: 0, canEndRound: false,
    layer: 0,
    actions: {},
});

export const takeAction = (index, actionIndex) => {
    game.update(state => {
        let nextState = {...state};
        let nextPlayers = [...state.players];
        let nextActions = {...state.actions};

        let coreAction = actions[index];
        let activeAction = coreAction.actions[Math.min(actionIndex, actions[index].actions.length - 1)];
        
        if (coreAction.type.includes('take')) {
            if (activeAction.rewards) {
                let storageIsMax = false;
                const maxStorage = nextPlayers[nextState.turn].storageLevel * storageCapacityPerLevel;
                for (let a=0; a<activeAction.rewards.length; ++a) {
                    if (storageIsMax) {
                        break;
                    }

                    for (let b=0; b<activeAction.rewards[a].quantity; b++) {
                        if (nextPlayers[nextState.turn].storedItems.length >= maxStorage) {
                            storageIsMax = true;
                            break;
                        }

                        nextPlayers[nextState.turn].storedItems.push(activeAction.rewards[a].key);
                    }
                }
            }
        }
        else if (coreAction.type.includes('upgrade')) {
            activeAction.conditions.forEach(item => {
                for (let a=0; a<item.quantity; ++a) {
                    nextPlayers[nextState.turn].storedItems.splice(item.key, 1);
                }
            });
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

        if (!nextPlayers[nextState.turn].hasTakenAction) {
            // Store action log
            nextActions[index] = {...nextActions[index]};
            nextActions[index][actionIndex] = nextPlayers[nextState.turn].color;
            // Update current player's status
            ++nextPlayers[nextState.turn].utilizedCrows;
            nextPlayers[nextState.turn].hasTakenAction = true;
        }

        nextState.players = nextPlayers;
        nextState.actions = nextActions;
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
            // Go to next Round
            nextState.canEndRound = true;
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
            if (nextPlayers[a].isReproducing) {
                ++nextPlayers[a].crows;
                nextPlayers[a].isReproducing = false;
            }
        }

        nextState.players = nextPlayers;
        nextState.actions = {};
        return nextState;
    });
}