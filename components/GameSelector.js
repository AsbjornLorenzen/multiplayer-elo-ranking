import * as React from 'react';
import { useContext } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import GameContext from '../context/GameContext';

export default function GameSelector () {
    const { gameState, setGameState } = useContext(GameContext); 
    const allGameModes = ['spike','badminton','fighting']
    const handleChange = (event) => {
      setGameState(event.target.value);
    };

    return (
    <FormControl sx={{ m: 1, minWidth: 120 }}C>
      <InputLabel id="demo-simple-select-label">Game</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={gameState}
        label={gameState}
        onChange={handleChange}
        >
        {allGameModes.map((name) => <MenuItem value={name}>{name}</MenuItem>)}
      </Select>
    </FormControl>
  )
  }