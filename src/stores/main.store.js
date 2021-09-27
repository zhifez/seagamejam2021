import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { app } from './networking';

const db = getFirestore(app);

export const mainState = writable({
    isLoading: false,
    showGameId: false,
    gameId: null,
});

const updateMainState = (key, value) => {
    mainState.update(state => {
        let nextState = {...state};
        nextState[key] = value;
        return nextState;
    });
}

export const setShowGameId = (show) => {
    updateMainState('showGameId', show)
}

export const createGame = async (playerCount) => {
    let players = [];
    for (let a=0; a<playerCount; ++a) {
        players.push({
            name: `Player ${a + 1}`,
            isClaimed: false,
        });
    }
    
    updateMainState('isLoading', true);
    const gameRef = await addDoc(
        collection(db, 'games'),
        {
            players,
            isCompleted: false,
            states: [],
            date_created: new Date(),
            date_updated: new Date(),
        }
    );
    updateMainState('isLoading', false);
    updateMainState('gameId', gameRef.id);
    updateMainState('showGameId', true);
}