"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  useTheme,
  Grow,
  Button,
} from "@mui/material";
import { LibraryBooks, Add } from "@mui/icons-material";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleCreateNewSet = () => {
    router.push("/generate");
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6, mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            textAlign: "center",
          }}
        >
          Your Flashcard Sets
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: "center",
            color: theme.palette.text.secondary,
            mb: 4,
          }}
        >
          Review and manage your flashcard collections
        </Typography>

        {flashcards.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <LibraryBooks
              sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }}
            />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.text.secondary }}
            >
              You don't have any flashcard sets yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleCreateNewSet}
              sx={{ mt: 2 }}
            >
              Create New Set
            </Button>
          </Box>
        ) : (
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
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleCardClick(flashcard.name)}
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        p: 3,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          component="div"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          {flashcard.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click to review this set
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        )}

        {flashcards.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleCreateNewSet}
            >
              Create New Set
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
