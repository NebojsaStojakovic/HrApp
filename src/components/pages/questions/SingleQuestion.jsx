import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {useNavigate} from "react-router"
import DeleteModal from "../../shared/DeleteModal"
import {useSelector} from "react-redux"
import "../../../styles/CustomStyles.css"
import {useDeleteQuestionMutation, useDeleteUserAnswerMutation} from "../../../hooks/reactQueryHooks"
import {useQueryClient} from "react-query"
import {useToast} from "../../../contexts/ToastProvider"

const SingleQuestion = ({question, setModalOpen}) => {

	const queryClient = useQueryClient()

	const navigate = useNavigate()
	const isAdmin = useSelector(defaultState => defaultState.user.profile.attributes.userRole)
	const [admin, setAdmin] = useState("")
	const addToast = useToast()
	const [questionDeleteModal, setQuestionDeleteModal] = useState(false)
	const {id, attributes: {text}} = question

	const {mutateAsync: deleteAnswerAsync} = useDeleteUserAnswerMutation()
	const {mutateAsync: deleteQuestionAsync} = useDeleteQuestionMutation({
		onSuccess: async deletedQuestion => {
			deletedQuestion?.data?.data.attributes?.answers?.data?.forEach(async answer => {
				return await deleteAnswerAsync(answer.id)
			})
			addToast({type: "success", text: "Question deleted successfully!"})
			queryClient.invalidateQueries("getQuestions")
		},
		onError: () => {
			addToast({type: "danger", text: "Question deletetion failed!"})
		}
	})

	useEffect(() => {
		if (isAdmin === "company_admin") {
			setAdmin(isAdmin)
		}
	}, [])

	const handleEdit = (id) => {
		navigate(`/edit-question/${id}`)
	}

	const handleDelete = async (id) => {
		await deleteQuestionAsync(id)
		setQuestionDeleteModal(false)
	}

	return (
		<>
			{questionDeleteModal &&
                <DeleteModal onCancel={() => setQuestionDeleteModal(false)} modeQuestion={true} onConfirm={() => {handleDelete(id)}}
                />}
			<div
				className="flex items-center justify-between w-full bg-white rounded-lg shadow-lg text-gray-900 px-4 py-4 dark:bg-gray-900 dark:text-white">
				<div className="flex items-center gap-2 mr-1">
					<button className="flex mr-2">
						<i className="fas fa-bars cursor-pointer text-sm"/>
					</button>
					<div>
						<p>{text}</p>
					</div>
				</div>

				<div className="flex justify-between gap-2">
					<div className="flex gap-2">
						{admin && <div className="flex items-center gap-2">
							<button className="tooltip" onClick={() => {
								handleEdit(id)
							}}>
								<i className="far fa-edit hover:text-green-700 cursor-pointer"/>
								<span className="tooltiptext">edit</span>
							</button>
							<button className="tooltip" onClick={() => {
								setQuestionDeleteModal(true)
							}}>
								<i className="far fa-trash-alt hover:text-red-700 cursor-pointer"/>
								<span className="tooltiptext">delete</span>
							</button>
						</div>}

						<div className="flex items-center">
							<button className="tooltip" onClick={() => {
								setModalOpen(id)
							}}>
								<i className="far fa-eye hover:text-cyan-800 cursor-pointer"/>
								<span className="tooltiptext">answer</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

SingleQuestion.propTypes = {
	question: PropTypes.object,
	setModalOpen: PropTypes.func,
	setQuestionDeleteModal: PropTypes.func,
}

export default SingleQuestion
