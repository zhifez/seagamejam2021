import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { app } from './networking';

const db = getFirestore(app);

export const mainState = writable({
    isLoading: false,
    showGameId: false,
    gameId: null,
    imageSrc: null,
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

export const setImageSrc = (image) => {
    updateMainState('imageSrc', image);
}

export const createGame = async () => {
    updateMainState('isLoading', true);
    const gameRef = await addDoc(
        collection(db, 'games'),
        {
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