import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as LinkRRD, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../redux/userSlice';
import { useState } from 'react';
import { useEffect } from 'react';



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <LinkRRD className='link' to="/" >
        Earth
      </LinkRRD>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {

  const navigate = useNavigate();

  const dispatch = useDispatch();
  var userData = useSelector((state) => state.user.userInfo);
  var pending = useSelector((state) => state.user.pending);
  var error = useSelector((state) => state.user.error);

  // console.log(userData,pending,error);
  useEffect(() => {
    if (userData && !pending && !error) {
      navigate("/");
    }
  }, [userData])

  // console.log(userData, pending, error);

  const [user, setUser] = useState({});
  const handleInput = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleEnterKeyPress = (event) => {
    if (event.key == "Enter") {
      handleLogin(event);
    }
  }
  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(fetchUser(user));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h2" margin={3}>
            The 🌍 app.
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            {/* <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}> */}
            <TextField
              onChange={handleInput}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              onChange={handleInput}
              margin="normal"
              required
              fullWidth
              onKeyUp={handleEnterKeyPress}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {error && <Typography color="red" component="p" align='center' variant="p">
              {error}
            </Typography>}
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {/* <LinkRRD className='link' to="/"> */}
            <Button
              onClick={handleLogin}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* </LinkRRD> */}
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <LinkRRD className='link2' to="/register" >
                  Don't have an account? Sign Up
                </LinkRRD>{' '}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}