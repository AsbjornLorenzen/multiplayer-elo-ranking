// pages/page1.js
import * as React from 'react';
import { Container, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { getPlayers } from '../../lib/dbQueries'
import { TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material';
import GameContext from '../../context/GameContext';
import AlertContext from '../../context/alertContext';

export default function Page1() {
  const router = useRouter();  

  const [formData, setFormData] = useState({
    p1: "",
    p2: "",
    p3: "",
    p4: "",
    score1: "",
    score2: ""
  });

  const [errors, setErrors] = useState({
    err1: "",
    err2: ""
  });

  const [allPlayerNames, setAllPlayerNames] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(true);

  const { gameState } = useContext(GameContext);
  const { alertState, setAlertState } = useContext(AlertContext);

  // Check that form data is filled out correctly
  useEffect(() => {
    const { p1, p2, p3, p4, score1, score2 } = formData;
    if (!(p1 && p2 && p3 && p4 && score1 && score2) || hasDuplicates([p1, p2, p3, p4])) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [formData]);

  useEffect(() => {
    if (allPlayerNames.length === 0) {
      getPlayers(gameState).then((players) => setAllPlayerNames(players));
    }
  }, [gameState, allPlayerNames]);

  function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  async function handleAddMatch() {
    const now = Date.now();
    const matchInfo = {
      team1: [formData.p1, formData.p2],
      team2: [formData.p3, formData.p4],
      team1score: formData.score1,
      team2score: formData.score2,
      timeAdded: now,
      matchType: '2v2',
      game: gameState
    };
    
    try {
      const response = await fetch("/api/new-match", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchInfo),
      });
      const notification = response.ok
        ? <CustomAlert displayText={'Added match'} severity={'success'} />
        : <CustomAlert displayText={`Something went wrong when adding match: ${(await response.json()).error}`} severity={'error'} />;
      setAlertState((prev) => prev.concat([notification]));
    } catch (err) {
      const errMsg = <CustomAlert displayText={`Something went wrong when adding match.`} severity={'error'} />;
      setAlertState(alertState.concat([errMsg]));
    }
  }

  function handleScoreChange(event, field, errorField) {
    const inputText = event.target.value;
    if (/^-?\d*$/.test(inputText)) {
      setFormData(prev => ({ ...prev, [field]: inputText }));
      setErrors(prev => ({ ...prev, [errorField]: "" }));
    } else {
      setFormData(prev => ({ ...prev, [field]: "" }));
      setErrors(prev => ({ ...prev, [errorField]: "Please enter a valid number" }));
    }
  }

  function makePlayerBox(playerNum, field) {
    const playerStr = `Player ${playerNum}`;
    const handleChange = (event) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };
    return (
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id={`player-select-label-${playerNum}`}>{playerStr}</InputLabel>
        <Select
          labelId={`player-select-label-${playerNum}`}
          id={`player-select-${playerNum}`}
          value={formData[field]}
          label={playerStr}
          onChange={handleChange}
        >
          {allPlayerNames.map((name) => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" gutterBottom>
          Add 2v2 Match
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Team 1
            </Typography>
            {makePlayerBox(1, 'p1')}
            {makePlayerBox(2, 'p2')}
            <Box sx={{ mt: 4 }}>
              <TextField
                label="Enter score for team 1"
                value={formData.score1}
                onChange={(e) => handleScoreChange(e, 'score1', 'err1')}
                error={Boolean(errors.err1)}
                helperText={errors.err1}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              Team 2
            </Typography>
            {makePlayerBox(3, 'p3')}
            {makePlayerBox(4, 'p4')}
            <Box sx={{ mt: 4 }}>
              <TextField
                label="Enter score for team 2"
                value={formData.score2}
                onChange={(e) => handleScoreChange(e, 'score2', 'err2')}
                error={Boolean(errors.err2)}
                helperText={errors.err2}
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
}
