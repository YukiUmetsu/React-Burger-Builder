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
    removeFromLocalStorage(['token', 'expirationTime', 'userId']);
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

const storeInLocalStorage = (dataObj) => {
    let keys = Object.keys(dataObj);
    keys.map(key => {
        let value = dataObj[key];
        return localStorage.setItem(key, value);
    });
};

const removeFromLocalStorage = (keys) => {
    keys.map(key => {
        return localStorage.removeItem(key);
    });
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
        axios.post(postURL, authData)
            .then((response) => {
                const expirationDate = new Date((new Date()).getTime() + (response.data.expiresIn * 1000));
                storeInLocalStorage({
                    token: response.data.idToken,
                    expirationDate: expirationDate,
                    userId: response.data.localId,
                });
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn))
            })
            .catch((err)=>{
                dispatch(authFail(err.response.data.error));
            })
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        const userId = localStorage.getItem('userId');

        if(token && expirationDate > new Date()){
            dispatch(authSuccess(token, userId));
            let diffTime = (expirationDate.getTime() - new Date().getTime())/1000;
            dispatch(checkAuthTimeout(diffTime));
        } else {
            dispatch(logOut());
        }
    }
};