import {axiosInstanceWithAuth, axiosInstanceWithoutAuth} from "./axios"

const api = {
	/**
     * Calls endpoint for registering a new user.
     * NOTE: You should call endpoint for creating
     * a new profile after this is done
     *
     * @param {String} username
     * @param {String} email
     * @param {String} password
     * @returns {Promise<AxiosResponse<any>>}
     */
	registerUser: ({username, email, password}) => {
		return axiosInstanceWithoutAuth.post("/api/auth/local/register", {
			username: username,
			email: email,
			password: password
		})
	},

	/**
     *    Calls endpoing for creation of a new profile
     *    for the user after registration
     *
     * @param {String} name - username
     * @param {Number} company - ID of the company
     * @param {Number} user - ID of the user
     * @param {String} userRole - either 'comapny_user' or 'company_admin'
     * @param {Number} profilePhoto - profile photo ID
     * @returns {Promise<AxiosResponse<any>>}
     */
	createProfile: ({name, company, user, userRole, profilePhoto = undefined}) => {
		return axiosInstanceWithAuth.post("/api/profiles", {
			data: {
				name,
				company,
				user,
				userRole,
				profilePhoto
			}
		})
	},

	/**
     *    Calls endpoing for creation of a new company
     *  after registration and before
     *  creation of a new profile
     *
     * @param {String} name - company name
     * @param {String} slug - company slug
     * @returns {Promise<AxiosResponse<any>>}
     */
	createCompany: ({name, slug}) => {
		return axiosInstanceWithAuth.post("/api/companies", {
			data: {
				name,
				slug
			}
		})
	},

	/**
     * GETs all companies
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	getAllCompanies: () => {
		return axiosInstanceWithoutAuth.get("/api/companies?pagination[pageSize]=1000")
	},

	/**
     * GETs our company
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	getOurCompany: (companyID) => {
		return axiosInstanceWithAuth.get("/api/companies/" + companyID + "?populate=*")
	},
	/**
     * Edit our company
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	editOurCompany: async (payload) => {
		const {
			id,
			name,
			imageToSend,
		} = payload
		const submitData = {
			name,
		}
		if (imageToSend) {
			submitData.logo = imageToSend
		}
		return axiosInstanceWithAuth.put("/api/companies/" + id, {
			data: {
				...submitData
			}
		})
	},
	/**
     * GETs myProfile by user ID
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	getProfileByID: (userId) => {
		return axiosInstanceWithAuth.get(`/api/profiles?filters[user][id][$eq]=${userId}&populate=*`)
	},

	/**
     * GETs profile by ID
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	getProfileByProfileID: (userId) => {
		return axiosInstanceWithAuth.get(`/api/profiles/${userId}?populate=*`)
	},

	/**
     * Calls endpoint for logging in user
     *
     * @param {String} email
     * @param {String} password
     * @returns {Promise<AxiosResponse<any>>}
     */
	loginUser: ({email, password}) => {

		return axiosInstanceWithoutAuth.post("/api/auth/local", {
			identifier: email,
			password: password
		})
	},

	/**
     * GETs user logged in with JWT token
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	getCurrentUser: () => {
		return axiosInstanceWithAuth.get("/api/users/me")
	},

	/**
     * Removes JWT from localStorage, to logout a user.
     * This way it prevents authorization
     */
	logoutUser: () => {
		localStorage.removeItem("token")
	},

	/**
     * Uploads image file
     *
     * @param {File} image - The image file
     * @returns {Promise<AxiosResponse<any>>}
     */
	uploadImage: (image) => {
		const formData = new FormData()
		formData.append("files", image)
		return axiosInstanceWithAuth.post("/api/upload",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})
	},

	/**
	 * Gets all pending populated profiles
	 *
	 * @param companyId
	 * @param page
	 * @returns {Promise<AxiosResponse<any>>}
	 */
	getPublishedTeamMemberProfiles: (companyId = 7, page = 1) => {
		return axiosInstanceWithAuth.get(`/api/profiles?filters[status][$eq]=published&filters[company][id][$eq]=${companyId}&sort=createdAt&pagination[page]=${page}&populate=*`)
	},

	/**
	 * Gets all published populated profiles by company ID
	 * default company ID is the ID of our company 7
	 *
	 * @param {Number} companyId - Company ID, default 7
	 * @param page
	 * @returns {Promise<AxiosResponse<any>>}
	 */
	getPendingTeamMemberProfiles: (companyId = 7, page = 1) => {
		return axiosInstanceWithAuth.get(`/api/profiles?filters[status][$eq]=pending&filters[company][id][$eq]=${companyId}&pagination[page]=${page}&sort=createdAt&populate=*`)
	},

	/**
     * Deletes a profile by ID
     *
     * @param {Number} profileId
     * @returns {Promise<AxiosResponse<any>>}
     */
	deleteProfileById: (profileId) => {
		return axiosInstanceWithAuth.delete(`/api/profiles/${profileId}`)
	},

	/**
     * Deletes an answer by ID
     *
     * @param {Number} answerId
     * @returns {Promise<AxiosResponse<any>>}
     */
	deleteAnswerById(answerId) {
		return axiosInstanceWithAuth.delete(`/api/answers/${answerId}`)
	},

	/**
     * Returns promise to GET questions by company ID
     *
     * @param {Number} companyId
     * @returns {Promise<AxiosResponse<any>>}
     */
	getQuestionsByCompanyId: (companyId) => {
		return axiosInstanceWithAuth.get(`/api/questions?filters[company][id][$eq]=${companyId}&sort=order&populate=*`)
	},

	/**
     * Returns promise to GET answers by profile ID
	 * populates and sorts by time answered
     *
     * @param {Number} userId
     * @returns {Promise<AxiosResponse<any>>}
     */
	getAnswersByProfileId: (userId) => {
		return axiosInstanceWithoutAuth.get(`/api/answers?filters[profile][id][$eq]=${userId}&populate=*&sort=createdAt`)
	},

	/**
     * Updates profile
     *
     * @param {Number} profileId
     * @param {Object} putOptions - Update parameters
     * @returns {Promise<AxiosResponse<any>>}
     */
	editProfile: (profileId, putOptions) => {
		return axiosInstanceWithAuth.put(`/api/profiles/${profileId}`, {
			data: {
				...putOptions
			}
		})
	},

	/**
     * Updates profile status to published
     *
     * @param {Number} profileId
     * @returns {Promise<AxiosResponse<any>>}
     */
	publishProfile: (profileId) => {
		return axiosInstanceWithAuth.put(`/api/profiles/${profileId}`, {
			data: {
				status: "published"
			}
		})
	},

	/**
     * Add Answer
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	addAnswer: (payload) => {
		const {
			questionId,
			answer,
			userProfile
		} = payload
		return axiosInstanceWithAuth.post("/api/answers/", {
			data: {
				answer,
				question: questionId,
				profile: userProfile
			}
		})
	},

	/**
     * Add Image Answer
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	addImageAnswer: async (payload) => {
		const {
			questionId,
			userProfile,
			imageToSend,
		} = payload
		const res = await api.uploadImage(imageToSend)
		const answerImage = res.data[0].formats.thumbnail.url
		return axiosInstanceWithAuth.post("/api/answers/", {
			data: {
				answer: answerImage,
				question: questionId,
				profile: userProfile
			}

		})
	},

	/**
     * Add Answer
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	updateAnswer: (payload) => {
		const {
			answerId,
			questionId,
			answer,
			userProfile
		} = payload
		return axiosInstanceWithAuth.put(`/api/answers/${answerId}`, {
			data: {
				answer,
				question: questionId,
				profile: userProfile
			}
		})
	},

	/**
     * Sends a request for an invite
     * Returns a Promise
     *
     * @param email
     * @param companySlug
     * @returns {Promise<AxiosResponse<any>>}
     */
	inviteTeamMember: ({email, companySlug}) => {
		return axiosInstanceWithAuth.post("/api/invite", {
			email,
			companySlug
		})
	},
	/**
     * GETs ALL Questions
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	getAllQuestions: () => {
		return axiosInstanceWithAuth.get("/api/questions")
	},
	/**
     * GETs Questions
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	getQuestions: (companyID) => {
		return axiosInstanceWithAuth.get(`/api/questions?filters[company][id][$eq]=${companyID}&populate=*&sort=order`)
	},
	/**
     * Update new Questions
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	putNewQuestionsOrder: (payload) => {
		const {
			id,
			order
		}=payload
		return axiosInstanceWithAuth.put("/api/questions/" + id, {
			data: {
				order: order
			}
		})
	},
	/**
     * GETs Questions
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	addQuestions: (payload) => {
		const {
			companyID,
			text,
			type,
			order
		} = payload
		return axiosInstanceWithAuth.post("/api/questions",{
			data: {
				text,
				type,
				order,
				company: companyID
			}
		})
	},

	/**
     * Edit Questions
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	editQuestions: (payload) => {
		const {
			id,
			text,
			type,
			order
		} = payload
		return axiosInstanceWithAuth.put("/api/questions/" +id,{
			data: {
				text,
				type,
				order
			}
		})
	},
	/**
     * Edit Questions
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	deleteQuestion: (payload) => {
		const {
			id,
		} = payload
		return axiosInstanceWithAuth.delete(`/api/questions/${id}?populate=*`)
	},
	/**
     * Edit Password
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
	editPassword: (payload) => {
		const {
			id,
			password,
			passwordConfirmation
		} = payload
		return axiosInstanceWithAuth.post("api/auth/reset-password", {
			code: id,
			password,
			passwordConfirmation
		})
	},

	/**
	 * GETs all profiles filtered by criteria
	 *
	 * @param {Number} page
	 * @param {Number} company
	 * @param {String} sort
	 * @param {String} order - asc or desc
	 * @param {String} name - check if name string is contained in name attribute
	 * @returns {Promise<AxiosResponse<any>>}
	 */
	getAllFilteredProfiles: ({page, company, sort, order, name}) => {
		return axiosInstanceWithoutAuth.get(`/api/profiles
		?pagination[page]=${page}
		${company ? `&filters[company][id][$eq]=${company}` : ""}
		${name ? `&filters[name][$containsi]=${name}` : ""}
		${sort ? `&sort=${sort}:${order}` : ""}
		&populate=*`)
	},
}

export default api