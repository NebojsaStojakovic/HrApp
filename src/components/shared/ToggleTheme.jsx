import React, {useState} from "react"
import {useTheme} from "../../contexts/ThemeProvider"

const ToggleTheme = () => {

	const {theme, toggleTheme} = useTheme()
	
	const [toggle, setToggle] = useState(theme==="dark")

	const handleToggle = e => {
		e.stopPropagation()
		e.preventDefault()
		toggleTheme()
		setToggle(!toggle)
	}

	return (
		<div>
			
			<div className="flex gap-2 items-center" onClick={handleToggle}>
				<i className="fas fa-sun text-sm"/>

				<div className={`relative rounded-full w-8 h-4 transition duration-200 ease-linear ${toggle === true ? "bg-orange-600" : "bg-gray-400"}`}>
					<label htmlFor="toggle"
						className={`absolute left-0 bg-white border-2 mb-2 w-4 h-4 rounded-full transition transform duration-100 ease-linear cursor-pointer ${toggle === true ? "translate-x-full border-orange-600" : "translate-x-0 border-gray-400"}`}/>
					<input type="checkbox" id="toggle" name="toggle"
						className="appearance-none w-full h-full active:outline-none focus:outline-none"
						defaultChecked={toggle} />
				</div>
				<i className="fas fa-moon text-sm"/>
			</div>
		</div>
	)
}

export default ToggleTheme