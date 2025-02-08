import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { ConfirmationDialogProps } from '../types';


const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    title,
    content,
    onCancel,
    onConfirm,
    confirmDiscard
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    {confirmDiscard}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
