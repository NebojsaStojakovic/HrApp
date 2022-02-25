import actions from "../actions/actions"

const initialState = {
	companies: [],
	userCompany: null,
	isLoading: false,
	error: false
}

export default (state = initialState, {type, payload}) => {
	switch (type) {
	case actions.FETCH_COMPANIES_START:
		return {
			...state,
			isLoading: true
		}
	case actions.FETCH_COMPANIES_SUCCESS:
		return {
			...state,
			companies: payload.data,
			isLoading: false,
			error: false
		}
	case actions.FETCH_COMPANIES_ERROR:
		return {
			...state,
			isLoading: false,
			error: payload
		}
	case actions.CREATE_COMPANY_START:
		return {
			...state,
			isLoading: true
		}
	case actions.CREATE_COMPANY_SUCCESS:
		return {
			...state,
			userCompany: payload.data,
			isLoading: false,
			error: false
		}
	case actions.CREATE_COMPANY_ERROR:
		return {
			...state,
			isLoading: false,
			error: payload
		}
	case actions.LOGIN_ADD_COMPANY:
		return {
			...state,
			userCompany: payload,
			isLoading: true
		}
	case actions.LOGOUT_REMOVE_COMPANY:
		return {
			...state,
			userCompany: null
		}
	default:
		return state
	}
}