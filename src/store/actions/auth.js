import * as actionTypes from "./actionsTypes";
import axios from "axios";

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
};

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    }
};

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        let authData = {
            email: email,
            password: password,
            returnSecureToken: true,
        };
        let postURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?'+process.env.REACT_APP_GOOGLE_API_KEY;
        axios.post(postURL, authData)
            .then((response) => {

                dispatch(authSuccess(response.data));
            })
            .catch((err)=>{
                dispatch(authFail(err));
            })
    }
};