import React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useUserStore } from "../zustand/store/UserStore";
import { useTheme, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation

// Spotify colors
const spotifyColors = {
  primary: '#1DB954',
  background: '#191414',
  text: '#FFFFFF',
};

const providers = [
  { id: 'credentials', name: 'Username and password' }, // Updated to say "Username and password"
  { id: 'google', name: 'Google' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitter', name: 'Twitter' },
];

function CombinedSignInPage() {
  const navigate = useNavigate();

  const signIn = async (provider, formData) => {
    if (provider.id === 'credentials') {
      const username = formData?.get('email'); // Updated to use "username" instead of "email"
      const password = formData?.get('password');

      const urlEncodedBody = new URLSearchParams();
      urlEncodedBody.append('username', username); // Updated to send "username"
      urlEncodedBody.append('password', password);

      try {
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: urlEncodedBody.toString(),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Incorrect username or password.');
        }

        // Fetch the current user after successful login
        const fetchCurrentUser = useUserStore.getState().restoreUserFromSession;
        await fetchCurrentUser();

        console.log("Stored user:", useUserStore.getState().currentUser);

        navigate('/'); // Redirect to the home page
        return { type: 'CredentialsSignin' };
      } catch (error) {
        console.error("Login error:", error.message);
        return { type: 'CredentialsSignin', error: error.message };
      }
    }
  };

  // Spotify theme
  const theme = createTheme({
    palette: {
      primary: { main: spotifyColors.primary },
      background: { default: spotifyColors.background },
      text: { primary: spotifyColors.background },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: spotifyColors.background,
            color: spotifyColors.text,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: spotifyColors.primary,
            color: '#fff',
            '&:hover': { backgroundColor: '#1ed760' },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { color: spotifyColors.text },
          input: {
            backgroundColor: 'white',
            color: '#333',
            padding: '12px',
            borderRadius: '4px',
          },
        },
      },
    },
  });

  return (
    <AppProvider theme={theme}>
      <CssBaseline />
      <SignInPage
        providers={providers}
        signIn={signIn}
        slotProps={{
          emailField: { label: 'Username', autoFocus: true }, // Updated label to "Username"
          form: { noValidate: true },
        }}
      />
      {/* Add the signup link manually below the SignInPage */}
      <div style={{ textAlign: 'center', marginTop: '-10%' }}>
        <p style={{ color: spotifyColors.text }}>
          Don't have an account? <Link to="/signup" style={{ color: spotifyColors.primary }}>Sign up</Link>
        </p>
      </div>
    </AppProvider>
  );
}

export default CombinedSignInPage;