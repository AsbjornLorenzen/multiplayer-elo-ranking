// pages/page1.js
import * as React from 'react';
import { Container, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { getPlayers, getMatchById } from '../../lib/dbQueries'
import { TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material';
import { useSearchParams } from 'next/navigation'
import GameContext from '../../context/GameContext';

export default function EditMatch() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const matchid = searchParams.get('matchid')

  const [match, setMatch] = useState("")
  const [p1, setp1] = useState("")
  const [p2, setp2] = useState("")
  const [p3, setp3] = useState("")
  const [p4, setp4] = useState("")
  const [score1, setScore1] = useState("")
  const [score2, setScore2] = useState("")
  const [err1, setErr1] = useState("")
  const [err2, setErr2] = useState("")
  const [allPlayerNames, setAllPlayerNames] = useState([])
  const [btnDisabled, setBtnDisabled] = useState(false)
  const { gameState, setGameState } = useContext(GameContext)

  useEffect(() => {
    if ((match.matchType === "2v2") && (!(p1 && p2 && p3 && p4 && score1 && score2)  || (hasDuplicates([p1,p2,p3,p4])))
    ||  (match.matchType === "1v1") && (!(p1 && p3 && score1 && score2)  || (hasDuplicates([p1,p3])))) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }
  }, [p1,p2,p3,p4,score1,score2,match]
  )


  if (match === "") {
    console.log('getting match by id (calling).... ',matchid);
    getMatchById(matchid).then((m) => setMatch(m))
  }

  useEffect(() => {
      if (match.matchType === '1v1') {
        setp1(match.team1[0])
        setp3(match.team2[0])
      } else if (match.matchType === '2v2') {
        setp1(match.team1[0])
        setp2(match.team1[1])
        setp3(match.team2[0])
        setp4(match.team2[1])
      }
      setScore1(match.team1score)
      setScore2(match.team2score)
  }, [match])

  /* 
    if (p1 === '') {
      initialSetup()
    }
  */

  function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  function handleAddMatch() {
    const now = Date.now()
    const matchInfo = (match.matchType === '1v1') ? {
        '_id': match._id,
        'team1': [p1],
        'team2': [p3],
        'team1score': score1,
        'team2score': score2,
        'timeAdded': now,
        'matchType': '1v1'
    } : {
        '_id': match._id,
        'team1': [p1,p2],
        'team2': [p3,p4],
        'team1score': score1,
        'team2score': score2,
        'timeAdded': now,
        'matchType': '2v2'
    }
    
    const response = fetch("/api/update-match", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchInfo),
    }).then((r) => console.log('response from editing is', r))
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

  if (allPlayerNames.length===0) {
    getPlayers(gameState).then((p) => setAllPlayerNames(p))  
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
          Confirm edit
        </Typography>
        { (p1 != "") &&
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" gutterBottom>
                Team 1
              </Typography>
              {makePlayerBox(1, p1, setp1)}
              {(match.matchType === '2v2') && makePlayerBox(2, p2, setp2)}
            <Box sx={{ mt: 4 }}>
              <TextField
                label="Enter score for team 1"
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
                Team 2
              </Typography>
              {makePlayerBox(3, p3, setp3)}
              {(match.matchType === '2v2') && makePlayerBox(4, p4, setp4)}
            <Box sx={{ mt: 4 }}>
              <TextField
                label="Enter score for team 2"
                value={score2}
                onChange={(e) => handleScoreChange(e,setScore2,setErr2)}
                error={Boolean(err2)}
                helperText={err2}
                fullWidth
                />
            </Box>
            </Grid>
          </Grid>
        }
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
