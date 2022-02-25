import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useGetMyProfile } from "../../hooks/reactQueryHooks"

const TopNav = () => {
	const isLoggedIn = useSelector(defaultState => defaultState.user.isLoggedIn)
	const [userName, setUserName] = useState("")
	const [image, setImage] = useState(null)
	

	useGetMyProfile({
		onSuccess: data => {
			setImage(data.data.data[0]?.attributes.profilePhoto.data?.attributes.formats?.thumbnail?.url)
			setUserName(data.data.data[0]?.attributes.name)
		}
	})

	const openSidebar = () => {
		document.body.classList.add("sidebar-open")
	}

	return (
		<div className='flex items-center justify-between mb-11'>
			<div className="flex items-center justify-start text-sm">
				<div className="flex items-center focus:outline-none">
					<img className="w-12 h-12 rounded-full mr-4" src={isLoggedIn ? image : "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/56/566629c9c0cc8b7a1b1e945a268266dc594ec6f5_full.jpg"} alt={userName}/>
				</div>
				<div className="flex">
					
					<p className="text-gray-900 text-lg dark:text-white">{isLoggedIn ? userName : "Avatar"}</p>
				</div>
			</div>
			<div className="sidebar-toggle" onClick={openSidebar}>
				<i className="fas fa-bars text-gray-900 text-base dark:text-white"/>
			</div>
		</div>
	)
}

export default TopNav