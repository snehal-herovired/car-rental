import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useState, useReducer, useEffect } from 'react';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const errorReducer = (state, action) => {
  switch (action.type) {
    case 'NAME':
      return { ...state, name: true };
    case 'EMAIL':
      return { ...state, email: true };
    case 'PASSWORD':
      return { ...state, password: true };
    case 'PROFILE':
      return { ...state, profile: true };
    case 'RESET':
      return { name: false, email: false, password: false, profile: false };
    default:
      throw new Error();
  }
};

function Auth(props) {
  const navigate = useNavigate();
  const {setCombined} =props

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    profile: "",
  });

  const [errorState, dispatchErrorState] = useReducer(errorReducer, {
    name: false,
    email: false,
    password: false,
    profile: false
  });

  const [errEmailMessage, setErrEmailMessage] = useState('');
  const [errPasswordMessage, setErrPasswordMessage] = useState('');
  const [accountCreationStatus, setAccountCreationStatus] = useState(false);


  function resetState() {
    props.setIsSignUp(!props.isSignUp);
    setInputs({ name: '', email: '', password: '', profile: '' });
    dispatchErrorState({ type: 'RESET' });
    setAccountCreationStatus(false);
  }

  function handleChange(e) {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    dispatchErrorState({ type: 'RESET' });
  }

  async function sendRequest() {

    if (props.isSignUp) {
      const res = await axios.post('http://localhost:3300/api/user/signup', {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
        profile: inputs.profile
      }).catch((err) => {
        let errData = err.response.data;
        errData.errStatus = err.response.status;
        errData.hasAnError = true;
        return errData;
      });

      let data;
      if (!res.hasAnError) {
        data = await res.data;
        data.resStatus = await res.status;
      } else if (res.hasAnError) {
        data = res;
      }
      return data;
    }
    else {
      const res = await axios.post('http://localhost:3300/api/user/login', {
        email: inputs.email,
        password: inputs.password
      }).catch((err) => {
        let errData = err.response.data;
        errData.errStatus = err.response.status;
        errData.hasAnError = true;
        return errData;
      });

      let data;
      if (!res.hasAnError) {
        data = await res.data;
        data.resStatus = await res.status;
      } else if (res.hasAnError) {
        data = res;
      }

      return data;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let formHasError = false;

    if (props.isSignUp) {
      if (inputs.name === '') dispatchErrorState({ type: 'NAME' });
      if (inputs.email === '') {
        dispatchErrorState({ type: 'EMAIL' });
        setErrEmailMessage('Enter a Valid Email ID');
      }
      if (inputs.password === '' || inputs.password.length < 6) {
        dispatchErrorState({ type: 'PASSWORD' });
        setErrPasswordMessage('Enter a Valid Password of Minimum 6 charecters');
      }
      if (inputs.profile === '') dispatchErrorState({ type: 'PROFILE' });

      if (inputs.name === '' || inputs.email === '' ||
        inputs.password === '' || inputs.profile === '') formHasError = true;
    }
    else {
      if (inputs.email === '') dispatchErrorState({ type: 'EMAIL' });
      if (inputs.password === '') dispatchErrorState({ type: 'PASSWORD' });

      if (inputs.email === '' || inputs.password === '') formHasError = true;
    }

    if (formHasError === false) {
      sendRequest().then((data) => {
        if (props.isSignUp) {
          if (data.hasOwnProperty('resStatus') && (data.resStatus === 200) && (data.email === 'true')) {
            setCombined((prev) => ({
              ...prev,
              isSignUp: false
            }))
            setAccountCreationStatus(true);
            navigate('/auth');
          }
          else if (data.hasOwnProperty('errStatus') && (data.errStatus === 400) && (data.email === 'false')) {
            dispatchErrorState({ type: 'EMAIL' });
            setErrEmailMessage(`${data.message}`)
          }
        }
        else {
          if (data.hasOwnProperty('resStatus')
            && (data.resStatus === 200)
            && (data.email === 'true')
            && (data.password === 'true')) {
            setAccountCreationStatus(false);
            setCombined((prev) => ({
              ...prev,
            isLoggedIn: true
            }))
            navigate('/');
          }
          else if (data.hasOwnProperty('errStatus')
            && (data.errStatus === 400)
            && (data.email === 'false')
            && (data.password === 'false')) {
            dispatchErrorState({ type: 'EMAIL' });
            setErrEmailMessage(`${data.message}`)
          }
          else if (data.hasOwnProperty('errStatus')
            && (data.errStatus === 400)
            && (data.email === 'true')
            && (data.password === 'false')) {
            dispatchErrorState({ type: 'PASSWORD' });
            setErrPasswordMessage(`${data.message}`)
          }
        }
      });
    }

  }


  return (
    <div>
      {(accountCreationStatus) && <Typography
        variant='h5'
        padding={3}
        textAlign={'center'}> Account Created Sucessfully. Please Login!!! </Typography>}
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          margin={'auto'}
          flexDirection={'column'}
          borderRadius={5}
          maxWidth={400}
          padding={3}
          boxShadow={"5px 5px 10px #ccc"}
          alignItems="center"
          marginTop={5}
          sx={{ ":hover": { boxShadow: '10px 10px 20px #ccc' } }}
        >

          <Typography
            variant='h3'
            padding={3}
            textAlign={'center'}> {props.isSignUp ? 'Sign Up' : 'Login'} </Typography>

          {props.isSignUp &&
            <TextField
              margin='normal'
              fullWidth
              name='name'
              type={'text'}
              variant='outlined'
              label="Name"
              value={inputs.name}
              onChange={handleChange}
              error={errorState.name}
              helperText={errorState.name ? 'Enter a valid Username' : ' '}
            />}

          <TextField
            margin='normal'
            fullWidth
            name='email'
            type={'email'}
            variant='outlined'
            label="Email"
            value={inputs.email}
            onChange={handleChange}
            error={errorState.email}
            helperText={errorState.email ? errEmailMessage : ' '}
          />

          <TextField
            margin='normal'
            fullWidth
            name='password'
            type={'password'}
            variant='outlined'
            label="Password"
            value={inputs.password}
            onChange={handleChange}
            error={errorState.password}
            helperText={errorState.password ? errPasswordMessage : ' '}
          />
          {props.isSignUp &&
            <FormControl id="profile" margin='normal' fullWidth error={errorState.profile}>
              <InputLabel>I am an</InputLabel>
              <Select
                name="profile"
                id="profile-select"
                labelId="profile"
                label="I am an"
                onChange={handleChange}
                value={inputs.profile}
              >
                <MenuItem value={"admin"}>Admin</MenuItem>
                <MenuItem value={"owner"}>Owner</MenuItem>
                <MenuItem value={"customer"}>Customer</MenuItem>
              </Select>
              <FormHelperText>
                {errorState.profile ? 'Select a valid Profile' : 'Choose a Suitable Profile'}
              </FormHelperText>
            </FormControl>
          }

          <Button
            endIcon={props.isSignUp ? <HowToRegOutlinedIcon /> : <LoginOutlinedIcon />}
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant='contained'
            color='warning'
            type='submit'
          >
            {props.isSignUp ? 'Register' : 'Login'}
          </Button>

          <Button
            endIcon={props.isSignUp ? <LoginOutlinedIcon /> : <HowToRegOutlinedIcon />}
            sx={{ marginTop: 3, borderRadius: 3, fontSize: 'large', textTransform: "none" }}
            onClick={resetState}
          >
            {props.isSignUp ? 'Change to Login' : 'Change to Sign Up'}
          </Button>
        </Box>
      </form>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  )
}

export default Auth;