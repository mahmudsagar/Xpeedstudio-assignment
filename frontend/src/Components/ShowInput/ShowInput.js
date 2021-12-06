import {
    Dialog,
    DialogTitle,
    Divider,
    Grid,
    Typography, 
} from "@mui/material";
import React from "react";
// import { Modal } from 'react-bootstrap';

const ShowInput = ({ onClose, open, content }) => {

    const handleClose = () => {
        onClose(content);
    };
    const handleListItemClick = (value) => {
        onClose(value);
    };
    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                <Grid container>
                    <Grid item xs={8}>
                        <DialogTitle>Input</DialogTitle>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            component="span"
                            sx={{cursor: "pointer"}}
                            onClick={() => handleListItemClick(content)}
                        >
                            X
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <Typography sx={{ py: 2, textAlign: "center" }}>
                    {content}
                </Typography>
            </Dialog>
        </>
    );
};

export default ShowInput;
