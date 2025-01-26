import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { deleteMatch, getMatches } from '../lib/dbQueries'
import { useRouter } from 'next/router';
import { useContext } from 'react';
import GameContext from '../context/GameContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ match, open, setOpen, setAllMatches }) {
  const router = useRouter();
  const { gameState, setGameState } = useContext(GameContext)
  
  const handleClose = () => {
    setOpen(false);
    updateMatches()
  };

  const handleDelete = () => {
    console.log('deleting ',match)
    deleteMatch(match).then(() => {
      handleClose()
    });
  }

  const updateMatches = () => {
    getMatches(gameState).then((arr) => setAllMatches(arr))
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this match?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}