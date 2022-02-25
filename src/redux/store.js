import { createStore, applyMiddleware, compose } from "redux"
import createSagaMiddleware from "redux-saga"
import reducer from "./reducers"
import saga from "./saga"
import {persistStore, persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
	key: "root",
	storage
}

const persistedReducer = persistReducer(persistConfig, reducer)

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

const withDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
	persistedReducer,
	withDevTools(applyMiddleware(...middleware))
)

sagaMiddleware.run(saga)

export const Persistor = persistStore(store)

export default store
