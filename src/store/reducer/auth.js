import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from "../../utility/utility";


const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: "/",
};

const authSuccess = (state, action) => {
    const updatedState = {
        loading: false,
        error: null,
        token: action.idToken,
        userId: action.userId,
    };
    return updateObject(state, updatedState);
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return updateObject(state, {loading: true});
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return updateObject(state, {loading: false, error: action.error});
        case actionTypes.AUTH_LOGOUT: return updateObject(state, {token: null, userId: null});
        case actionTypes.SET_AUTH_REDIRECT_PATH: return updateObject(state, {authRedirectPath: action.path});
        default: return state;
    }
};

export default reducer;