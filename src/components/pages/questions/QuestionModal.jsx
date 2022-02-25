import React from "react"
import PropTypes from "prop-types"
import {useState} from "react"
import {useSelector} from "react-redux"
import {useMutation} from "react-query"
import api from "../../../api"
import Modal from "../../shared/Modal"
import InputPair from "../../shared/InputPair"
import {useGetCompanyQuestions} from "../../../hooks/reactQueryHooks"
import {INPUT_TYPES} from "../../../constants"
import {extractQuestionById, extractQuestionType} from "../../../utils"

function QuestionModal({setModalClose, modalId, addToast}) {
	const [question, setQuestion] = useState("")
	const [answer, setAnswer] = useState("")
	const [answerImage, setAnswerImage] = useState(null)
	const [questionType, setQuestionType] = useState("")
	const companyID = useSelector(state => state.companies.userCompany.data.id)
	const userProfile = useSelector(state => state.user.profile.id)

	const [error, setError] = useState(false)

	useGetCompanyQuestions(companyID, {
		onSuccess: data => {
			setQuestion(extractQuestionById(modalId, data.data.data))
			setQuestionType(extractQuestionType(modalId, data.data.data))
		}
	})

	const {
		mutate
	} = useMutation(async (payload) => {
		if (questionType === "text" || questionType === "long_text") {
			await api.addAnswer(payload)
				.then(() => {
					setModalClose()
				})

		} else if (questionType === "image") {
			await api.addImageAnswer(payload)
				.then(() => {
					setModalClose()
				})
		}
	}, {
		onError: () => {
			addToast({type: "danger", text: "Error while posting answer!"})
		},
		onSuccess: () => {
			addToast({type: "success", text: "Answer added successfully!"})
		}
	})

	const handleAnswer = async (e) => {
		e.preventDefault()
		if (questionType === "text" || questionType === "long_text") {
			if (!answer && answer === "") {
				setError(true)
			} else {
				const payload = {
					questionId: modalId,
					answer: answer,
					userProfile: userProfile
				}
				await mutate(payload)
			}
		} else if (questionType === "image") {
			if (!answerImage && answerImage === null) {
				setError(true)
			} else {
				const payload = {
					questionId: modalId,
					imageToSend: answerImage,
					userProfile: userProfile
				}
				await mutate(payload)
			}
		}

	}

	let jsxAnswerInput = null
	if (questionType === "text" || questionType === "long_text") {
		jsxAnswerInput = (
			<div>
				<InputPair type="text" inputValue={answer}
					setInputValue={e => setAnswer(e.target.value)} labelText="Your answer"/>
				{error && <span className="text-xs text-red-700">Please, enter your answer.</span>}
			</div>
		)
	} else if (questionType === "image") {
		jsxAnswerInput = (
			<div>
				<InputPair type={INPUT_TYPES.image} inputValue={answerImage}
					setInputValue={e => setAnswerImage(e.target.files[0])} labelText="Place for your picture"/>
				{error && <span className="text-xs text-red-700">Please, upload your picture.</span>}
			</div>
		)
	}

	return (
		<Modal closeModal={() => setModalClose(true)}>
			<div
				className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all p-6 flex-col align-middle text-gray-900 dark:text-white dark:bg-gray-900 w-[300px] md:w-[500px]">
				<div className="flex justify-between items-center mb-3">
					<h1 className="text-lg text-gray-900 dark:text-white">Answer The Question</h1>
					<button
						onClick={() => {
							setModalClose()
						}}
					>
						<i className="fas fa-times text-gray-900 dark:text-gray-100"/>
					</button>
				</div>
				<p className="text-base lg:text-lg text-gray-900 dark:text-gray-100 mb-5">{question}</p>

				{jsxAnswerInput}

				<div className="mt-5 flex justify-center items-center gap-6">
					<button className="text-white bg-red-700 hover:bg-red-500 rounded px-4 py-2"
						onClick={() => {
							setModalClose()
						}}
					>
                        Cancel
					</button>
					<button className="text-white bg-orange-600 hover:bg-orange-500 rounded px-4 py-2" type="button"
						onClick={handleAnswer}>SUBMIT
					</button>
				</div>
			</div>
		</Modal>
	)
}

QuestionModal.propTypes = {
	modalId: PropTypes.number,
	setModalClose: PropTypes.func,
	addToast: PropTypes.func
}

export default QuestionModal
