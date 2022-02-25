import React from "react"
import {ROLES} from "../constants"
import {TeamPage} from "../components/pages/TeamPage"
import {useSelector} from "react-redux"
import {TeamViewPage} from "../components/pages/TeamViewPage"

function TeamPageRoleRoute() {

	const user = useSelector(state => state.user)

	if (user?.profile?.attributes.userRole === ROLES.admin) {
		return <TeamPage />
	}

	return <TeamViewPage />
}

export default TeamPageRoleRoute