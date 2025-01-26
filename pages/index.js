import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, alpha, IconButton, Typography,FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import { getPlayers, getMatches } from '../lib/dbQueries';
import AlertDialogSlide from '../lib/deleteDialog';
import GameContext from '../context/GameContext';
import AlertContext from '../context/alertContext';
import CustomAlert from '../components/ErrorAlert'
import MatchTable from '../components/MatchesTable';
import ScoreboardTable from '../components/ScoreboardTable';
import GameSelector from '../components/GameSelector';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react'
import SignInBox from '../components/SignIn'

export default function Home() {
  const [allMatches, setAllMatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState();

  const {data: session, status } = useSession()
  const router = useRouter();
  const { alertState, setAlertState } = useContext(AlertContext)

  console.log('DATA FROM SESSION ',session, status)
  console.log('ENV STUFF ',process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID)

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <Container sx={{ backgroundColor: '#f0f2f5', padding: '1rem', borderRadius: '8px' }}>
      <SignInBox></SignInBox>
      {alertState.map((alert) => {return alert})}
      <AlertDialogSlide match={currentMatch} open={open} setOpen={setOpen} setAllMatches={setAllMatches} />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align='center'>
          Scoreboard
        </Typography>
        <ScoreboardTable  allMatches={allMatches} setAllMatches={setAllMatches} />

        <Typography variant="h4" component="h1" gutterBottom align='center'>
          All Matches
        </Typography>
        <MatchTable allMatches={allMatches} setAllMatches={setAllMatches} setCurrentMatch={setCurrentMatch} setOpen={setOpen}/>
      
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigateTo('/add-match')}>
            Add 1v1 match
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigateTo('/add-team-match')}>
            Add 2v2 match
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigateTo('/players')}>
            Add new player
          </Button>
          <Button variant="contained" color="secondary" onClick={() => signIn()}>
            Sign In
          </Button>
          <GameSelector/>
        </Box>
      </Box>
    </Container>
  );
}
