import React, { useState } from "react"
import {useSelector} from "react-redux"
import {useGetCompanyQuery, usePublishedTeamMemberProfiles} from "../../hooks/reactQueryHooks"
import SpinnerLoader from "../shared/SpinnerLoader"
import UserCard from "../shared/UserCard"

export const TeamViewPage = () => {
	const company = useSelector(state => state.companies.userCompany.data)
	const [companyLogo, setCompanyLogo] = useState(null)
	const {data: teamMembers, isLoading, isError} = usePublishedTeamMemberProfiles(company.id)

	useGetCompanyQuery(company.id, {
		onSuccess: company => {
			setCompanyLogo(company.data.data.attributes.logo.data.attributes.url)
		}
	})

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
		<>
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-start py-5">
					<div className="flex flex-col items-center md:flex-row md:items-center gap-6">
						<img className="w-36 h-36 md:w-24 md:h-24 rounded-md" src={companyLogo} alt={company?.attributes.name}/>
						<h1 className="text-gray-900 dark:text-gray-100 text-xl md:text-2xl tracking-wide">{company?.attributes.name}</h1>
					</div>
				</div>
				<div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1">
					{
						teamMembers?.data?.data?.map(user => (
							<UserCard user={user} key={user.id} noActions />
						))
					}
				</div>
			</div>
		</>
	)
}
