import {all, call, put, race, select, take} from "redux-saga/effects"
import actions, {
	createCompanyStart,
	createProfileError,
	createProfileStart,
	createProfileSuccess,
	fetchImageSuccess,
	fetchProfileSuccess,
	loginAddCompany,
	loginError,
	loginSuccess,
	loginWithTokenError,
	loginWithTokenSuccess,
	logoutError,
	logoutRemoveCompany,
	logoutSuccess,
	registerError,
	registerSuccess,
	uploadImageError,
	uploadImageStart,
	uploadImageSuccess,
} from "../actions/actions"
import api from "../../api"

function* login({email, password}) {
	try {
		const {data} = yield call(api.loginUser, {email, password})
		if (data) {
			localStorage.setItem("token", data.jwt)
			yield put(loginSuccess(data.user))
			yield call(fetchPopulatedUser, data.user.id)
		} else {
			yield put(loginError("Login epic Fail"))
		}
	} catch (error) {
		yield put(loginError(error.response.data.error))
	}
}

function* loginWithToken() {
	try {
		const {data} = yield call(api.getCurrentUser)
		if (data) {
			yield put(loginWithTokenSuccess(data))
			yield call(fetchPopulatedUser, data.id)
		} else {
			localStorage.removeItem("token")
			yield put(loginWithTokenError("Login data parse failure"))
		}
	} catch (error) {
		localStorage.removeItem("token")
		yield put(loginWithTokenError(error.message))
	}
}

function* fetchPopulatedUser(id) {
	try {
		const {data} = yield call(api.getProfileByID, id)
		yield put(loginAddCompany(data.data[0].attributes?.company))
		yield put(fetchProfileSuccess(data.data[0]))
		yield put(fetchImageSuccess(data.data[0].attributes?.profilePhoto.data))
	} catch (e) {
		// Rollback
	}
}

function* register(payload) {
	try {
		const {username, email, password} = payload
		const {data} = yield call(api.registerUser, {username, email, password})
		if (data) {
			localStorage.setItem("token", data.jwt)
			yield put(registerSuccess(data.user))
			yield call(registerOrchestrator, payload)
		} else {
			yield put(registerError("Register Failed"))
		}
	} catch (error) {
		yield put(registerError(error.response.data.error))
	}
}

function* registerWatcher() {
	while (true) {
		const {payload} = yield take(actions.REGISTER_START)
		yield call(register, payload)
	}
}

function* uploadImage(payload) {
	try {
		const data = yield call(api.uploadImage, payload)
		if (data) {
			const {id, ...payloadData} = data.data[0]
			const payload = {
				id: id,
				attributes: payloadData
			}
			yield put(uploadImageSuccess(payload))
		} else {
			yield put(uploadImageError("Upload Failed"))
		}
	} catch (error) {
		yield put(uploadImageError(error.message))
	}
}

function* uploadImageWatcher() {
	while (true) {
		const {payload} = yield take(actions.UPLOAD_IMAGE_START)
		yield call(uploadImage, payload)
	}
}

function* createNewProfile({name, company, user, userRole, profilePhoto = undefined}) {
	try {
		const requestConfig = {name, company, user, userRole}
		if (profilePhoto !== undefined) {
			requestConfig.profilePhoto = profilePhoto
		}
		const {data} = yield call(api.createProfile, requestConfig)
		if (data) {
			yield put(createProfileSuccess(data.data))
		} else {
			yield put(createProfileError("Data error"))
		}
	} catch (error) {
		yield put(createProfileError(error))
	}
}

function* createNewProfileWatcher() {
	while (true) {
		const {payload} = yield take(actions.CREATE_PROFILE_START)
		yield createNewProfile(payload)
	}
}

function* logout() {
	try {
		yield call(api.logoutUser)
		yield put(logoutSuccess())
		yield put(logoutRemoveCompany())
	} catch (error) {
		yield put(logoutError(error.message))
	}
}

// This is a watcher saga, I think
function* loginWatcher() {
	while (true) {
		const {payload} = yield take(actions.LOGIN_START)
		yield call(login, payload)
	}
}

function* loginWithTokenWatcher() {
	while (true) {
		const {payload} = yield take(actions.LOGIN_WITH_TOKEN_START)
		yield call(loginWithToken, payload)
	}
}

function* logoutWatcher() {
	while (true) {
		yield take(actions.LOGOUT_START)
		yield call(logout)
	}
}

/**
 * Orchestrator saga
 * Called in register saga
 * creates a new profile,
 * creates a new company if company is an object
 * uploads a file if provided
 */
function* registerOrchestrator(payload) {
	// {name, email, password, role, company : Number or Object, image : optional}
	let {username, userRole, company} = payload
	let profileConfig = {}

	try {
		if (typeof company === "object") {
			// The company is an object {name, slug}
			yield put(createCompanyStart(company))

			const {error: companyCreationError} = yield race({
				success: take(actions.CREATE_COMPANY_SUCCESS),
				error: take(actions.CREATE_COMPANY_ERROR)
			})

			if (companyCreationError) {
				// Rollback
				return
			}

			company = yield select(state => state.companies.userCompany.id)
		}

		if (Object.prototype.hasOwnProperty.call(payload, "image")) {
			const {image} = payload
			yield put(uploadImageStart(image))

			const {error: uploadImageError} = yield race({
				success: take(actions.UPLOAD_IMAGE_SUCCESS),
				error: take(actions.UPLOAD_IMAGE_ERROR)
			})

			if (uploadImageError) {
				// Rollback
				return
			}

			profileConfig.profilePhoto = yield select(state => state.user.image.id)
		}

		// Company is companyId integer Number
		const name = username
		const user = yield select(state => state.user.user.id)

		// Create profile
		profileConfig = {...profileConfig, name, company: parseInt(company), user: parseInt(user), userRole}
		yield put(createProfileStart(profileConfig))

		const {error: profileCreationError} = yield race({
			success: take(actions.CREATE_PROFILE_SUCCESS),
			error: take(actions.CREATE_PROFILE_ERROR)
		})

		if (profileCreationError) {
			// Rollback
			return
		}
	} catch (error) {
		yield put(registerError(error.response.data.error))
	}
}

export default function* () {
	yield all([loginWatcher(), loginWithTokenWatcher(), logoutWatcher(), registerWatcher(), uploadImageWatcher(), createNewProfileWatcher()])
}
