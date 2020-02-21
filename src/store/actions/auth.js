import * as actionTypes from "./actionsTypes";
import axios from "axios";

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
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

export const logOut = () => {
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logOut());
        }, expirationTime*1000);
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path,
    }
};

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        let authData = {
            email: email,
            password: password,
            returnSecureToken: true,
        };
        let postURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+process.env.REACT_APP_GOOGLE_API_KEY;
        if(!isSignUp){
            postURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+process.env.REACT_APP_GOOGLE_API_KEY;
        }
        console.log(postURL);
        axios.post(postURL, authData)
            .then((response) => {
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn))
            })
            .catch((err)=>{
                dispatch(authFail(err.response.data.error));
            })
    }
};