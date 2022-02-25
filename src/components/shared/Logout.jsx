import React from "react"
import {useDispatch} from "react-redux"
import {logoutStart} from "../../redux/actions/actions"

export const Logout = () => {
	const dispatch = useDispatch()

	const handleLogout = (e) => {
		e.preventDefault()
		dispatch(logoutStart())
	}

	return (
		<>
			<button className="flex items-center" onClick={handleLogout}>
				<i className="sidebar__menu__item__icon fas fa-sign-out-alt mr-3"/>
				<div className="sidebar__menu__item__txt">
					Logout
				</div>
			</button>
		</>
	)
}
