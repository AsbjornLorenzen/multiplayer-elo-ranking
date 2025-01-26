import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, alpha, IconButton, Typography,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getMatches } from '../lib/dbQueries';
import GameContext from '../context/GameContext';


export default function MatchTable({ allMatches,setAllMatches,setCurrentMatch,setOpen }) {
    const [matchesStatus, setMatchesStatus] = useState('loading')
    const { gameState, setGameState } = useContext(GameContext); 

    useEffect (() => {
        const fetchMatches = async () => {
            try {
                const matches = await getMatches(gameState);
                if (matches.length === 0) {
                    throw new Error('Failed loading')
                }
                setAllMatches(matches)
                setMatchesStatus('loaded')
            } catch (err) {
                setMatchesStatus('error')
            }
        }
        fetchMatches()
    }, [gameState])

    const createMatchRow = (match) => {
        const t1str = match.team1.join(' & ');
        const t2str = match.team2.join(' & ');
    
        const t1score = Number(match.team1score);
        const t2score = Number(match.team2score);
    
        const t1style = t1score < t2score
          ? { backgroundColor: alpha('#f50057', 0.5) }
          : t1score === t2score
          ? { backgroundColor: alpha('#ffee33', 0.5) }
          : { backgroundColor: alpha('#a2cf6e', 0.5) };
        const t2style = t2score < t1score
          ? { backgroundColor: alpha('#f50057', 0.5) }
          : t2score === t1score
          ? { backgroundColor: alpha('#ffee33', 0.5) }
          : { backgroundColor: alpha('#a2cf6e', 0.5) };
    
        return (
          <TableRow key={match._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell sx={{ margin: 'auto', textAlign: 'center' }} component="th" scope="row" style={t1style}>
              {t1str}
            </TableCell>
            <TableCell sx={{ margin: 'auto', textAlign: 'center' }} component="th" scope="row" style={t1style}>
              {t1score}
            </TableCell>
            <TableCell sx={{ margin: 'auto', textAlign: 'center' }} component="th" scope="row">
              {' '}
              -{' '}
            </TableCell>
            <TableCell sx={{ margin: 'auto', textAlign: 'center' }} component="th" scope="row" style={t2style}>
              {t2score}
            </TableCell>
            <TableCell sx={{ margin: 'auto', textAlign: 'center' }} component="th" scope="row" style={t2style}>
              {t2str}
            </TableCell>
            <TableCell sx={{ margin: 0, align: 'center', width: 80 }} component="th" scope="row">
              <IconButton
                aria-label="delete"
                onClick={() => {
                  setCurrentMatch(match);
                  setOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label="edit"
                onClick={() => {
                  router.push(`/edit-match?matchid=${match._id}`);
                }}
              >
                <EditIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} sx={{ margin: 'auto', textAlign: 'center' }}>
                    Team 1
                  </TableCell>
                  <TableCell> </TableCell>
                  <TableCell colSpan={2} sx={{ margin: 'auto', textAlign: 'center' }}>
                    Team 2
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(matchesStatus === 'loading') && (
                    <TableRow>
                        <TableCell colSpan={5} align="center">
                        <CircularProgress />
                        </TableCell>
                    </TableRow>
                )}
                {(matchesStatus === 'error') && (
                    <TableRow>
                        <TableCell colSpan={5} align="center">
                        <Typography color="error">Failed to load matches.</Typography>
                        </TableCell>
                    </TableRow>
                )}
                {(matchesStatus === 'loaded') && allMatches && Array.from(allMatches).map((match) => createMatchRow(match))}
                </TableBody>
            </Table>
          </TableContainer>
        </Box>

    )
}