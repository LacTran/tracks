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
        case 'SIGN_UP':
            return {
                token: action.payload,
                errorMessage: ''
            }
        default:
            return state
    }
};



const signup = (dispatch) => async ({ email, password }) => { //remove return
    try {
        const response = await trackerApi.post('/signup', { email, password })
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({ type: 'SIGN_UP', payload: response.data.token })
        navigate('TrackList');
    } catch (err) {
        dispatch({ type: 'ADD_ERROR', payload: "Something went wrong with sign up" })
    }
}


const signin = (dispatch) => {
    return ({ email, password }) => {

    }
}

const signout = (dispatch) => {
    return () => {

    }
}

export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, signup, signout },
    { token: null, errorMessage: '' }
)