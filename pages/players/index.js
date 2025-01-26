import * as React from 'react';
import { Container, Box, Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import { handleAddPlayer, getPlayers } from '../../lib/dbQueries'
import GameContext from '../../context/GameContext';

export default function Page1() {
  const router = useRouter();
  const [input, setInput] = useState("")
  const [allPlayerNames, setAllPlayerNames] = useState(false)
  const {gameState, setGameState} = useContext(GameContext)

  console.log('XXXXXXXXX GAMESTATE IS ',gameState)
  if (!allPlayerNames) {
    getPlayers(gameState).then((p) => setAllPlayerNames(p))
  }

  const isWhitespaceString = str => !str.replace(/\s/g, '').length

  return (
    <Container>
      <h1>Add player</h1>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={(e) => {setInput(e.target.value)}}
      />
      <Box sx={{ my: 4 }}>
        <Button 
            variant="contained" 
            onClick={() => {
                console.log('current input is ',input);
                const playerObj = JSON.stringify({'player': input, 'game':gameState})
                handleAddPlayer(playerObj);
                router.push('/');
            }} 
            disabled={!allPlayerNames || allPlayerNames.includes(input) || isWhitespaceString(input)}>
          Add player
        </Button>
      </Box>
    </Container>
  );
}
