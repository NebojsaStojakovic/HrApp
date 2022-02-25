import React, {useState} from "react"
import Loader from "../shared/Loader"
import {useNavigate} from "react-router"
import {useSelector} from "react-redux"
import {
	useDeleteUserAnswerMutation, useDeleteUserProfileMutation, useGetCompanyQuery, usePublishedTeamMemberProfiles
} from "../../hooks/reactQueryHooks"
import SpinnerLoader from "../shared/SpinnerLoader"
import DeleteModal from "../shared/DeleteModal"
import UserCard from "../shared/UserCard"
import InviteModal from "../InviteModal"
import {useToast} from "../../contexts/ToastProvider"

export const TeamPage = () => {
	const companyId = useSelector(state => state.companies.userCompany.data.id)
	const companyName = useSelector(state => state.companies.userCompany.data.attributes.name)
	const companySlug = useSelector(state => state.companies.userCompany.data.attributes.slug)
	const [companyLogo, setCompanyLogo] = useState(null)
	const {data: teamMembers, isLoading, isError, refetch} = usePublishedTeamMemberProfiles(companyId)
	const [userToDelete, setUserToDelete] = useState(false)
	const [inviteModalOpen, setInviteModalOpen] = useState(false)
	const navigate = useNavigate()
	const addToast = useToast()

	useGetCompanyQuery(companyId, {
		enabled: !!companyId, onSuccess: company => {
			setCompanyLogo(company.data.data.attributes.logo.data.attributes.url)
		}
	})

	const {mutateAsync: mutateDeleteUserAsync, isLoading: isDeleteUserLoading} = useDeleteUserProfileMutation()
	const {mutateAsync: mutateDeleteAnswerAsync, isLoading: isDeleteAnswerLoading} = useDeleteUserAnswerMutation()

	function openEditPage(e, userId) {
		e.stopPropagation()
		navigate(`/team/${userId}/edit`)
	}

	function openDeleteModal(e, user) {
		e.stopPropagation()
		setUserToDelete(user)
	}

	function addNewTeamMember() {
		setInviteModalOpen(true)
	}

	async function deleteUser() {
		await mutateDeleteUserAsync(userToDelete.id)
		userToDelete.attributes?.answers?.data.forEach(async answer => {
			return await mutateDeleteAnswerAsync(answer.id)
		})
		setUserToDelete(false)
		addToast({type: "success", text: "Deletion successful!"})
		refetch()
	}

	if (isLoading) {
		return (<SpinnerLoader/>)
	}

	if (isError) {
		return (
			<p>
				Loading error...
			</p>
		)
	}

	return (
		<>
			{userToDelete && (
				<DeleteModal
					disabled={isDeleteUserLoading || isDeleteAnswerLoading}
					onCancel={() => setUserToDelete(false)} onConfirm={deleteUser}
					user={userToDelete}/>
			)}
			{(isDeleteUserLoading || isDeleteAnswerLoading) && <Loader/>}
			{inviteModalOpen && <InviteModal companySlug={companySlug} closeModal={() => setInviteModalOpen(false)}/>}
			<div className="max-w-7xl mx-auto">
				<div
					className="flex flex-col md:flex-row md:justify-between md:items-center text-gray-900 dark:text-gray-100 mb-8">
					<div className="flex flex-col items-center md:flex-row md:items-center gap-6">
						<img className="w-36 h-36 md:w-24 md:h-24 rounded-md" src={companyLogo} alt={companyName}/>
						<h1 className="text-xl md:text-2xl tracking-wide">{companyName}</h1>
					</div>
					<div className="text-center mt-5 md:mt-0">
						<button className="text-sm md:text-base bg-orange-600 tracking-wide text-gray-100 py-2 px-2 rounded"
							onClick={addNewTeamMember}>+ Add New Team Member
						</button>
					</div>
				</div>
				<div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1">
					{teamMembers?.data?.data?.map(user => (
						<UserCard
							user={user} key={user.id} openDeleteModal={openDeleteModal} mainAction={openEditPage}
							actionName="Edit"/>))}
				</div>
			</div>
		</>
	)
}
