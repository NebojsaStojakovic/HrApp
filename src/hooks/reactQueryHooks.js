import {useMutation, useQuery} from "react-query"
import jwtDecode from "jwt-decode"
import api from "../api"

// Queries

/**
 * useQuery hook for getting published team member profiles
 *
 * @param {Number} page
 * @param {Number} company - companyId
 * @param {String} sort
 * @param {String} order - either asc or desc
 * @param {String} name - check if name is contained in names
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult<AxiosResponse<*>, unknown>}
 */
export const useGetAllFilteredProfilesQuery = ({page, company, sort, order, name}, options = {}) => {
	return useQuery(["getAllProfiles", {page, company, sort, order, name}],
		() => api.getAllFilteredProfiles({page, company, sort, order, name}),
		options)
}

/**
 * useQuery hook for getting published team member profiles
 *
 * @param {Number} company
 * @returns {UseQueryResult<AxiosResponse<*>, unknown>}
 */
export const usePublishedTeamMemberProfiles = (company) => {
	return useQuery(["getPublishedTeamMemberProfiles", company],
		() => api.getPublishedTeamMemberProfiles(company))
}

/**
 * useQuery hook for getting pending team member profiles
 *
 * @param {Number} company
 * @param {Object} options - query options
 * @returns {UseQueryResult<unknown, unknown>}
 */
export const usePendingTeamMemberProfiles = (company, options = {}) => {
	return useQuery(["getPendingTeamMemberProfiles", company],
		() => api.getPendingTeamMemberProfiles(company),
		{...options})
}

/**
 * Returns useQuery hook for fetching user by ID
 *
 * @param {Number} profileId
 * @param {Object} options - extra useQuery options
 * @returns {UseQueryResult<AxiosResponse<*>, unknown>}
 */
export const useUserProfileQuery = (profileId, options = {}) => {
	return useQuery(["getUserProfile", profileId],
		() => api.getProfileByProfileID(profileId), {
			...options
		})
}

/**
 * Returns useQuery hook for fetching questions by company ID
 *
 * @param {Number} companyId
 * @param {Object} options
 * @returns {UseQueryResult<AxiosResponse<*>, unknown>}
 */
export const useQuestionsQuery = (companyId = 7, options = {}) => {
	return useQuery(["getQuestionsQuery", companyId],
		() => api.getQuestionsByCompanyId(companyId),
		options)
}

/**
 * Returns useQuery hook for fetching answers by profile ID
 *
 * @param {Number} profileId
 * @param {Object} options
 * @returns {UseQueryResult<AxiosResponse<*>, unknown>}
 */
export const useAnswersQuery = (profileId, options = {}) => {
	return useQuery(["getAnswersQuery", profileId],
		() => api.getAnswersByProfileId(profileId),
		options)
}

export const useGetAllCompanies = (options = {}) => {
	return useQuery("getAllCompaniesQuery",
		async () => await api.getAllCompanies(), options)
}

/**
 * * Returns useQuery hook for fetching user by Token
 *
 * @param options
 * @returns
 */
export const useGetMyProfile = (options = {}) => {
	return useQuery("getMyProfile", async () => {
		const token = localStorage.getItem("token")
		const tokenDecoded = jwtDecode(token)
		const userId = tokenDecoded.id
		return await api.getProfileByID(userId)
	}, options)
}

/**
 * Returns useQuery hook for fetching questions by companyID
 *
 * @param companyID
 * @param options
 */
export const useGetCompanyQuestions = (companyID, options = {}) => {
	return useQuery("getQuestions", async () => {
		return await api.getQuestions(companyID)
	}, options)
}

/**
 * * Returns useQuery hook for fetching questions by companyID
 *
 * @param options
 */
export const useGetAllQuestionsQuery = (options = {}) => {
	return useQuery("getAllQuestions", async () => {
		return await api.getAllQuestions()
	}, options)
}

/**
 * * Returns useQuery hook for fetching questions by companyID
 *
 * @param companyID
 * @param options
 */
export const useGetCompanyQuery = (companyID, options = {}) => {
	return useQuery(["getOurCompany", companyID],async () => {
		return await api.getOurCompany(companyID)
	}, options)
}

// Mutations

/**
 * Returns mutation for deleting answer by ID
 *
 * @param options
 * @returns {UseMutationResult<unknown, unknown, void, unknown>}
 */
export const useDeleteQuestionMutation = (options = {}) => {
	return useMutation(async (id) => {
		return await api.deleteQuestion({id})
	}, options)
}

/**
 * Invites a team member
 * mutation takes an object {email, companySlug}
 *
 * @param {Object} options
 * @returns {UseMutationResult<unknown, unknown, void, unknown>}
 */
export const useInviteMutation = (options = {}) => {
	return useMutation(async ({email, companySlug}) => await api.inviteTeamMember({email, companySlug}),
		options)
}

/**
 * Returns mutation for deleting profile by ID
 * @param options
 * @returns {UseMutationResult<unknown, unknown, void, unknown>}
 */
export const useDeleteUserProfileMutation = (options = {}) => {
	return useMutation((id) => api.deleteProfileById(id), options)
}

/**
 * Returns mutation for deleting answer by ID
 *
 * @param options
 * @returns {UseMutationResult<unknown, unknown, void, unknown>}
 */
export const useDeleteUserAnswerMutation = (options = {}) => {
	return useMutation((id) => api.deleteAnswerById(id), options)
}

/**
 * Upload image useQuery mutatuion,
 * Uses file from File Web API
 *
 * @param {Object} options
 * @returns {UseMutationResult<AxiosResponse<*>, unknown, void, unknown>}
 */
export const usePostImageMutation = (options = {}) => {
	return useMutation(async (file) => await api.uploadImage(file),
		options)
}

/**
 * Update user profile
 *
 * @param {Object} options - name and image ID
 * @returns {UseMutationResult<AxiosResponse<*>, unknown, void, unknown>}
 */
export const useEditProfileMutation = (options = {}) => {
	return useMutation(async ({profileId, putOptions}) => {
		await api.editProfile(profileId, putOptions)
	},
	options)
}

/**
 * Update user profile status to published
 *
 * @param {Object} options - name and image ID
 * @returns {UseMutationResult<AxiosResponse<*>, unknown, void, unknown>}
 */
export const usePublishTeamMemberMutation = (options = {}) => {
	return useMutation(async (profileId) => {
		await api.publishProfile(profileId)
	},
	options)
}

/**
 * Returns useQuery hook for updating an answer
 *
 * @param {Object} options
 * @returns {UseMutationResult<AxiosResponse<*>, unknown, void, unknown>}
 */
export const useUpdateAnswerMutation = (options = {}) => {
	return useMutation(async (payload) => await api.updateAnswer(payload),
		options)
}

/**
 * Returns useQuery hook for POSTing an answer
 *
 * @param {Object} options
 * @returns {UseMutationResult<AxiosResponse<*>, unknown, void, unknown>}
 */
export const usePostAnswerMutation = (options = {}) => {
	return useMutation(async (payload) => await api.addAnswer(payload),
		options)
}
