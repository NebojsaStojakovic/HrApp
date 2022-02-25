import React, {useState} from "react"
import {useGetAllCompanies, useGetAllFilteredProfilesQuery} from "../../hooks/reactQueryHooks"
import UserCard from "../shared/UserCard"
import UserModal from "../UserModal"
import InputPair from "../shared/InputPair"
import {INPUT_TYPES, ORDER, SORT} from "../../constants"
import useDebounce from "../../hooks/useDebounce"
import SpinnerLoader from "../shared/SpinnerLoader"

function CompanyWall() {

	const [modalUser, setModalUser] = useState(null)
	const [page, setPage] = useState(1)
	const [selectedCompany, setSelectedCompany] = useState(7)
	const [order, setOrder] = useState("desc")
	const [searchName, setSearchName] = useState("")
	const searchNameDebounced = useDebounce(searchName, 500)
	const [sort, setSort] = useState("createdAt")

	const {
		data: users, isLoading: usersLoading, isError: usersError, isPreviousData, isFetching
	} = useGetAllFilteredProfilesQuery({
		page: page,
		company: selectedCompany,
		sort,
		order,
		name: searchNameDebounced
	},
	{
		keepPreviousData: true,
	})

	const {
		data: companies
	} = useGetAllCompanies()

	if (usersLoading) {
		return <SpinnerLoader/>
	}

	if (usersError) {
		return <p>Loading error...</p>
	}

	return (
		<>
			<div className="max-w-7xl mx-auto">
				<div
					className="flex flex-col md:gap-4 md:flex-row md:justify-between md:flex-wrap items-center w-full mx-auto p-6 bg-white rounded-lg shadow-lg text-gray-900 dark:bg-gray-900 dark:text-gray-100 mb-6">
					<div className="w-full md:w-44">
						<InputPair
							labelText="Select a company"
							inputValue={selectedCompany}
							setInputValue={e => setSelectedCompany(e.target.value)}
							selectOptions={companies?.data?.data}
							type={INPUT_TYPES.select}/>
					</div>
					<div className="w-full md:flex-1 md:max-w-2xl">
						<InputPair
							labelText="Search by name"
							inputValue={searchName}
							setInputValue={e => setSearchName(e.target.value)}
							type={INPUT_TYPES.text}/>
					</div>
					<div className="w-full md:w-32">
						<InputPair
							labelText="Sort by"
							inputValue={sort}
							setInputValue={e => setSort(e.target.value)}
							selectOptions={SORT}
							type={INPUT_TYPES.select}/>
					</div>
					<div className="w-full md:w-20">
						<InputPair
							labelText="Order"
							inputValue={order}
							setInputValue={e => setOrder(e.target.value)}
							selectOptions={ORDER}
							type={INPUT_TYPES.select}/>
					</div>

				</div>
				{modalUser && <UserModal user={modalUser} closeModal={() => setModalUser(null)}/>}
				<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{
						users?.data?.data?.map(user => (
							<div key={user.id} className="cursor-pointer" onClick={() => setModalUser(user)}>
								<UserCard user={user} noActions/>
							</div>
						))
					}
				</div>
				<div className="flex justify-between items-center mt-5">
					<span className="text-sm text-gray-900 dark:text-gray-100">Page: {page}</span>
					<div className="flex gap-2">
						<button
							className="text-sm bg-orange-600 hover:bg-orange-500 text-gray-100 font-semibold py-1 px-2 disabled:opacity-50 rounded"
							onClick={() => setPage(old => Math.max(old - 1, 0))}
							disabled={page === 1}
						>
                        Prev Page
						</button>
						<button
							className="text-sm bg-orange-600 font-semibold text-gray-100 py-1 px-2 disabled:opacity-50 rounded"
							onClick={() => {
								if (!isPreviousData && (users?.data?.meta?.pagination?.pageCount > page)) {
									setPage(old => old + 1)
								}
							}}
							// Disable the Next Page button until we know a next page is available
							disabled={isPreviousData || (users?.data?.meta?.pagination?.pageCount <= page)}
						>
                        Next Page
						</button>
					</div>
				</div>
				{isFetching ?
					<span className="block text-base font-semibold text-center text-orange-600"> Loading...</span> : null}
			</div>
		</>
	)
}

export default CompanyWall