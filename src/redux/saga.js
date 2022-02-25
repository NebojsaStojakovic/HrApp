import { all } from "redux-saga/effects"
import userSaga from "./sagas/userSaga"
import companiesSaga from "./sagas/companiesSaga"

export default function* rootSaga() {
	yield all([userSaga(), companiesSaga()])
}