import actions from "../actions/actions"

const initialState = {
	isLoading: false,
	isLoggedIn: false,
	user: null,
	error: null,
	profile: null,
	image: null,
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
	case actions.LOGIN_START:
		return {
			...state,
			isLoading: true,
		}
	case actions.LOGIN_SUCCESS:
		return {
			...state,
			isLoading: false,
			// isLoggedIn: true,
			user: payload,
		}
	case actions.LOGIN_ERROR:
		return {
			...state,
			isLoggedIn: false,
			user: null,
			isLoading: false,
			error: payload,
		}
	case actions.LOGIN_WITH_TOKEN_START:
		return {
			...state,
			isLoading: true,
		}
	case actions.LOGIN_WITH_TOKEN_SUCCESS:
		return {
			...state,
			isLoading: false,
			// isLoggedIn: true,
			user: payload,
		}
	case actions.LOGIN_WITH_TOKEN_ERROR:
		return {
			...initialState,
			error: payload,
		}
	case actions.REGISTER_START:
		return {
			...state,
			isLoading: true,
		}
	case actions.REGISTER_SUCCESS:
		return {
			...state,
			isLoading: false,
			// isLoggedIn: true,
			user: payload,
		}
	case actions.REGISTER_ERROR:
		return {
			...initialState,
			error: payload,
		}
	case actions.LOGOUT_START:
		return {
			...state,
			isLoading: true,
		}
	case actions.LOGOUT_SUCCESS:
		return {
			...initialState,
		}
	case actions.LOGOUT_ERROR: {
		return {
			...state,
			isLoading: false,
			error: payload,
		}
	}
	case actions.CREATE_PROFILE_START:
		return {
			...state,
			isLoading: true,
		}
	case actions.CREATE_PROFILE_SUCCESS:
		return {
			...state,
			isLoading: false,
			isLoggedIn: true,
			profile: payload
		}
	case actions.CREATE_PROFILE_ERROR: {
		return {
			...state,
			isLoading: false,
			error: payload,
		}
	}
	case actions.FETCH_PROFILE_SUCCESS: {
		return {
			...state,
			isLoggedIn: true,
			profile: payload
		}
	}
	case actions.FETCH_IMAGE_SUCCESS: {
		return {
			...state,
			image: payload
		}
	}
	case actions.UPLOAD_IMAGE_START:
		return {
			...state,
			isLoading: true,
		}
	case actions.UPLOAD_IMAGE_SUCCESS:
		return {
			...state,
			isLoading: false,
			image: payload
		}
	case actions.UPLOAD_IMAGE_ERROR: {
		return {
			...state,
			isLoading: false,
			error: payload,
		}
	}
	default:
		return state
	}
}
