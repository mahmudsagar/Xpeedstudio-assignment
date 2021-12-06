import React, { useEffect, useState } from "react";
import ScreenA from "./ScreenA/ScreenA";
import ScreenB from "./ScreenB/ScreenB";
import ShowInput from "./ShowInput/ShowInput";
import socketIOClient from "socket.io-client";
// import ProgressModal from "./ProgressModal/ProgressModal";
import { useLocation } from "react-router";
import { Button, Grid, Typography } from "@mui/material";

const ENDPOINT = "http://localhost:5000";

const Home = () => {
    let socket = socketIOClient(ENDPOINT);
    const [results, setResults] = useState([]);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        socket.on("connection", () => {
            console.log("Connected...");

            fetch("http://localhost:5000/calculations")
                .then((res) => res.json())
                .then((data) => {
                    setResults(data.allResults);
                });
        });

        socket.on("result", (data) => {
            if (data.status === "ok") {
                setResults((results) => [...results, data.result]);
            }
            setProcessing(false);
        });

        socket.on("allResults", (data) => {
            setResults(data[0].allResults);
        });
    }, []);

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
                <ScreenA
                    results={results}
                    setResults={setResults}
                    socket={socket}
                    processing={processing}
                    setProcessing={setProcessing}
                ></ScreenA>
            </Grid>
        </>
    );
};

export default Home;
