import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";

export default ({open, onClose, onQuit}: any) => {
    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to quit?"}</DialogTitle>

                <DialogActions>
                    <Button onClick={onClose} color="primary">Close</Button>
                    <Button onClick={onQuit} color="primary" autoFocus>Quit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};