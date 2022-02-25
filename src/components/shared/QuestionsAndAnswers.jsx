import React, {useEffect, useState} from "react"
import {
	useAnswersQuery,
	usePostAnswerMutation,
	usePostImageMutation,
	useQuestionsQuery,
	useUpdateAnswerMutation
} from "../../hooks/reactQueryHooks"
import PropTypes from "prop-types"
import InputPair from "./InputPair"
import Loader from "./Loader"
import {useToast} from "../../contexts/ToastProvider"

function QuestionsAndAnswers({profileId, companyId}) {

	const addToast = useToast()

	const {
		data: questions,
		isLoading: questionsLoading,
		isError: questionsError,
		refetch: fetchQuestions
	} = useQuestionsQuery(companyId, {
		onSuccess: () => {
			answers && questions && mapAnswersToQuestions(questions, answers)
		},
		enabled: false
	})

	const {
		data: answers,
		isLoading: answersLoading,
		isError: answersError,
		refetch: fetchAnswers
	} = useAnswersQuery(profileId, {
		onSuccess: () => {
			answers && questions && mapAnswersToQuestions(questions, answers)
		},
		enabled: false
	})

	const {
		isError: updateAnswerError,
		isLoading: updateAnswerLoading,
		mutateAsync: updateAnswerAsync,
	} = useUpdateAnswerMutation()
	const {
		isError: postAnswerError,
		isLoading: postAnswerLoading,
		mutateAsync: postAnswerAsync,
	} = usePostAnswerMutation()

	const {
		isError: uploadImageError,
		isLoading: uploadImageLoading,
		mutateAsync: uploadImageAsync
	} = usePostImageMutation()

	const [mappedQuestionsAndAnswers, setMappedQuestionsAndAnswers] = useState([])

	useEffect(() => {
		fetchAnswers()
		fetchQuestions()
	}, [])

	function updatePair(e, pair) {
		if (pair.attributes.type === "image") {
			setMappedQuestionsAndAnswers(oldQA => oldQA.map(question => {
				if (question.id !== pair.id) return question
				const newQuestion = {
					...question,
					changed: true
				}
				if (!newQuestion.attributes.answers.data[0]) {
					newQuestion.attributes.answers.data = [{
						attributes: {
							answer: URL.createObjectURL(e.target.files[0]),
							file: e.target.files[0],
							question: question.id,
							profile: profileId,
						}
					}]
				} else {
					newQuestion.attributes.answers.data[0] = {
						...newQuestion.attributes.answers.data[0],
						attributes: {
							...newQuestion.attributes.answers.data[0].attributes,
							file: e.target.files[0],
							answer: URL.createObjectURL(e.target.files[0]),
						}
					}
				}
				return newQuestion
			}))

		} else {
			setMappedQuestionsAndAnswers(oldQA => oldQA.map(question => {
				if (question.id !== pair.id) return question
				const newQuestion = {
					...question,
					changed: true
				}
				if (!newQuestion.attributes.answers.data[0]) {
					newQuestion.attributes.answers.data = [{
						attributes: {
							answer: e.target.value,
							question: question.id,
							profile: profileId,
						}
					}]
				} else {
					newQuestion.attributes.answers.data[0] = {
						...newQuestion.attributes.answers.data[0],
						attributes: {
							...newQuestion.attributes.answers.data[0].attributes,
							answer: e.target.value,
						}
					}
				}
				return newQuestion
			}))
		}
	}

	function saveAnswers(e) {
		e.preventDefault()
		try {
			mappedQuestionsAndAnswers.forEach(async pair => {
				if (!pair.changed) return
				// sets changed to false to stop additional updates on save
				const mockEvent = {
					target: {
						value: pair.attributes.answers.data[0].attributes.answer
					}
				}
				const {
					...newPair
				} = pair
				if (pair.attributes.type !== "image"){
					updatePair(mockEvent, newPair)
				}

				// no id means it's a new answer
				if (!Object.prototype.hasOwnProperty.call(pair.attributes.answers.data[0], "id")) {
					const currentAnswer = pair.attributes.answers.data[0]

					const payload = {
						questionId: currentAnswer.attributes.question,
						answer: currentAnswer.attributes.answer,
						userProfile: currentAnswer.attributes.profile
					}

					if (pair.attributes.type === "image") {
						const uploadImageResponse = await uploadImageAsync(currentAnswer.attributes.file)
						payload.answer = uploadImageResponse.data[0].url
					}

					await postAnswerAsync(payload)
				} else {
					const currentAnswer = pair.attributes.answers.data[0]
					const payload = {
						answerId: currentAnswer.id,
						questionId: currentAnswer.attributes.question,
						answer: currentAnswer.attributes.answer,
						userProfile: currentAnswer.attributes.profile
					}

					if (pair.attributes.type === "image") {
						const uploadImageResponse = await uploadImageAsync(currentAnswer.attributes.file)
						payload.answer = uploadImageResponse.data[0].url
					}

					await updateAnswerAsync(payload)
				}
			})
			addToast({type: "success", text: "Answers successfully updated!"})
		} catch (err) {
			addToast({type: "danger", text: "Error while updating answers!"})
		}

	}

	function mapAnswersToQuestions(questions, answers) {
		const newQuestions = questions.data.data.map(question => {
			question.attributes.answers.data = question.attributes.answers.data.filter(answer => {
				return answers.data.data.some(answerInAnswers => {
					return answerInAnswers.id === answer.id
				})
			})
			return question
		})
		setMappedQuestionsAndAnswers(newQuestions)
	}

	if (questionsError || answersError || uploadImageError) {
		return <p>Loading error...</p>
	}

	const disabled = postAnswerLoading || updateAnswerLoading

	return (
		<>
			<div
				className="bg-white shadow-md rounded-lg w-full max-w-md p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
				{updateAnswerLoading || postAnswerLoading && <Loader/>}
				{questionsLoading || answersLoading || uploadImageLoading && <Loader />}
				{updateAnswerError || postAnswerError && <p>Update error... :(</p>}
				<form onSubmit={saveAnswers}>
					{mappedQuestionsAndAnswers.map(pair => {
						return (
							<InputPair
								key={pair.id}
								labelText={pair.attributes.text}
								inputValue={pair.attributes.answers?.data[0]?.attributes.answer}
								type={pair.attributes?.type}
								setInputValue={e => updatePair(e, pair)}
							/>
						)
					})}
					<button type="submit"
						disabled={disabled}
						className="disabled:opacity-70 text-white w-full bg-orange-600 hover:bg-orange-500 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center"
					>
                        Save
					</button>
				</form>
			</div>
		</>
	)
}

QuestionsAndAnswers.propTypes = {
	profileId: PropTypes.number,
	companyId: PropTypes.number,
}

export default QuestionsAndAnswers