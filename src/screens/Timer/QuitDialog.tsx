import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";

export default ({open, onClose, onQuit, isRevision}: any) => {    
    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{`Are you sure you want to ${isRevision? 'stop': 'quit'}?`}</DialogTitle>

                <DialogActions>
                    <Button onClick={onClose} color="primary">Close</Button>
                    <Button onClick={onQuit} color="primary" autoFocus>{isRevision? 'Stop': 'Quit'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};