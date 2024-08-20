"use client";

import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  CardActionArea,
  useTheme,
  Grow,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { Flip, AutoAwesome, Save } from "@mui/icons-material";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [text, setText] = useState("");
  const [flipped, setFlipped] = useState({});
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcards collection with the same name already exists");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Generate Flashcards
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
            background: theme.palette.background.paper,
          }}
        >
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter your text here"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            disabled={isGenerating}
            startIcon={<AutoAwesome />}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
              },
            }}
          >
            {isGenerating ? "Generating..." : "Generate Flashcards"}
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: theme.palette.secondary.main,
              textAlign: "center",
              mb: 4,
            }}
          >
            Generated Flashcards
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grow
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                {...{ timeout: 1000 + index * 100 }}
                key={index}
              >
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: 200,
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handleCardClick(index)}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.6s",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      }}
                    >
                      <CardContent
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 2,
                          backgroundColor: theme.palette.background.paper,
                        }}
                      >
                        <Typography
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                          }}
                          variant="body1"
                        >
                          {flashcard.front}
                        </Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 2,
                          backgroundColor: theme.palette.secondary.light,
                          color: theme.palette.secondary.contrastText,
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <Typography variant="body1">
                          {flashcard.back}
                        </Typography>
                      </CardContent>
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        zIndex: 1,
                      }}
                    >
                      <Flip fontSize="small" color="action" />
                    </Box>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
          {flashcards.length > 0 && (
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
                startIcon={<Save />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Save Flashcards
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
