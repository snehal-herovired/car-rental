import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const userReducer = (state, action) => {
    switch (action.type) {
        case 'USER_FETCH_INIT':
            return { ...state, isLoading: true, isError: false };
        case 'USER_FETCH_SUCCESS':
            return { ...state, isLoading: false, isError: false, data: action.payload };
        case 'USER_FETCH_FAILURE':
            return { ...state, isLoading: false, isError: true };
        default:
            throw new Error();
    }
};


function Welcome(props) {
    const [user, dispatchUser] = useReducer(userReducer, {
        data: {},
        isLoading: false,
        isError: false
    });

    async function sendRequest() {
        const res = await axios.get('http://localhost:3300/api/user/user', {
            withCredentials: true,
        }).catch(err => dispatchUser({ type: 'USER_FETCH_FAILURE' }));

        let data = null;
        if(!res) data = null;
        if (res && res.hasOwnProperty('data')) data = await res.data;

        return data;
    }

    useEffect(() => {
        //Initial Stage: On Page Load
        dispatchUser({ type: 'USER_FETCH_INIT' });

        //Sending Request: 
        sendRequest().then(data => {
            (data) && dispatchUser({
                type: 'USER_FETCH_SUCCESS',
                payload: data.user
            });
            
        });
    }, []);

    return (
        <div style={{ 'textAlign': 'center' }}>
            {(user.isError) && <h1> Something Went Wrong! Please Logout & Re-Login!</h1>}

            {(user.isLoading) && <h1> Loding User...! </h1> }

            { (!user.isError && user.data) && <h1>
                Welcome {user.data.name}.
                You are a {user.data.profile}
                Your Balance is: {user.data.wallet}
            </h1>
            }
        </div>
    )
}

export default Welcome;