"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Button,
  CircularProgress,
  Grow,
} from "@mui/material";
import { ArrowBack, Flip } from "@mui/icons-material";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      setLoading(true);
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);

      const flashcardsData = [];

      docs.forEach((doc) => {
        flashcardsData.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcardsData);
      setLoading(false);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = () => {
    setFlipped((prev) => ({
      ...prev,
      [currentCardIndex]: !prev[currentCardIndex],
    }));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setFlipped({});
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
    setFlipped({});
  };

  const handleBackToSets = () => {
    router.push("/flashcards");
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToSets}
          sx={{ mb: 4 }}
        >
          Back to Flashcard Sets
        </Button>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            textAlign: "center",
          }}
        >
          {search} Flashcards
        </Typography>

        {flashcards.length > 0 ? (
          <Grow in={true}>
            <Card
              sx={{
                height: 300,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={handleCardClick}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  perspective: "1000px",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transition: "transform 0.6s",
                    transformStyle: "preserve-3d",
                    transform: flipped[currentCardIndex]
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
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 3,
                    }}
                  >
                    <Typography variant="h5" component="div" align="center">
                      {flashcards[currentCardIndex].front}
                    </Typography>
                  </CardContent>
                  <CardContent
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: theme.palette.secondary.light,
                      color: theme.palette.secondary.contrastText,
                      transform: "rotateY(180deg)",
                      padding: 3,
                    }}
                  >
                    <Typography variant="h5" component="div" align="center">
                      {flashcards[currentCardIndex].back}
                    </Typography>
                  </CardContent>
                </Box>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                }}
              >
                <Flip />
              </Box>
            </Card>
          </Grow>
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No flashcards found in this set.
          </Typography>
        )}

        {flashcards.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button onClick={handlePrevCard} variant="outlined">
              Previous
            </Button>
            <Typography variant="body1">
              {currentCardIndex + 1} / {flashcards.length}
            </Typography>
            <Button onClick={handleNextCard} variant="outlined">
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
