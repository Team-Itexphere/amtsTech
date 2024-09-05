import storage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import authReducer from './auth.reducer';
import routeReducer from './route.reducer';

const persistConfig = {
    key: 'root',
    storage,
};

export default combineReducers({
    authReducer: authReducer, // persistReducer(persistConfig, authReducer),
    routeReducer: routeReducer
});