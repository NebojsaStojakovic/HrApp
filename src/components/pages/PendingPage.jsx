import React, {useState} from "react"
import {useNavigate} from "react-router"
import DeleteModal from "../shared/DeleteModal"
import {useDeleteUserAnswerMutation, useDeleteUserProfileMutation, usePendingTeamMemberProfiles} from "../../hooks/reactQueryHooks"
import UserCard from "../shared/UserCard"
import SpinnerLoader from "../shared/SpinnerLoader"
import {useSelector} from "react-redux"
import Loader from "../shared/Loader"

const PendingPage = () => {

	const companyId = useSelector(state => state.companies.userCompany.data.id)
	const {data: teamMembers, isLoading, isError, refetch} = usePendingTeamMemberProfiles(companyId)
	const [userToDelete, setUserToDelete] = useState(false)
	const navigate = useNavigate()

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

	async function deleteUser() {
		await mutateDeleteUserAsync(userToDelete.id)
		userToDelete.attributes?.answers?.data.forEach(async answer => {
			return await mutateDeleteAnswerAsync(answer.id)
		})
		setUserToDelete(false)
		refetch()
	}

	if (isLoading) {
		return (
			<SpinnerLoader/>
		)
	}

	if (isError) {
		return (
			<p>
                Loading error...
			</p>
		)
	}

	return (
		<div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 mx-auto max-w-7xl">
			{userToDelete &&
                <DeleteModal disabled={isDeleteUserLoading || isDeleteAnswerLoading} onCancel={() => setUserToDelete(false)} onConfirm={deleteUser} user={userToDelete} />}
			{(isDeleteUserLoading || isDeleteAnswerLoading) && <Loader/>}
			{
				teamMembers?.data?.data?.map(user => (
					<UserCard user={user} key={user.id} openDeleteModal={openDeleteModal} mainAction={openEditPage}
						actionName="Details"/>
				))
			}
		</div>
	)
}

export default PendingPage