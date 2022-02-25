import React, { useState } from "react"
import { useMutation } from "react-query"
import api from "../../../api"
import { useSelector } from "react-redux"
import SpinnerLoader from "../../shared/SpinnerLoader"
import { useGetCompanyQuestions } from "../../../hooks/reactQueryHooks"
import "../../../styles/CustomStyles.css"
import InputPair from "../../shared/InputPair"
import {useToast} from "../../../contexts/ToastProvider"

export const AnswerQuestionsPage = () => {
	const companyID = useSelector(state => state.companies.userCompany.data.id)
	const userProfile = useSelector(defaultState => defaultState.user?.profile?.id)
	const [index,setIndex] = useState(0)
	const [questions, setQuestions] = useState([index])
	const [answer, setAnswer] = useState("")
	const [answerImage, setAnswerImage] = useState(null)
	const [error, setError] = useState(false)

	const addToast = useToast()

	const {isLoading} = useGetCompanyQuestions(companyID, {
		onSuccess: data => {
			const sortedQuestions = data?.data?.data
			setQuestions(sortedQuestions)
		}
	})

	const {id, attributes} = questions[index]
	const text = attributes?.text
	const questionType = attributes?.type
	const questionId = id

	const checkNumber = (number) =>{
		if(number > questions.length - 1){
			return 0
		}
		if(number < 0){
			return questions.length - 1
		}

		return number
	}

	const prevPerson = ()=>{
		setIndex((index)=>{
			let newIndex = index -1
			return checkNumber(newIndex)
		})
	}
   
	const nextPerson = ()=>{
		setIndex((index)=>{
			let newIndex = index + 1
			return checkNumber(newIndex)
		})
	}

	const {
		mutate
	} = useMutation((payload)=>{ 
		if(questionType === "text" || questionType === "long_text") {
			api.addAnswer(payload)
			
		} else if(questionType === "image") {
			api.addImageAnswer(payload)
		}
	},{
		onSuccess: () => {
			if (questionType === "text" || questionType === "long_text") {
				addToast({ type: "success", text: "Answer added successfully!" })
			} else if (questionType === "image"){
				addToast({ type: "success", text: "Image added successfully!" })
			}
		},
		onError: () => {
			addToast({ type: "danger", text: "Answering failed!" })
		}
	})

	const handleAnswer = (e)=> {
		e.preventDefault()
		if(questionType === "text" || questionType === "long_text") {
			if(!answer && answer === "") {
				setError(true)
			} else {
				const payload = {
					questionId: questionId,
					answer: answer,
					userProfile: userProfile
				}
				mutate(payload)
				setAnswer("")
			}
		} else if(questionType === "image") {
			if(!answerImage && answerImage === null) {
				setError(true)
			} else {
				const payload = {
					questionId: questionId,
					imageToSend: answerImage,
					userProfile: userProfile
				}
				mutate(payload)
				setAnswerImage(null)
			}
		}
		
	}

	
	let jsxAnswerInput = null
	if (questionType === "text" || questionType === "long_text") {
		jsxAnswerInput = (
			<div>
				<InputPair type="text" inputValue={answer}
					setInputValue={e => setAnswer(e.target.value)} labelText="Your answer"/>
				{error && <span className="text-xs text-red-700">Please, enter your answer.</span> }
			</div>
		)
	} else if (questionType === "image") {
		jsxAnswerInput = (
			<div>
				<InputPair type="image" inputValue={answerImage}
					setInputValue={e => setAnswerImage(e.target.files[0])} labelText="Place for your picture"/>
				{error && <span className="text-xs text-red-700">Please, upload your picture.</span> }
			</div>
		)
	}

	if (isLoading) {
		return <SpinnerLoader/>
	}

	return (
		<>
			<div className="flex justify-between align-top mx-auto max-w-screen-lg py-10">
				<div className="relative overflow-hidden rounded-lg shadow-lg w-64 md:w-2/3 m-auto bg-white dark:bg-gray-900 p-5">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8 text-gray-900 dark:text-white">
						<p>Please answer these questions?</p>
						<span >
							<span className="text-sm lg:txt-base">Question {index + 1}/{questions.length}</span>
						</span>
					</div>
					<div className="mb-5">
						<p className="text-base lg:text-lg text-gray-900 dark:text-gray-100 mb-5 capitalize">{text}</p>
						{jsxAnswerInput}
						<button className="text-white bg-orange-600 w-full md:w-2/5 hover:bg-orange-500 rounded px-5 py-2 mt-4 text-sm shadow-md" type="button" onClick={handleAnswer}>Submit</button>
					</div>
					<div className="flex items-center justify-center gap-5">
						<button className="cursor-pointer tooltip" onClick={prevPerson}>
							<i className="fas fa-caret-square-left text-gray-900 hover:text-gray-600 text-3xl dark:text-white"/>
							<span className="tooltiptext">prev question</span>
						</button>
						<button className="cursor-pointer tooltip" onClick={nextPerson}>
							<i className="fas fa-caret-square-right text-gray-900 hover:text-gray-600 text-3xl dark:text-white"/>
							<span className="tooltiptext">next question</span>
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
