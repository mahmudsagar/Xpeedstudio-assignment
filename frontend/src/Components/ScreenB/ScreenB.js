import "../Screen.css";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ScreenA from "../ScreenA/ScreenA";
import ShowInput from "../ShowInput/ShowInput";
import socketIOClient from "socket.io-client";
// import ProgressModal from "./ProgressModal/ProgressModal";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { AiOutlineArrowLeft } from "react-icons/ai";
const ENDPOINT = "http://localhost:5000";

const ScreenB = () => {
    const [hasMore, sethasMore] = useState(true);
    const [page, setPage] = useState(7);
    const [data, setData] = useState([]);
    let socket = socketIOClient(ENDPOINT);
    const [results, setResults] = useState([]);
    const [show, setShow] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [content, setContent] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        socket.on("connection", () => {
            console.log("Connected...");

            fetch("http://localhost:5000/results")
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
            setUpdating(false);
        });
    }, []);

    useEffect(() => {
        if (results.length > 6) setData([...results.slice(0, page)]);
        else setData(results);
        if (page === results.length) {
            sethasMore(false);
            return;
        } else sethasMore(true);
    }, [results, page]);

    const showInput = (inputContent) => {
        setContent(inputContent);
        handleShow();
    };
    const nextData = () => setPage(page + 1);

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
                        <Button
                            variant="outlined"
                            sx={{
                                color: "#fff",
                                borderRadius: 4,
                                borderColor: "white",
                            }}
                        >
                            <Link
                                to="/"
                                style={{
                                    textDecoration: "none",
                                    textTransform: "uppercase",
                                    color: "white"
                                }}
                            >
                                <AiOutlineArrowLeft /> Open Screen A
                            </Link>
                        </Button>
                    </Grid>
                    <InfiniteScroll
                        dataLength={data.length}
                        next={nextData}
                        hasMore={hasMore}
                        height={600}
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>All results revealed.</b>
                            </p>
                        }
                        className="results-container screen-b"
                    >
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
                            {data.map((result, index) => (
                                <div
                                    key={`key-${index}`}
                                    className="result mb-3 d-flex align-items-center justify-content-between"
                                >
                                    <div className="d-flex align-items-center">
                                        <span>= {result.result}</span>
                                        <h6 className="mb-0 ms-3">
                                            {result.title}
                                        </h6>
                                    </div>
                                    <button
                                        className="btn rounded-pill px-4"
                                        onClick={() => showInput(result.input)}
                                    >
                                        See Input
                                    </button>
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>
                </Paper>
            </Grid>
        </>
    );
};

export default ScreenB;
