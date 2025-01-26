import * as React from 'react';
import { getPlayers, getMatches } from '../lib/dbQueries';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, alpha, IconButton, Typography,} from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GameContext from '../context/GameContext';
import CalculateElo from '../lib/calculateElo';


export default function ScoreboardTable({allMatches, setAllMatches}) {
    const [playerRows, setPlayerRows] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const { gameState, setGameState } = useContext(GameContext); 
    const [loadedStatus,setLoadedStatus] = useState('loading')

    useEffect(() => {
        const fetchData = async () => {
          try {
              const players = await getPlayers(gameState)
              setAllPlayers(players);
              
              if (players.length > 0 && allMatches.length > 0) {
                  const ranking = CalculateElo(allMatches, allPlayers);
                  let rankingArr = [];
                  Object.keys(ranking).forEach((k) => rankingArr.push([k, ranking[k]]));
                  rankingArr.sort((a, b) => b[1] - a[1]);
                  setPlayerRows(rankingArr);
                  setLoadedStatus('loaded')
                }
            } catch (err) {
                console.error('Error while loading: ', err)
                setLoadedStatus('error')
            }
        };
        fetchData();
    
      }, [gameState, allMatches]); 

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer component={Paper} sx={{ mb: 4, maxWidth: '90%' }}>
          <Table sx={{ minWidth: 150 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {(loadedStatus === 'loading') && (
                    <TableRow>
                        <TableCell colSpan={5} align="center">
                        <CircularProgress />
                        </TableCell>
                    </TableRow>
                )}
                {(loadedStatus === 'error') && (
                    <TableRow>
                        <TableCell colSpan={5} align="center">
                        <Typography color="error">Failed to load scoreboard.</Typography>
                        </TableCell>
                    </TableRow>
                )}
              {(loadedStatus === 'loaded') && playerRows &&
                playerRows.map((row) => (
                  <TableRow key={row[0]} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row[0]}
                    </TableCell>
                    <TableCell align="right">{Math.round(row[1])}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
}