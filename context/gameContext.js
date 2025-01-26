import React, { createContext, useState } from 'react';

const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [gameState, setGameState] = useState('spike');

    return (
        <GameContext.Provider value={{ gameState, setGameState }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;