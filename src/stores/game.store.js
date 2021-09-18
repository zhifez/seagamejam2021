import { writable } from "svelte/store";

const colors = [
    'red-500',
    'blue-500',
    'green-500',
    'purple-500',
];

const createPlayer = (name, color) => {
    return {
        name,
        color,
        crows: 2,
        utilizedCrows: 0, 
        nestLevel: 1, 
        storageLevel: 1,
        storedItems: [
            'food', 'stick', 'gem', 'ring', 'stone', 'coin'
        ],
    };
}

export const nestCapacityPerLevel = 2;
export const storageCapacityPerLevel = 3;

export const game = writable({
    players: [
        createPlayer('Player 1', colors[0]),
        createPlayer('Player 2', colors[1]),
    ],
    round: 0, turn: 0,
    layer: 0,
});

export const nextTurn = (passed = false) => {
    game.update(state => {
        let nextState = {...state};
        let nextPlayers = [...nextState.players];

        if (passed) {
            ++nextPlayers[nextState.turn].utilizedCrows;
        }

        let hasNextPlayer = false;
        ++nextState.turn; // Switch to next player
        for (let a=0; a<nextPlayers.length; ++a) {
            let index = (nextState.turn + a) % nextPlayers.length;
            let player = nextPlayers[index];
            if (player.utilizedCrows < player.crows) { // Still has crow yet to deploy
                hasNextPlayer = true;
                break;
            }
            else {
                ++nextState.turn; // If no more crow, go to next player
            }
        }
        if (hasNextPlayer) {
            nextState.turn %= nextPlayers.length;
        }
        else {
            // Go to next Round
            ++nextState.round;
            nextState.turn = 0;
        
            // Reset players stats
            for (let a=0; a<nextPlayers.length; ++a) {
                nextPlayers[a].utilizedCrows = 0;
            }
        }
        nextState.players = nextPlayers;
        return nextState;
    });
}