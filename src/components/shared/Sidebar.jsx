import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {Link, useLocation} from "react-router-dom"
import "../../styles/CustomStyles.css"
import NAVIGATION from "./SidebarNav"
import {Logout} from "./Logout"
import ToggleTheme from "./ToggleTheme"
import {ROLES} from "../../constants"

const Sidebar = () => {

	const user = useSelector(state => state.user)
	const [activeIndex, setActiveIndex] = useState(0)
	const location = useLocation()

	const nav = user?.profile?.attributes.userRole === ROLES.admin ? NAVIGATION.admin
		: user.isLoggedIn ? NAVIGATION.user
			: NAVIGATION.guest

	useEffect(() => {
		const curPath = window.location.pathname.split("/")[1]
		const activeItem = nav.findIndex(item => item.section === curPath)

		setActiveIndex(curPath.length === 0 ? 0 : activeItem)
	}, [location])


	const closeSidebar = () => {
		document.querySelector(".main__content").style.transform = "scale(1) translateX(0)"
		setTimeout(() => {
			document.body.classList.remove("sidebar-open")
			document.querySelector(".main__content").style = ""
		}, 500)
	}

	return (
		<div className="sidebar bg-white dark:bg-gray-900">
			<div className="sidebar__logo flex items-start justify-between h-20 mt-5">
				<div className="xl:pl-20">
					<p className="text-xl font-medium text-gray-900 dark:text-white">.team <span className="p-1 rounded-sm bg-orange-600 text-white dark:text-white">HUB</span> </p>
				</div>
				<div className="sidebar-close cursor-pointer" onClick={closeSidebar}>
					<i className="fas fa-times text-orange-600 text-base"/>
				</div>
			</div>
			<div className="sidebar__menu">
				{
					nav.map((nav, index) => (
						<Link to={nav.link} key={`nav-${index}`}
							className={`sidebar__menu__item ${activeIndex === index && "active"}`}
							onClick={closeSidebar}>
							<div className="sidebar__menu__item__icon">
								{nav.icon}
							</div>
							<div className="sidebar__menu__item__txt">
								{nav.text}
							</div>
						</Link>
					))
				}
				<div className="sidebar__menu__item">
					<ToggleTheme/>
				</div>
				{user.isLoggedIn ?
					<div className="sidebar__menu__item">
						<div >
							<Logout/>
						</div>
					</div> 
					: <div className="sidebar__menu__item flex-col items-start justify-center gap-1">
						<Link className="sidebar__menu__item-login flex items-center" onClick={closeSidebar} to="/login">
							<i className="sidebar__menu__item__icon fas fa-user-lock mr-3"/>
							<div className="sidebar__menu__item__txt">
									Login
							</div></Link>
						<Link className="sidebar__menu__item-register flex items-center" onClick={closeSidebar} to="/register">
							<i className="sidebar__menu__item__icon fas fa-sign-in-alt mr-3"/>
							<div className="sidebar__menu__item__txt">
									Register
							</div></Link>
					</div>
				}
			</div>
		</div>
	)
}

export default Sidebar