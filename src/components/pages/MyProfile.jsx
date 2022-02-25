import React, {useEffect, useState} from "react"
import {useMutation} from "react-query"
import api from "../../api"
import SpinnerLoader from "../shared/SpinnerLoader"
import {useGetMyProfile, usePostImageMutation} from "../../hooks/reactQueryHooks"
import InfoForm from "../shared/InfoForm"
import Loader from "../shared/Loader"
import InputPair from "../shared/InputPair"
import {INPUT_TYPES} from "../../constants"
import {useToast} from "../../contexts/ToastProvider"

const MyProfile = () => {

	const [userName, setUserName] = useState("")
	const [userEmail, setUserEmail] = useState("")
	const [userProfilePhoto, setUserProfilePhoto] = useState(null)
	const [profileId, setProfileId] = useState(null)
	const [image, setImage] = useState(null)

	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const addToast = useToast()

	const {isLoading, isError, refetch} = useGetMyProfile({
		onSuccess: data => {
			setProfileId(data?.data?.data?.[0].id)
			setImage(data?.data?.data?.[0].attributes.profilePhoto.data?.attributes.formats.thumbnail.url)
			setUserEmail(data?.data?.data?.[0]?.attributes.user.data.attributes.email)
			setUserName(data?.data?.data?.[0]?.attributes.name)
		},
		refetchOnWindowFocus: false
	})

	const {
		mutateAsync: uploadImageAsyncMutation
	} = usePostImageMutation()

	const {
		mutateAsync,
		isLoading: editLoading,
		isError: editError
	} = useMutation(async (payload) => {
		await api.editProfile(payload.id, payload)
	}, {
		onSuccess: () => addToast({type: "success", text: "Profile successfully changed!"}),
		onError: () => addToast({type: "danger", text: "Failed to update profile!"})
	})

	const {
		mutate: password,
	} = useMutation(async (payload) => {
		await api.editPassword(payload)
	}, {
		onSuccess: () => addToast({type: "success", text: "Password successfully changed!"}),
		onError: () => addToast({type: "danger", text: "Failed to change password!"})
	})

	useEffect(() => {
		refetch()
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		if(validateProfileName()) {
			const updateOptions = {
				id: profileId,
				username: userName,
			}
			if (userProfilePhoto) {
				const uploadedImageResponse = await uploadImageAsyncMutation(userProfilePhoto)
				updateOptions.profilePhoto = uploadedImageResponse?.data[0].id
			}
			await mutateAsync(updateOptions)
			setUserProfilePhoto(false)
			refetch()
		}
	}

	const handlePassword = (e) => {
		e.preventDefault()
		if (profileId) {
			const payload = {
				id: profileId,
				password: newPassword,
				passwordConfirmation: newPassword
			}
			password(payload)
		}
	}

	const [errorProfileName, setErrorProfileName] = useState(false)
	const validateProfileName = () => {
		if (!userName || userName === "") {
			setErrorProfileName("Profile Name can't be empty!")
			return false
		} 
		else {
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
		<>
			{editLoading && <Loader/>}
			{editError && <p>Update error... Try again</p>}
			<div
				className="flex flex-col lg:flex-row lg:justify-between lg:items-start mx-auto max-w-screen-lg gap-4">
				<InfoForm
					name={userName}
					setName={setUserName}
					action={handleSubmit}
					photo={image}
					newPhoto={userProfilePhoto}
					setNewPhoto={setUserProfilePhoto}
					disabled={editLoading}
					onFocus={()=>setErrorProfileName(false)} 
					onBlur={validateProfileName} 
					error={errorProfileName}
				/>
				<div
					className="bg-white shadow-md border border-gray-200 rounded-lg w-full max-w-md p-4 sm:p-6 lg:p-8 dark:bg-gray-900 dark:border-gray-700">
					<span className="text-lg font-medium text-gray-900 block mb-2 dark:text-gray-100">Security</span>
					<div>
						<span
							className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-100">Your email: {userEmail}</span>
					</div>
					<div>
						<InputPair type={INPUT_TYPES.password} inputValue={oldPassword}
							setInputValue={e => setOldPassword(e.target.value)} labelText="Current password"/>
					</div>
					<div>
						<InputPair type={INPUT_TYPES.password} inputValue={newPassword}
							setInputValue={e => setNewPassword(e.target.value)} labelText="New password"/>
					</div>
					<button type="submit"
						className=" text-white w-full bg-orange-600 hover:bg-orange-500 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center tracking-wide"
						onClick={handlePassword}>Save
					</button>
				</div>
			</div>
		</>
	)
}

export default MyProfile