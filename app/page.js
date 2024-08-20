"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { School, TextSnippet, DevicesOther } from "@mui/icons-material";
import getStripe from "./utils/get-stripe";

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleGetStartedClick = () => {
    router.push("/generate");
  };

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.log(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Head>
        <title>FlashMind AI</title>
        <meta
          name="description"
          content="Create flashcards from your text using AI."
        />
      </Head>

      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            FlashMind AI
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ mr: 1 }}>
              Login
            </Button>
            <Button color="inherit" variant="outlined" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundImage: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{ fontWeight: "bold", color: "white" }}
        >
          Welcome to FlashMind AI.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, color: "white" }}>
          The easiest way to make flashcards from your text using OpenAI.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleGetStartedClick}
          sx={{
            py: 1.5,
            px: 4,
            fontSize: "1.2rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
            },
          }}
        >
          Get Started
        </Button>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ my: 8, textAlign: "center" }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ mb: 6, fontWeight: "bold" }}
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <TextSnippet fontSize="large" />,
                title: "Easy text input",
                description:
                  "Simply input your text and let our software do the rest.",
              },
              {
                icon: <School fontSize="large" />,
                title: "Smart Flashcards",
                description:
                  "Our AI intelligently breaks down your text into concise flashcards, perfect for studying.",
              },
              {
                icon: <DevicesOther fontSize="large" />,
                title: "Accessible anywhere",
                description: "Access your flashcards from any device, anytime.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 3 },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    {feature.icon}
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ mt: 2, mb: 1, fontWeight: "bold" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ my: 8, textAlign: "center" }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ mb: 6, fontWeight: "bold" }}
          >
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "Basic",
                price: "$5",
                features: [
                  "Access to basic flashcard features",
                  "Limited storage",
                  "Email support",
                ],
                buttonText: "Choose Basic",
                onClick: () => {},
              },
              {
                title: "Pro",
                price: "$10",
                features: [
                  "Unlimited flashcards",
                  "Unlimited storage",
                  "Priority support",
                  "Advanced AI features",
                ],
                buttonText: "Choose Pro",
                onClick: handleSubmit,
                highlighted: true,
              },
            ].map((plan, index) => (
              <Grid item xs={12} sm={6} md={5} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "0.3s",
                    transform: plan.highlighted ? "scale(1.05)" : "none",
                    boxShadow: plan.highlighted ? 3 : 1,
                    "&:hover": {
                      transform: plan.highlighted
                        ? "scale(1.07)"
                        : "scale(1.02)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", mb: 2 }}
                    >
                      {plan.title}
                    </Typography>
                    <Typography variant="h3" color="primary" sx={{ mb: 2 }}>
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      per month
                    </Typography>
                    {plan.features.map((feature, featureIndex) => (
                      <Typography key={featureIndex} sx={{ mb: 1 }}>
                        {feature}
                      </Typography>
                    ))}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button
                      variant={plan.highlighted ? "contained" : "outlined"}
                      color="primary"
                      onClick={plan.onClick}
                      sx={{ px: 4, py: 1.5, fontSize: "1rem" }}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}
