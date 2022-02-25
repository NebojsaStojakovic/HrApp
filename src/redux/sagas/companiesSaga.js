import {all, take, call, put} from "redux-saga/effects"
import actions, {
	createCompanyError,
	createCompanySuccess,
	fetchCompaniesError, fetchCompaniesSuccess
} from "../actions/actions"
import api from "../../api"

function* fetchCompanies() {
	try {
		const {data} = yield call(api.getAllCompanies)
		if (data) {
			yield put(fetchCompaniesSuccess(data))
		}
	} catch (error) {
		yield put(fetchCompaniesError(error))
	}
}

function* fetchCompaniesWatcher() {
	while (true) {
		yield take(actions.FETCH_COMPANIES_START)
		yield call(fetchCompanies)
	}
}

function* createNewCompany({name, slug}) {
	try {
		const {data} = yield call(api.createCompany, {name, slug})
		if (data) {
			yield put(createCompanySuccess(data))
		}
	} catch (error) {
		yield put(createCompanyError(error))
	}
}

function* createNewCompanyWatcher() {
	while (true) {
		const {payload} = yield take(actions.CREATE_COMPANY_START)
		yield call(createNewCompany, payload)
	}
}

export default function* () {
	yield all([fetchCompaniesWatcher(), createNewCompanyWatcher()])
}
