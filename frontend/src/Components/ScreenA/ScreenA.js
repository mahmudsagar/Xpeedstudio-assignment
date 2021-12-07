import "../Screen.css";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiFillFileText } from "react-icons/ai";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
    Alert,
    AlertTitle,
    Grid,
    LinearProgress,
    Paper,
    TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import ShowInput from "./../ShowInput/ShowInput";

const ScreenA = ({
    results,
    setResults,
    socket,
    processing,
    setProcessing,
}) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [calcTitle, setCalcTitle] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [fileName, setFileName] = useState("");
    const [emptyError, setEmptyError] = useState(false);
    const [invalidError, setInvalidError] = useState(false);
    const [invalidExpressionError, setInvalidExpressionError] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [listContent, setListContent] = useState("");

    const handleSubmission = (e) => {
        e.preventDefault();

        if (fileContent === "") {
            setEmptyError(true);
        } else {
            if (
                /[^0-9-+*/.]/.test(fileContent) ||
                !/(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/.test(
                    fileContent
                )
            ) {
                setInvalidError(true);
            } else {
                socket.emit("calculate", {
                    title: calcTitle,
                    input: fileContent,
                });
                setProcessing(true);
                e.target.reset();
                setFileName("");
                setFileContent("");
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
        const items = Array.from(results);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setResults(items);

        //update db collection for every reordering
        socket.emit("updateResults", { results: items });
    }
    const handleClickOpen = (data) => {
        setOpen(true);
        setListContent(data);
    };
    const handleClose = (value) => {
        setOpen(false);
        setListContent(value);
    };
    useEffect(() => {
        if (acceptedFiles[0]) handleFileChosen(acceptedFiles[0]);
    }, [acceptedFiles]);

    return (
        <>
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
                    <Link
                        to="/screenB"
                        style={{
                            textDecoration: "none",
                            textTransform: "uppercase",
                            color: "#fff",
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
                            Open Screen B <AiOutlineArrowRight />
                        </Button>
                    </Link>
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
                                    <Box
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
                                                        className="result"
                                                        sx={{
                                                            mb: 1,
                                                            px: 2,
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Typography component="span">
                                                                ={" "}
                                                                {result.result}
                                                            </Typography>
                                                            <Typography
                                                                component="strong"
                                                                sx={{
                                                                    mb: 0,
                                                                    ml: 3,
                                                                    fontWeight: 500,
                                                                    textTransform:
                                                                        "capitalize",
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
                                                                bgcolor:
                                                                    "greenyellow",
                                                            }}
                                                            onClick={() =>
                                                                handleClickOpen(
                                                                    result.input
                                                                )
                                                            }
                                                        >
                                                            See Input
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Box>
                </Box>
                <Box className="input-container" sx={{ p: 2 }}>
                    <Typography
                        component="h5"
                        sx={{ fontWeight: 600, fontSize: "1.3rem", mb: 2 }}
                    >
                        Input
                    </Typography>
                    <Box>
                        <form onSubmit={handleSubmission}>
                            <TextField
                                fullWidth
                                type="text"
                                label="Title"
                                onChange={(e) => setCalcTitle(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                                placeholder="Calculation Title"
                            />

                            <Box
                                {...getRootProps({ className: "dropzone" })}
                                sx={{ border: 1, borderRadius: 1, mb: 2 }}
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

                            {emptyError ? (
                                <Alert
                                    onClose={() => {
                                        setEmptyError(false);
                                    }}
                                    severity="error"
                                >
                                    <AlertTitle>File Not Found!</AlertTitle>
                                    Upload/Drop a valid{" "}
                                    <strong>.txt file.</strong>
                                </Alert>
                            ) : invalidError ? (
                                <Alert
                                    onClose={() => {
                                        setInvalidError(false);
                                    }}
                                    severity="error"
                                >
                                    <AlertTitle>Invalid File!</AlertTitle>
                                    Choose a valid .txt file{" "}
                                    <strong>
                                        Allowed Characters: [0-9, +, -, *, /]"
                                    </strong>
                                </Alert>
                            ) : (
                                invalidExpressionError && (
                                    <Alert
                                        onClose={() => {
                                            setInvalidExpressionError(false);
                                        }}
                                        severity="error"
                                    >
                                        <AlertTitle>
                                            Invalid Expression!
                                        </AlertTitle>
                                        Choose a valid .txt file
                                    </Alert>
                                )
                            )}
                            {processing ? (
                                <>
                                    <LinearProgress />
                                    <Typography component="div" sx={{ my: 2 }}>
                                        {" "}
                                        Please Wait 15s.{" "}
                                        <strong>Calculating...</strong>
                                    </Typography>
                                </>
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
            <ShowInput
                content={listContent}
                open={open}
                onClose={handleClose}
            />
        </>
    );
};

export default ScreenA;
