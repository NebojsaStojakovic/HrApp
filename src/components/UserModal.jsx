import React from "react"
import Modal from "./shared/Modal"
import PropTypes from "prop-types"
import {useAnswersQuery} from "../hooks/reactQueryHooks"
import SpinnerLoader from "./shared/SpinnerLoader"

function UserModal({user, closeModal}) {

	const {data: answers, isLoading, isError} = useAnswersQuery(user.id)

	return (
		<Modal closeModal={closeModal}>
			<div className="absolute cursor-pointer top-3 right-5" onClick={closeModal}>
				<i className="fas text-gray-900 dark:text-gray-100 fa-times text-base"/>
			</div>
			<div className="flex flex-col md:flex-row w-[300px] max-h-5/6 md:w-[700px] md:max-h-[500px] bg-white dark:bg-gray-800 dark:text-white">
				<div className="flex-1">
					<div className="p-5 pt-6 flex justify-center items-center flex-col">
						{user.attributes?.profilePhoto?.data?.attributes.url ? (
							<img className="inline object-cover w-[150px] h-[150px] rounded-full border shadow"
								src={user.attributes?.profilePhoto?.data?.attributes.url} alt=""/>
						) : (
							<div
								className="flex justify-center items-center w-[150px] h-[150px] rounded-full border shadow">
								{user.attributes.name.split(" ").reduce((prev, newVal) => prev + newVal.charAt(0), "")}
							</div>
						)}
						<div>
							<h3 className="font-medium leading-tight text-2xl my-2">{user.attributes.name}</h3>
						</div>
					</div>
				</div>
				<div className="border dark:border-none flex-1 p-5 overflow-auto">
					{isLoading && (
						<div>
                                Loading answers
							<SpinnerLoader/>
						</div>
					)}
					{isError && (
						<div>
                                Could not load answers
						</div>
					)}
					{
						answers?.data?.data?.map(answer => {
							if (!answer.attributes?.question?.data) return null
							return (
								<div className="py-2" key={answer.id}>
									<div className="text-lg font-bold">
										{answer?.attributes?.question?.data?.attributes?.text}
									</div>
									<div className="text-sm py-2">
										{
											answer?.attributes?.question?.data?.attributes?.type === "image" ? (
												<div className="border dark:border-none shadow mx-2">
													<img src={answer?.attributes?.answer} alt=""/>
												</div>
											) : (
												<div>
													<p>{answer?.attributes?.answer}</p>
												</div>
											)
										}
									</div>
								</div>)
						})
					}
					{
						(answers?.data?.data?.length === 0) && <div className="p-5">No answers..</div>
					}
				</div>
			</div>
		</Modal>
	)
}

UserModal.propTypes = {
	user: PropTypes.object,
	closeModal: PropTypes.func,
}

export default UserModal