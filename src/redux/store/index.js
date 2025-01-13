import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import rootReducer from '../reducers';

const persistenceConfigs = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistenceConfigs, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

export const persistedStore = persistStore(store);