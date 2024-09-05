import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import { persistStore } from 'redux-persist';
import reducers from './reducers';
// import reducers from './reducers/auth.reducer';

const store = createStore(reducers, applyMiddleware(thunk));

export { store };
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof reducers>;
