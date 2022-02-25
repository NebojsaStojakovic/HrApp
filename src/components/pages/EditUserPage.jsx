import React, {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router"
import {
	useDeleteUserAnswerMutation,
	useDeleteUserProfileMutation,
	useEditProfileMutation,
	usePostImageMutation,
	usePublishTeamMemberMutation,
	useUserProfileQuery
} from "../../hooks/reactQueryHooks"
import SpinnerLoader from "../shared/SpinnerLoader"
import QuestionsAndAnswers from "../shared/QuestionsAndAnswers"
import InfoForm from "../shared/InfoForm"
import Loader from "../shared/Loader"
import DeleteModal from "../shared/DeleteModal"
import InputPair from "../shared/InputPair"
import {INPUT_TYPES, STATUS} from "../../constants"
import {useToast} from "../../contexts/ToastProvider"

function EditUserPage() {

	const {id: profileId} = useParams()
	const navigate = useNavigate()
	const addToast = useToast()

	const {data: user, isLoading, isError, refetch} = useUserProfileQuery(parseInt(profileId), {
		onSuccess: user => {
			setUsername(user.data.data.attributes.name)
			setSelectedStatus(user.data.data.attributes.status)
		},
		enabled: false
	})

	const {
		mutateAsync: uploadImageAsyncMutation,
		isLoading: isImageUploading,
		isError: imageUploadError
	} = usePostImageMutation()

	const {
		mutateAsync: updateProfileAsyncMutation,
		isLoading: isProfileUpdateLoading,
		isError: isProfileUpdateError
	} = useEditProfileMutation({
		onError: () => {
			addToast({type: "danger", text: "Update failed!"})
		},
		onSuccess: () => {
			addToast({type: "success", text: "Update successful!"})
		}
	})

	const {
		mutateAsync: publishProfileAsyncMutation,
		isLoading: isProfilePublishLoading,
		isError: isProfilePublishError
	} = usePublishTeamMemberMutation()

	const [username, setUsername] = useState("Loading username..")
	const [userProfilePhoto, setUserProfilePhoto] = useState(false)
	const [userToDelete, setUserToDelete] = useState(false)
	const [selectedStatus, setSelectedStatus] = useState(false)

	const {mutateAsync: mutateDeleteUserAsync, isLoading: isDeleteUserLoading} = useDeleteUserProfileMutation()
	const {mutateAsync: mutateDeleteAnswerAsync, isLoading: isDeleteAnswerLoading} = useDeleteUserAnswerMutation()

	useEffect(() => {
		refetch()
	}, [])

	async function onSave(e) {
		e.preventDefault()
		if (validateProfileName()) {
			const profileUpdateOptions = {
				name: username
			}
			if (userProfilePhoto) {
				const uploadedImageResponse = await uploadImageAsyncMutation(userProfilePhoto)
				profileUpdateOptions.profilePhoto = uploadedImageResponse?.data[0].id
			}
			if (selectedStatus) {
				profileUpdateOptions.status = selectedStatus
			}
			await updateProfileAsyncMutation({profileId: parseInt(profileId), putOptions: profileUpdateOptions})
			setUserProfilePhoto(false)
			refetch()
		}
	}

	function navigateAfterAction() {
		if (user.data.data.attributes.status === "pending") {
			navigate("/pending")
		} else {
			navigate("/team")
		}
	}

	async function approveTeamMember() {
		await publishProfileAsyncMutation(parseInt(profileId))
		addToast({type: "success", text: "Update successful!"})
		navigateAfterAction()
	}

	function openDeleteModal(e) {
		e.stopPropagation()
		setUserToDelete(user)
	}

	async function deleteUser() {
		try {
			await mutateDeleteUserAsync(userToDelete.data.data.id)
			userToDelete.attributes?.answers?.data.forEach(async answer => {
				await mutateDeleteAnswerAsync(answer.id)
			})
			setUserToDelete(false)
			addToast({type: "success", text: "Deleted successfully!"})
			navigateAfterAction()
		} catch (err) {
			addToast({type: "danger", text: "Deletion unsuccessful!"})
		}
	}

	const [errorProfileName, setErrorProfileName] = useState(false)
	const validateProfileName = () => {
		if (!username || username === "") {
			setErrorProfileName("Profile Name can't be empty!")
			return false
		} else {
			setErrorProfileName(false)
			return true
		}
	}

	if (isLoading) {
		return <SpinnerLoader/>
	}

	if (isError) {
		return <p>Loading error...</p>
	}

	return (
		<div className="max-w-7xl mx-auto">
			{(isImageUploading || isProfileUpdateLoading || isProfilePublishLoading) && <Loader/>}
			{(imageUploadError || isProfileUpdateError) && <p>Update error... Try again</p>}
			{isProfilePublishError && <p>Publish error :(</p>}
			{userToDelete && <DeleteModal onCancel={() => setUserToDelete(false)}
				user={user.data.data}
				disabled={isDeleteUserLoading || isDeleteAnswerLoading}
				onConfirm={deleteUser}/>}
			<div className="max-w-screen-lg mx-auto">
				<button onClick={navigateAfterAction}
					className="text-sm hover:underline text-orange-500 hover:text-orange-400 flex items-center gap-2 mb-4">
					<i className="fas fa-caret-square-left"/>Go back
				</button>
			</div>
			<div
				className="flex justify-between items-center mx-auto max-w-screen-lg px-6 py-3
				bg-white text-gray-900 shadow-md rounded-lg
				dark:bg-gray-900  dark:text-gray-100"
			>
				{
					(!isLoading &&
                        user?.data?.data?.attributes.status === "pending") ? (
							<>
								<div className="text-base">
                                Moderate team member entry
								</div>
								<div className="flex flex-col md:justify-end gap-4 md:flex-row">
									<button
										className="disabled:opacity-70 text-white bg-orange-600 hover:bg-orange-500 focus:ring-4 focus:ring-orange-200 font-medium rounded text-sm px-5 py-2.5 text-center tracking-wide"
										onClick={approveTeamMember}>Approve
									</button>
									<button
										className="disabled:opacity-70 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 font-medium rounded text-sm px-5 py-2.5 text-center tracking-wide"
										onClick={openDeleteModal}>Delete
									</button>
								</div>
							</>
						) : (<>
							<div className="text-base">
                            Edit Team Member
							</div>
							<div className="flex justify-end align-top">
								<InputPair type={INPUT_TYPES.userStatus} inputValue={selectedStatus}
									setInputValue={e => setSelectedStatus(e.target.value)} selectOptions={STATUS}/>
							</div>
						</>)
				}
			</div>
			<div
				className="flex gap-6 mx-auto flex-col md:flex-row md:justify-between md:items-start max-w-screen-lg py-10"
			>
				<InfoForm
					setName={setUsername}
					name={username}
					setNewPhoto={setUserProfilePhoto}
					newPhoto={userProfilePhoto}
					disabled={isError || isLoading}
					photo={user?.data?.data?.attributes?.profilePhoto?.data?.attributes.url}
					action={onSave}
					onFocus={() => setErrorProfileName(false)}
					onBlur={validateProfileName}
					error={errorProfileName}/>
				<QuestionsAndAnswers companyId={user?.company?.id} profileId={parseInt(profileId)}/>
			</div>
		</div>
	)
}

export default EditUserPage