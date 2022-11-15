import './App.css';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home.js';
import Auth from './pages/Auth.js';
import Register from './pages/Register.js';
import BookingCar from './pages/BookingCar.js';
import Welcome from './pages/Welcome';

axios.defaults.withCredentials = true;

const userReducer = (state, action) => {
  switch (action.type) {
    case 'USER_FETCH_INIT':
      return { ...state, isLoading: true, isError: false, token: false, data: {} };
    case 'USER_FETCH_SUCCESS':
      return { ...state, isLoading: false, isError: false, token: true, data: action.payload };
    case 'USER_FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true, token: false };
    default:
      throw new Error();
  }
};



function App() {
  // const [isSignUp, setIsSignUp] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [combined, setCombined] = useState({
    isSignUp: false,
    isLoggedIn: false,
    token: false,
    userinfo:''
  });

  const { isSignUp, isLoggedIn ,token,userinfo} = combined
  const [user, dispatchUser] = useReducer(userReducer, {
    data: {},
    isLoading: false,
    isError: false,
    token: false,
  });

  console.log('Token exisits & has the user loaded? ' + token);
  console.log('Login Status ' + isLoggedIn);

  useEffect(() => {
    setCombined((prev) => ({
      ...prev,
      isLoggedIn: window.localStorage.getItem("isLoggedIn"),
      token: window.localStorage.getItem("token"),
      userinfo: JSON.parse(window.localStorage.getItem("userinfo"))
    }))
  }, []);

  useEffect(() => { 
    window.localStorage.setItem("isLoggedIn",isLoggedIn)
    window.localStorage.setItem("token",token)
    window.localStorage.setItem("userinfo",JSON.stringify(userinfo))
    
    
  },[isLoggedIn,token,userinfo])

  async function sendUserRequest() {
    try {
      // Initial Stage: On Page Load
   
      
      const res = await axios.get('http://localhost:3300/api/user/user', {
        withCredentials: true,
      })
      if (res.data) {
        setCombined((prev) => ({
          ...prev,
          userinfo: res.data.user,
          token: true
         
        }))
        dispatchUser({
          type: 'USER_FETCH_SUCCESS',
          payload: res.data.user
        });
       
      }
    } catch (error) {
      console.log(error);
      dispatchUser({ type: 'USER_FETCH_FAILURE' });
        setCombined((prev) => ({
          ...prev,
          isLoggedIn: false,
          token:false
        }))
    }

  }


  useEffect(() => {
    console.log("working on page------------------------");
    sendUserRequest()
  }, [isLoggedIn]);


  return (
    <React.Fragment>
      <header className='header'>
        <Header
          
          setCombined={setCombined}
          combined={combined}
        />
      </header>
      <main className='main'>
        <Routes>
          <Route path="/" element={<Home />}
            isLoggedIn={isLoggedIn} />
          <Route path="/auth" element={<Auth
            isSignUp={isSignUp}
            setCombined={setCombined}
            isLoggedIn={isLoggedIn}
          />} />

          <Route path="/register" element={<Register />} />
          <Route path="/booking/:id" element={<BookingCar />} />
          <Route path="/getUser" element={<Welcome isLoggedIn={isLoggedIn} />} />
        </Routes>
      </main>
      <footer className='footer'>
        <p>@balaji</p>
      </footer>
    </React.Fragment>
  );
}

export default App;
