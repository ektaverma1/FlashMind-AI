"use client";
import React from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Toolbar,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

export default function AuthPage({ mode = "signIn" }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "transparent" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            FlashMind AI
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" underline="none" color="inherit">
              Login
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" underline="none" color="inherit">
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              mb: 3,
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LockOutlined sx={{ color: theme.palette.primary.contrastText }} />
          </Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            {mode === "signIn" ? "Sign In" : "Sign Up"}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              mb: 3,
              textAlign: "center",
              color: theme.palette.text.secondary,
            }}
          >
            {mode === "signIn"
              ? "Welcome back! Please sign in to continue."
              : "Create an account to get started with FlashMind AI."}
          </Typography>
          {mode === "signIn" ? <SignIn /> : <SignUp />}
        </Paper>
      </Container>

      <Box sx={{ mt: "auto", py: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} FlashMind AI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
