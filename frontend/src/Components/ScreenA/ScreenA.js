import "../Screen.css";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiFillFileText } from "react-icons/ai";
import swal from "sweetalert";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Grid, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

const ScreenA = ({
    results,
    setResults,
    setContent,
    handleShow,
    socket,
    processing,
    setProcessing,
    setUpdating,
}) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [calcTitle, setCalcTitle] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        if (acceptedFiles[0]) handleFileChosen(acceptedFiles[0]);
    }, [acceptedFiles]);

    function calculateInput(fn) {
        return new Function("return " + fn)();
    }

    const handleSubmission = (e) => {
        e.preventDefault();

        if (fileContent === "") {
            swal({
                title: "File Not Found!",
                text: "Upload/Drop a valid .txt file.",
            });
        } else {
            if (
                /[^0-9-+*/.]/.test(fileContent) ||
                !/(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/.test(
                    fileContent
                )
            ) {
                swal({
                    title: "Invalid File!",
                    text: "Choose a valid .txt file. Allowed Characters: [0-9, +, -, *, /]",
                    icon: "error",
                });
            } else {
                try {
                    calculateInput(fileContent);
                    setProcessing(true);
                    socket.emit("calculate", {
                        title: calcTitle,
                        input: fileContent,
                    });
                    e.target.reset();
                    setFileName("");
                    setFileContent("");
                } catch {
                    swal({
                        title: "Invalid Expression!",
                        text: "Upload/Drop a .txt file with valid expression.",
                    });
                }
            }
        }
    };

    let fileReader;

    const handleFileRead = (e) => {
        setFileContent(fileReader.result);
    };

    const handleFileChosen = (file) => {
        setFileName(file.name);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        setUpdating(true);
        const items = Array.from(results);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setResults(items);

        //update db collection for every reordering
        socket.emit("updateResults", { results: items });
    }
    const showInput = (inputContent) => {
        setContent(inputContent);
        handleShow();
    };

    return (
        <Paper
            elevation={8}
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
                    Screen A
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
                        to="/screenB"
                        style={{
                            textDecoration: "none",
                            textTransform: "uppercase",
                            color: "#fff",
                        }}
                    >
                        Open Screen B <AiOutlineArrowRight />
                    </Link>
                </Button>
            </Grid>
            <Box sx={{ pb: 2 }} className="results-container screen-a">
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
                <Box sx={{ mt: 3 }} className="results">
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                            {(provided) => (
                                <div
                                    className="characters"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {provided.placeholder}
                                    {results.map((result, index) => (
                                        <Draggable
                                            key={index + 1}
                                            draggableId={`${index}-1`}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <Box
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    className="result mb-3 px-2 d-flex align-items-center justify-content-between"
                                                >
                                                    <Box className="d-flex align-items-center">
                                                        <span>
                                                            = {result.result}
                                                        </span>
                                                        <h6 className="mb-0 ms-3">
                                                            {result.title}
                                                        </h6>
                                                    </Box>
                                                    <button
                                                        className="btn rounded-pill px-4"
                                                        onClick={() =>
                                                            showInput(
                                                                result.input
                                                            )
                                                        }
                                                    >
                                                        See Input
                                                    </button>
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Box>
            </Box>
            <Box className="input-container" sx={{ p: 2 }}>
                <Typography
                    component="h5"
                    sx={{ fontWeight: 600, fontSize: "1.3rem" }}
                >
                    Input
                </Typography>
                <Box>
                    <form onSubmit={handleSubmission}>
                        <TextField
                            fullWidth
                            type="text"
                            label="Calculation Title"
                            onChange={(e) => setCalcTitle(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                            placeholder="Calculation Title"
                        />

                        <Box
                            {...getRootProps({ className: "dropzone" })}
                            sx={{ border: 1, borderRadius: 1 }}
                        >
                            <input
                                {...getInputProps()}
                                accept=".txt"
                                onChange={(e) =>
                                    handleFileChosen(e.target.files[0])
                                }
                            />
                            {fileName === "" ? (
                                <Typography sx={{ textAlign: "center" }}>
                                    <AiFillFileText />
                                    <br />
                                    Upload Or Drop your text file here
                                </Typography>
                            ) : (
                                <ul>{fileName}</ul>
                            )}
                        </Box>
                        {processing ? (
                            <Typography component="div" sx={{ my: 2 }}>
                                {" "}
                                Please Wait 15s. <strong>Calculating...</strong>
                            </Typography>
                        ) : (
                            <Button
                                variant="outlined"
                                type="submit"
                                sx={{
                                    my: 2,
                                    borderRadius: 4,
                                    color: "black",
                                    borderColor: "black",
                                }}
                            >
                                Calculate
                            </Button>
                        )}
                    </form>
                </Box>
            </Box>
        </Paper>
    );
};

export default ScreenA;
