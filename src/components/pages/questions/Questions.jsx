import React, {useState} from "react"
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import SingleQuestion from "./SingleQuestion"
import QuestionModal from "./QuestionModal"
import DraggableList from "./draganddrop/list/DraggableList"
import SpinnerLoader from "../../shared/SpinnerLoader"
import {useGetCompanyQuestions} from "../../../hooks/reactQueryHooks"
import {useToast} from "../../../contexts/ToastProvider"

export const Questions = () => {
	const [modalOpen, setModalOpen] = useState(false)
	const [modalId, setModalId] = useState(null)
	const [questionList, setQuestionList] = useState([])
	const companyID = useSelector(state => state.companies.userCompany.data.id)
	const addToast = useToast()

	const {refetch, isLoading, isFetching} = useGetCompanyQuestions(companyID, {
		onSuccess: companyQuestions => {
			const sortedQuestions = companyQuestions.data.data
			setQuestionList(sortedQuestions)
		},
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	})

	const DraggableQuestion = question => (
		<SingleQuestion question={question}
			key={question.id}
			setModalOpen={(id) => {
				setModalOpen(true)
				setModalId(id)
			}}
		/>
	)

	if (isLoading) {
		return <SpinnerLoader/>
	}

	if (questionList.length === 0 && isFetching) {
		return <SpinnerLoader/>
	}


	return (
		<>
			{modalOpen && <QuestionModal setModalClose={() => {
				setModalOpen(false)
			}} modalId={modalId}
			addToast={addToast}
			/>}
			<div className="flex flex-col items-center full md:w-4/5 mx-auto">
				<Link to={"/add-question"}><button className="bg-orange-600 hover:bg-orange-500 mb-5 rounded shadow-lg text-gray-100 py-2 px-4 tracking-wide">ADD QUESTION</button></Link>
			
				{questionList.length > 0 ? <DraggableList
					questionList={questionList}
					setQuestionList={setQuestionList}
					renderItemContent={(item) => DraggableQuestion(item)}
				/> : <p className="text-gray-900 dark:text-white">There is no posted questions.</p>}

			</div>
		</>
	)
}
