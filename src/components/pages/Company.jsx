import React, {useState, useEffect} from "react"
import {useMutation} from "react-query"
import api from "../../api"
import InfoForm from "../shared/InfoForm"
import Loader from "../shared/Loader"
import {useGetCompanyQuery, useGetMyProfile, usePostImageMutation} from "../../hooks/reactQueryHooks"
import SpinnerLoader from "../shared/SpinnerLoader"
import {useToast} from "../../contexts/ToastProvider"

const Company = () => {
	const [companyName, setCompanyName] = useState("")
	const [companyLogo, setCompanyLogo] = useState(null)
	const addToast = useToast()

	const [companyID, setCompanyID] = useState(null)

	const {data: userProfile, isError} = useGetMyProfile()
	const {data: company, isLoading} = useGetCompanyQuery(companyID, {
		enabled: !!companyID,
		onSuccess: company => {
			setCompanyName(company.data.data.attributes.name)
		},
		refetchOnWindowFocus: false
	})
	const {
		mutateAsync: uploadImageAsyncMutation,
	} = usePostImageMutation({
		onSuccess: data => {
			const payload = {
				id: companyID,
				name: companyName,
				imageToSend: data?.data[0]?.id
			}
			mutate(payload)
		}
	})
	const {
		mutate,
		isLoading: editLoading,
		isError: editError
	} = useMutation(async (payload) => {
		await api.editOurCompany(payload)
	}, {
		onSuccess: () => addToast({type: "success", text: "Company info successfully changed!"}),
		onError: () => addToast({type: "danger", text: "Error while changing company info!"})
	})

	useEffect(() => {
		if (userProfile) {
			setCompanyID(userProfile.data.data[0].attributes?.company?.data?.id)
		}
	}, [userProfile])

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (validateCompanyName()) {
			const payload = {
				id: companyID,
				name: companyName,
			}
			if (companyLogo) {
				await uploadImageAsyncMutation(companyLogo)
			} else {
				mutate(payload)
			}
		}
	}
	const [errorCompanyName, setErrorCompanyName] = useState(false)
	const validateCompanyName = () => {
		if (!companyName || companyName === "") {
			setErrorCompanyName("Company Name can't be empty!")
			return false
		} else {
			setErrorCompanyName(false)
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
			<div className="flex justify-center items-top mx-auto max-w-screen-lg py-10">
				{editLoading && <Loader/>}
				{editError && <p>Update error... Try again</p>}
				<InfoForm
					isCompany={true}
					name={companyName}
					setName={setCompanyName}
					action={handleSubmit}
					photo={company?.data?.data?.attributes?.logo?.data?.attributes.url}
					newPhoto={companyLogo}
					setNewPhoto={setCompanyLogo}
					disabled={editLoading}
					onFocus={() => setErrorCompanyName(false)}
					onBlur={validateCompanyName}
					error={errorCompanyName}
				/>
			</div>
		</>
	)
}

export default Company