import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import CarPreview from '../components/CarPreview';

const carsReducer = (state, action) => {
  switch (action.type) {
    case 'CARS_FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'CARS_FETCH_SUCCESS':
      return { ...state, isLoading: false, isError: false, data: action.payload };
    case 'CARS_FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};


function Home() {

  const [cars, dispatchCars] = useReducer(carsReducer, {
    data: [],
    isLoading: false,
    isError: false
  });


  async function sendCarsRequest() {
    let res = await axios.get('http://localhost:3300/api/cars/')
      .catch(err => dispatchCars({ type: 'CARS_FETCH_FAILURE' }));

    let data = null;
    if (!res) data = null;
    if (res && res.hasOwnProperty('data')) data = await res.data;

    return data
  }

  useEffect(() => {

    //Initial Stage: On Page Load
    dispatchCars({ type: 'CARS_FETCH_INIT' });

    //Sending Cars Request: 
    sendCarsRequest().then(data => {
      (data) && dispatchCars({
        type: 'CARS_FETCH_SUCCESS',
        payload: data.cars
      });
    });

  }, []);


  return (
    <div className="container">
      <div className="cars-container">
        {(cars.isLoading) ? <h1>Loading..!</h1> :
          cars.data.map((car, index) => {
            return (<CarPreview
              className="car-item"
              key={index}
              carID={car._id}
              carName={car.name}
              image={car.image}
              rentPerHour={car.rentPerHour}
              fuelType={car.fuelType}
              capacity={car.capacity}
            />);
          })}
      </div>
    </div>
  )
}

export default Home;