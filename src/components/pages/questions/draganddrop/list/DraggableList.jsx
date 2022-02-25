import React, {useState} from "react"
import PropTypes from "prop-types"

import "./draggable-list.css"

import DraggableListItem from "./DraggableListItem"
import {useMutation} from "react-query"
import api from "../../../../../api"
import Loader from "../../../../shared/Loader"
import {useToast} from "../../../../../contexts/ToastProvider"

const DraggableList = ({renderItemContent, questionList, setQuestionList}) => {

	// get index of draged item
	const [dragStartIndex, setDragStartIndex] = useState(null)

	const addToast = useToast()

	const onDragStart = (index) => setDragStartIndex(index)

	// update list when item dropped
	const onDrop = (dropIndex) => {
		// get draged item
		const dragItem = questionList[dragStartIndex]
		// update order in the list
		let list = [...questionList]
		if (dragStartIndex > dropIndex) {
			const tmp = list[dropIndex].attributes.order
			for (let i = dropIndex; i < dragStartIndex; i++) {
				list[i].attributes.order = list[i + 1].attributes.order
			}
			list[dragStartIndex].attributes.order = tmp
		} else {
			const tmp = list[dropIndex - 1].attributes.order
			for (let i = dropIndex - 1; i > dragStartIndex; i--) {
				list[i].attributes.order = list[i - 1].attributes.order
			}
			list[dragStartIndex].attributes.order = tmp
		}
		// update list
		list.splice(dragStartIndex, 1)
		if (dragStartIndex < dropIndex) {
			setQuestionList([
				...list.slice(0, dropIndex - 1),
				dragItem,
				...list.slice(dropIndex - 1, list.length)
			])
		} else {
			setQuestionList([
				...list.slice(0, dropIndex),
				dragItem,
				...list.slice(dropIndex, list.length)
			])
		}

	}
	const {
		mutateAsync,
		isLoading: isUpdatingQuestionOrder,
	} = useMutation(async (payload) => {
		return await api.putNewQuestionsOrder(payload)
	})

	const handleNewOrder = async (e) => {
		e.preventDefault()

		try {
			for (let i = 0; i < questionList.length; i++) {
				// delete old order
				await mutateAsync({id: questionList[i].id, order: -(questionList[i].attributes.order + 11000)})
			}

			for (let i = 0; i < questionList.length; i++) {
				// put new order
				await mutateAsync({id: questionList[i].id, order: questionList[i].attributes.order})
			}

			addToast({type: "success", text: "Order updated successfully!"})
		} catch (err) {
			addToast({type: "danger", text: err.message})
		}
	}

	return (
		<>
			{isUpdatingQuestionOrder && <Loader/>}

			<ul className="draggable-list w-full">
				{
					questionList.map((item, index) => {
						let key = index
						if (item.id) {
							key = item.id
						}
						return (
							<DraggableListItem
								key={key}
								index={index}
								onDragStart={(index) => onDragStart(index)}
								onDrop={(index) => onDrop(index)}
							>
								{
									renderItemContent(item)
								}

							</DraggableListItem>
						)
					})
				}

				<DraggableListItem
					key={questionList.length}
					index={questionList.length}
					draggale={false}
					onDrop={(index) => onDrop(index)}
				/>
			</ul>
			<button type="submit"
				className="w-3/5 lg:w-2/5 bg-orange-600 hover:bg-orange-500 text-white shadow-xl inline-block mb-5 focus:ring-4 font-medium rounded text-sm px-3 py-2.5 text-center tracking-wide"
				onClick={handleNewOrder}>Save new order
			</button>
		</>
	)
}

DraggableList.propTypes = {
	renderItemContent: PropTypes.func,
	questionList: PropTypes.any,
	setQuestionList: PropTypes.any
}

export default DraggableList
