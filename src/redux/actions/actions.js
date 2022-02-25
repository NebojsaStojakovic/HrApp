const actions = {
	// User Actions
	LOGIN_START : "LOGIN_START",
	LOGIN_SUCCESS : "LOGIN_SUCCESS",
	LOGIN_ERROR : "LOGIN_ERROR",

	REGISTER_START : "REGISTER_START",
	REGISTER_SUCCESS : "REGISTER_SUCCESS",
	REGISTER_ERROR : "REGISTER_ERROR",

	LOGOUT_START : "LOGOUT_START",
	LOGOUT_SUCCESS : "LOGOUT_SUCCESS",
	LOGOUT_ERROR : "LOGOUT_ERROR",

	LOGIN_WITH_TOKEN_START : "LOGIN_WITH_TOKEN_START",
	LOGIN_WITH_TOKEN_SUCCESS : "LOGIN_WITH_TOKEN_SUCCESS",
	LOGIN_WITH_TOKEN_ERROR : "LOGIN_WITH_TOKEN_ERROR",

	// Profile Actions

	CREATE_PROFILE_START : "CREATE_PROFILE_START",
	CREATE_PROFILE_SUCCESS : "CREATE_PROFILE_SUCCESS",
	CREATE_PROFILE_ERROR : "CREATE_PROFILE_ERROR",

	FETCH_PROFILE_SUCCESS : "FETCH_PROFILE_SUCCESS",

	FETCH_IMAGE_SUCCESS: "FETCH_IMAGE_SUCCESS",

	// Image actions

	UPLOAD_IMAGE_START : "UPLOAD_IMAGE_START",
	UPLOAD_IMAGE_SUCCESS : "UPLOAD_IMAGE_SUCCESS",
	UPLOAD_IMAGE_ERROR : "UPLOAD_IMAGE_ERROR",

	// Companies Actions

	LOGOUT_REMOVE_COMPANY: "LOGOUT_REMOVE_COMPANY",
	LOGIN_ADD_COMPANY: "LOGIN_ADD_COMPANY",

	FETCH_COMPANIES_START : "FETCH_COMPANIES_START",
	FETCH_COMPANIES_SUCCESS : "FETCH_COMPANIES_SUCCESS",
	FETCH_COMPANIES_ERROR : "FETCH_COMPANIES_ERROR",

	CREATE_COMPANY_START : "CREATE_COMPANY_START",
	CREATE_COMPANY_SUCCESS : "CREATE_COMPANY_SUCCESS",
	CREATE_COMPANY_ERROR : "CREATE_COMPANY_ERROR",
}

// ACTION CREATORS


export const loginStart = (payload) => ({
	type: actions.LOGIN_START,
	payload,
})

export const loginSuccess = (payload) => ({
	type: actions.LOGIN_SUCCESS,
	payload,
})

export const loginError = (payload) => ({
	type: actions.LOGIN_ERROR,
	payload,
})


export const registerStart = (payload) => ({
	type: actions.REGISTER_START,
	payload,
})

export const registerSuccess = (payload) => ({
	type: actions.REGISTER_SUCCESS,
	payload,
})

export const registerError = (payload) => ({
	type: actions.REGISTER_ERROR,
	payload,
})

export const logoutStart = () => ({
	type: actions.LOGOUT_START,
})

export const logoutError = () => ({
	type: actions.LOGOUT_ERROR,
})

export const logoutSuccess = () => ({
	type: actions.LOGOUT_SUCCESS,
})

export const loginWithTokenStart = (payload) => ({
	type: actions.LOGIN_WITH_TOKEN_START,
	payload
})

export const loginWithTokenError = (payload) => ({
	type: actions.LOGIN_WITH_TOKEN_ERROR,
	payload
})

export const loginWithTokenSuccess = (payload) => ({
	type: actions.LOGIN_WITH_TOKEN_SUCCESS,
	payload
})

export const fetchCompaniesStart = () => ({
	type: actions.FETCH_COMPANIES_START,
})

export const fetchCompaniesSuccess = (payload) => ({
	type: actions.FETCH_COMPANIES_SUCCESS,
	payload,
})

export const fetchCompaniesError = (payload) => ({
	type: actions.FETCH_COMPANIES_ERROR,
	payload,
})

export const createCompanyStart = (payload) => ({
	type: actions.CREATE_COMPANY_START,
	payload,
})

export const createCompanySuccess = (payload) => ({
	type: actions.CREATE_COMPANY_SUCCESS,
	payload,
})

export const createCompanyError = (payload) => ({
	type: actions.CREATE_COMPANY_ERROR,
	payload,
})

export const createProfileStart = (payload) => ({
	type: actions.CREATE_PROFILE_START,
	payload,
})

export const createProfileSuccess = (payload) => ({
	type: actions.CREATE_PROFILE_SUCCESS,
	payload,
})

export const createProfileError = (payload) => ({
	type: actions.CREATE_PROFILE_ERROR,
	payload,
})

export const uploadImageStart = (payload) => ({
	type: actions.UPLOAD_IMAGE_START,
	payload,
})

export const uploadImageSuccess = (payload) => ({
	type: actions.UPLOAD_IMAGE_SUCCESS,
	payload,
})

export const uploadImageError = (payload) => ({
	type: actions.UPLOAD_IMAGE_ERROR,
	payload,
})

export const logoutRemoveCompany = (payload) => ({
	type: actions.LOGOUT_REMOVE_COMPANY,
	payload,
})

export const loginAddCompany = (payload) => ({
	type: actions.LOGIN_ADD_COMPANY,
	payload,
})

export const fetchProfileSuccess = (payload) => ({
	type: actions.FETCH_PROFILE_SUCCESS,
	payload,
})

export const fetchImageSuccess = (payload) => ({
	type: actions.FETCH_IMAGE_SUCCESS,
	payload,
})

export default actions