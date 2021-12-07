import React, { useEffect, useState } from "react";
import ScreenA from "./ScreenA/ScreenA";
import socketIOClient from "socket.io-client";
import { Grid } from "@mui/material";

const ENDPOINT = "http://localhost:5000";

const Home = () => {
    let socket = socketIOClient(ENDPOINT);
    const [results, setResults] = useState([]);

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
            setResults((results) => [...results, data])
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
