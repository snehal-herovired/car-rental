import React, { useEffect, useReducer, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const carReducer = (state, action) => {
  switch (action.type) {
    case 'CAR_FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'CAR_FETCH_SUCCESS':
      return { ...state, isLoading: false, isError: false, data: action.payload };
    case 'CAR_FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};


function BookingCar(props) {

  const carID = useParams().id;

  const [car, dispatchCar] = useReducer(carReducer, {
    data: {},
    isLoading: false,
    isError: false,
  });

  const [errMessage, setErrMessage] = useState('');

  async function sendCarRequest() {
    const res = await axios.get(`http://localhost:3300/api/cars/${carID}`, {
      withCredentials: true,
    }).catch(err => {
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

  useEffect(() => {
    dispatchCar({ type: 'CAR_FETCH_INIT' });

    sendCarRequest().then(data => {
      if (data.hasOwnProperty('resStatus') && (data.resStatus === 200) && (data.status === true)) {
        dispatchCar({
          type: 'CAR_FETCH_SUCCESS',
          payload: data.car
        });
      }
      else if (data.hasOwnProperty('errStatus') && (data.errStatus === 404) && (data.status === false)) {
        dispatchCar({ type: 'CAR_FETCH_FAILURE' });
        setErrMessage('Sorry, Car Not found');
      }
      else if (data.hasOwnProperty('errStatus') && (data.errStatus === 400) && (data.status === false)) {
        dispatchCar({ type: 'CAR_FETCH_FAILURE' });
        setErrMessage('Sorry, Wrong ID');
      }
    });

  }, [])

  return (
    <div>
      <h1>Booking Car</h1>
      < h1 > Car ID: {carID}</h1>
      {(car.isError) &&
        < h1 > {errMessage}</h1>
      }
      {(car.isLoading) ? <CircularProgress /> :
        <Grid container spacing={10} sx={{'margin' : '25px'}}>
          
          <Grid item md={6} xs={12}>
            <img src={car.data.image} height='300vh' width='500vw' />
          </Grid>
          <Grid item md={6} xs={12}>
            <h1>{car.data.name} </h1>
            <h1>{car.data.rentPerHour}</h1>
            <h2>{car.data.fuelType}</h2>
          </Grid>
        </Grid>
      }
    </div >
  )
}

export default BookingCar;