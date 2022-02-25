import React from "react"
import {Questions} from "../components/pages/questions/Questions"
import {AnswerQuestionsPage} from "../components/pages/questions/AnswerQuestionsPage"
import {useSelector} from "react-redux"
import {ROLES} from "../constants"

function QuestionsRoleRoute() {

	const user = useSelector(state => state.user)

	if (user?.profile?.attributes.userRole === ROLES.admin) {
		return <Questions />
	}

	return <AnswerQuestionsPage />
}

export default QuestionsRoleRoute