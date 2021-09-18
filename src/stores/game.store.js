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
        crowCount: 2,
    };
}

export const game = writable({
    players: [
        createPlayer('Player 1', colors[0]),
        createPlayer('Player 2', colors[1]),
    ],
    round: 0, turn: 0,
    layer: 0,
});