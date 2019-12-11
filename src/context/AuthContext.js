import createDataContext from './createDataContext';
import trackerApi from '../api/tracker';
import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ERROR':
            return {
                ...state,
                errorMessage: action.payload
            }
        // case 'SIGN_UP':
        //     return {
        //         token: action.payload,
        //         errorMessage: ''
        //     }
        case 'SIGN_IN':
            return {
                token: action.payload,
                errorMessage: ''
            }
        case 'SIGN_OUT':
            return {
                token: null,
                errorMessage: ''
            }
        case 'CLEAR_ERROR_MESSAGE':
            return {
                ...state,
                errorMessage: ''
            }
        default:
            return state
    }
};

const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        dispatch({ type: 'SIGN_IN', payload: token });
        navigate('TrackList')
    } else {
        navigate('loginFlow')
    }
}

const clearErrorMessage = (dispatch) => () => dispatch({ type: 'CLEAR_ERROR_MESSAGE' })


const signup = (dispatch) => async ({ email, password }) => { //remove return
    try {
        const response = await trackerApi.post('/signup', { email, password })
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({ type: 'SIGN_IN', payload: response.data.token })
        navigate('TrackList');
    } catch (err) {
        dispatch({ type: 'ADD_ERROR', payload: "Something went wrong with sign up" })
    }
}


const signin = (dispatch) => async ({ email, password }) => {
    try {
        const response = await trackerApi.post('/signin', { email, password })
        await AsyncStorage.setItem('token', response.data.token)
        dispatch({ type: 'SIGN_IN', payload: response.data.token })
        navigate('TrackList')
    } catch (err) {
        dispatch({
            type: 'ADD_ERROR',
            payload: "Something went wrong with sign in"
        })
    }
}


const signout = (dispatch) => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'SIGN_OUT' })
    navigate('loginFlow')
}

export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, signup, signout, clearErrorMessage, tryLocalSignin },
    { token: null, errorMessage: '' }
)