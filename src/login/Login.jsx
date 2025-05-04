// login/CombinedSignInPage.jsx
import React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useUserStore } from "../zustand/store/UserStore";
import { useTheme, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useNavigate } from "react-router-dom"; // <-- import useNavigate

// Spotify colors
const spotifyColors = {
  primary: '#1DB954',
  background: '#191414',
  text: '#FFFFFF',
};

const providers = [
  { id: 'credentials', name: 'Email and password' },
  { id: 'google', name: 'Google' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitter', name: 'Twitter' },
];

// Move signIn inside the component to access navigate
function CombinedSignInPage() {
  const navigate = useNavigate(); // <-- useNavigate here

  const signIn = async (provider, formData) => {
    if (provider.id === 'credentials') {
      const username = formData?.get('email');
      const password = formData?.get('password');

      const urlEncodedBody = new URLSearchParams();
      urlEncodedBody.append('username', username);
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

        if (response.ok) {
          const fetchCurrentUser = useUserStore.getState().fetchCurrentUser;
          await fetchCurrentUser();

          console.log("Stored user:", useUserStore.getState().currentUser);

          navigate('/'); 
          return { type: 'CredentialsSignin' };
        }
      } catch (error) {
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
          emailField: { autoFocus: true },
          form: { noValidate: true },
        }}
      />
    </AppProvider>
  );
}

export default CombinedSignInPage;
