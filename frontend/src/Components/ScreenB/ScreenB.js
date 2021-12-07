import "../Screen.css";
import React, { useEffect, useState } from "react";
import ShowInput from "../ShowInput/ShowInput";
import socketIOClient from "socket.io-client";
import { Link } from "react-router-dom";
import { Button, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Box } from "@mui/system";
const ENDPOINT = "http://localhost:5000";

const ScreenB = () => {
    let socket = socketIOClient(ENDPOINT);
    const [results, setResults] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [listContent, setListContent] = useState("");

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        socket.on("connection", () => {
            console.log("Connected...");

            fetch("https://dunamic-calculations.herokuapp.com/calculations")
                .then((res) => res.json())
                .then((data) => {
                    setResults(data.allResults);
                });
        });

        socket.on("result", (data) => {
            if (data.status === "ok") {
                setResults((results) => [...results, data]);
            }
            setProcessing(false);
        });

        socket.on("allResults", (data) => {
            setResults(data[0].allResults);
        });
    }, []);

    const handleClickOpen = (data) => {
        setOpen(true);
        setListContent(data);
    };
    const handleClose = (value) => {
        setOpen(false);
        setListContent(value);
    };

    return (
        <>
            <Grid
                container
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    p: 3,
                }}
            >
                <Paper
                    elevation={6}
                    className="screen-container"
                    sx={{ bgcolor: "#E1E2E1" }}
                >
                    <Grid
                        container
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "#000063",
                            p: 1,
                        }}
                    >
                        <Typography
                            component="h4"
                            sx={{ fontWeight: 600, color: "#fff" }}
                        >
                            Screen B
                        </Typography>
                        <Link
                            to="/"
                            style={{
                                textDecoration: "none",
                                textTransform: "uppercase",
                                color: "white",
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    color: "#fff",
                                    borderRadius: 4,
                                    borderColor: "white",
                                }}
                            >
                                <AiOutlineArrowLeft /> Open Screen A
                            </Button>
                        </Link>
                    </Grid>

                    {processing && <LinearProgress />}
                    {/* <InfiniteScroll
                        dataLength={data.length}
                        next={nextData}
                        hasMore={hasMore}
                        height={400}
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>All results revealed.</b>
                            </p>
                        }
                        className="results-container screen-b"
                    > */}
                    <Box sx={{maxHeight: "500px",overflow: "auto"}} className="results-container screen-b">
                        <Typography
                            component="h5"
                            sx={{
                                fontWeight: 600,
                                bgcolor: "#311b92",
                                color: "white",
                                py: 2,
                                pl: 1,
                            }}
                        >
                            Total Results:{" "}
                            <Typography
                                component="span"
                                sx={{ color: "#5bbc2e", fontWeight: 600 }}
                            >
                                {results.length}
                            </Typography>{" "}
                        </Typography>
                        <div className="results mt-3">
                            {results.map((result, index) => (
                                <Box
                                    className="result"
                                    key={index}
                                    sx={{
                                        mb: 1,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography component="span">
                                            = {result.result}
                                        </Typography>
                                        <Typography
                                            component="strong"
                                            sx={{
                                                mb: 0,
                                                ml: 3,
                                                fontWeight: 500,
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {result.title}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            px: 4,
                                            borderRadius: 4,
                                            bgcolor: "greenyellow",
                                        }}
                                        onClick={() =>
                                            handleClickOpen(result.input)
                                        }
                                    >
                                        See Input
                                    </Button>
                                </Box>
                            ))}
                        </div>
                    {/* </InfiniteScroll> */}
                    </Box>
                </Paper>
            </Grid>
            <ShowInput
                content={listContent}
                open={open}
                onClose={handleClose}
            />
        </>
    );
};

export default ScreenB;
