import React, {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router"
import PropTypes from "prop-types"
import {useMutation, useQueryClient} from "react-query"
import api from "../../../api"
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import InputPair from "../../shared/InputPair"
import {INPUT_TYPES} from "../../../constants"
import {useToast} from "../../../contexts/ToastProvider"
import {makeUniqueOrder} from "../../../utils"
import {useGetAllQuestionsQuery} from "../../../hooks/reactQueryHooks"

const AddQuestion = (props) => {
	let {id} = useParams()
	id = parseInt(id)
	const modeEdit = props.modeEdit
	const [uniqueOrders, setUniqueOrders] = useState({})
	const [questionName, setQuestionName] = useState("")
	const [questionType, setQuestionType] = useState("text")
	const [questionOrder, setQuestionOrder] = useState("")
	const navigate = useNavigate()

	const queryClient = useQueryClient()

	const companyID = useSelector(defaultState => defaultState.user.profile.attributes.company.data.id)

	const TYPE = [
		{id: "text", attributes: {name: "Text"}},
		{id: "long_text", attributes: {name: "Long text"}},
		{id: "image", attributes: {name: "Image"}}
	]

	const {refetch} = useGetAllQuestionsQuery({
		onSuccess: (data) => {
			const arr = data?.data?.data
			arr.forEach(question => {
				const order = question?.attributes.order
				setUniqueOrders((uniqueOrders) => {
					return {
						...uniqueOrders,
						[order]: true
					}
				})
				if (question.id === id) {
					setQuestionName(question?.attributes.text)
					setQuestionType(question?.attributes.type)
					setQuestionOrder(question?.attributes.order)

				}
			})
			queryClient.invalidateQueries("getQuestions")
		},
		enabled: false
	})

	useEffect(() => {
		refetch()
	}, [])

	const {
		mutate
	} = useMutation((payload) => {
		if (modeEdit === true) {
			api.editQuestions(payload)
		} else {
			api.addQuestions(payload)
		}
	}, {
		onSuccess: () => {
			if (modeEdit === true) {
				addToast({type: "success", text: "Question edited successfully!"})
			} else {
				addToast({type: "success", text: "Question added successfully!"})
			}

			setTimeout(() => {
				navigate("/questions")
			}, 1000)
		},
		onError: () => {
			if (modeEdit === true) {
				addToast({type: "danger", text: "Question edit failed!"})
			} else {
				addToast({type: "danger", text: "Adding question failed!"})
			}
		}
	})

	const [error, setError] = useState(false)
	const addToast = useToast()


	const handleQuestion = (e) => {
		e.preventDefault()
		if (modeEdit === true) {
			// EDIT
			const payload = {
				id,
				text: questionName,
				type: questionType,
				order: questionOrder
			}
			mutate(payload)
		} else {
			// ADD
			if (!questionName || questionName === "") {
				setError(true)
			} else {
				const payload = {
					companyID,
					text: questionName,
					type: questionType,
					order: makeUniqueOrder(uniqueOrders)
				}
				mutate(payload)
			}
		}
	}


	return (
		<>
			<div className="text-center">
				<h2 className="inline-block bg-white mb-3 rounded shadow-lg text-gray-900 py-2 px-4">{modeEdit ? "Edit question" : "Add question"}</h2>

				<div className="flex justify-between items-center mx-auto max-w-screen-lg py-10">
					<div
						className="bg-white  rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto">
						<form className="space-y-6" action="#">
							<div>
								<InputPair
									type={INPUT_TYPES.text} inputValue={questionName}
									setInputValue={e => setQuestionName(e.target.value)}
									labelText="Question name"/>
								{error && <span className="text-xs text-red-700">Please, enter a question name</span>}
							</div>
							<div>
								<InputPair
									type={INPUT_TYPES.select} inputValue={questionType}
									setInputValue={e => setQuestionType(e.target.value)}
									labelText="Question type" selectOptions={TYPE}/>
							</div>

							<button type="submit"
								className="w-full text-white inline-block bg-orange-600 hover:bg-orange-500 mb-5 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center"
								onClick={handleQuestion}>{modeEdit ? "Save" : "Add"}
							</button>
							<div>
								<Link
									to="/questions"
									className="text-sm hover:underline text-gray-900 hover:text-orange-600 dark:text-gray-100">back</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)

}

AddQuestion.propTypes = {
	modeEdit: PropTypes.bool,
}

export default AddQuestion
