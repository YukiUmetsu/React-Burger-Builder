import reducer from './auth';
import * as actionTypes from '../actions/actionsTypes';

describe('auth reducer', () => {

    const initialState = {
        token: null,
        userId: null,
        error: null,
        loading: false,
        authRedirectPath: "/",
    };

    it('should return the initial state', () => {
       expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should store token upon login', () => {
        let action = {
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'wioefhjnoifanoia',
            userId: 'fjweoifjeoriawjp'
        };
        expect(reducer(initialState, action)).toEqual({
            token: 'wioefhjnoifanoia',
            userId: 'fjweoifjeoriawjp',
            error: null,
            loading: false,
            authRedirectPath: "/",
        });
    });

});