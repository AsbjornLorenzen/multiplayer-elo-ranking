// pages/page1.js
import * as React from 'react';
import { Container, Box, Button, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { getPlayers } from '../../lib/dbQueries'
import { TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material';
import CustomAlert from '../../components/ErrorAlert'
import GameContext from '../../context/GameContext';
import AlertContext from '../../context/alertContext';

export default function Page1() {
  const router = useRouter();  

  const [p1, setp1] = useState("")
  const [p2, setp2] = useState("")
  const [score1, setScore1] = useState("")
  const [score2, setScore2] = useState("")
  const [err1, setErr1] = useState("")
  const [err2, setErr2] = useState("")
  const [allPlayerNames, setAllPlayerNames] = useState([])
  const [btnDisabled, setBtnDisabled] = useState(true)

  const {gameState, setGameState} = useContext(GameContext)
  const {alertState, setAlertState} = useContext(AlertContext)

  useEffect(() => {
    if (!(p1 && p2 && score1 && score2)  || (hasDuplicates([p1,p2]))) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }
  }, [p1,p2,score1,score2]
  )

  useEffect(() => {
    if (allPlayerNames.length === 0) {
      getPlayers(gameState).then((players) => setAllPlayerNames(players));
    }
  }, [gameState, allPlayerNames]);

  function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  async function handleAddMatch(match) {
    console.log('all obj: ',p1,p2,score1,score2)
    const now = Date.now()
    const matchInfo = {
      'team1': [p1],
      'team2': [p2],
      'team1score': score1,
      'team2score': score2,
      'timeAdded': now,
      'matchType':'1v1',
      'game':gameState
    }

    try {
      const response = await fetch("/api/new-match", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(matchInfo),
      })
      const notification = response.ok
      ? <CustomAlert displayText={'Added match'} severity={'success'}/>
      : <CustomAlert displayText={`Something went wrong when adding match: ${(await response.json()).error}`} severity={'error'}/>
      setAlertState((prev) => prev.concat([notification]))
    } catch (err) {
      const errMsg = <CustomAlert displayText={`Something went wrong when adding match. `} severity={'error'}/>
      setAlertState(alertState.concat([errMsg]))
    }
    
  
  }

  function handleScoreChange(event, setTeamScore, setTeamErr) {
    const inputText = event.target.value;
    if (/^-?\d*$/.test(inputText)) {
      setTeamScore(inputText)
      setTeamErr("")
    } else {
      setTeamScore("")
      setTeamErr("Please enter a valid number")
    }
  }


  function makePlayerBox(playerNum, playerNumVal, setPlayerNumScore) {
    const playerStr = "Player " + playerNum.toString()
    const handleChange = (event) => {
      setPlayerNumScore(event.target.value);
    };
    return (
    <FormControl sx={{ m: 1, minWidth: 120 }}C>
      <InputLabel id="demo-simple-select-label">{playerStr}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={playerNumVal}
        label={playerStr}
        onChange={handleChange}
        >
        {allPlayerNames.map((name) => <MenuItem value={name}>{name}</MenuItem>)}
      </Select>
    </FormControl>
  )
  }
  
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" gutterBottom>
          Add 1v1 Match
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Player 1
            </Typography>
            {makePlayerBox(1, p1, setp1)}
          <Box sx={{ mt: 4 }}>
            <TextField
              label="Enter score for player 1"
              value={score1}
              onChange={(e) => handleScoreChange(e,setScore1,setErr1)}
              error={Boolean(err1)}
              helperText={err1}
              fullWidth
              />
          </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Player 2
            </Typography>
            {makePlayerBox(2, p2, setp2)}
          <Box sx={{ mt: 4 }}>
            <TextField
              label="Enter score for player 2"
              value={score2}
              onChange={(e) => handleScoreChange(e,setScore2,setErr2)}
              error={Boolean(err2)}
              helperText={err2}
              fullWidth
              />
          </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
            disabled={btnDisabled}
            variant="contained"
            onClick={() => {
              handleAddMatch();
              router.push('/');
            }}

          >
            Add match
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

