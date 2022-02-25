import React, {createContext, useContext, useEffect, useState} from "react"
import PropTypes from "prop-types"

const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

const ThemeProvider = ({children}) => {

	const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")

	const toggleTheme = () => {
		setTheme(oldTheme => oldTheme === "dark" ? "light" : "dark")
		document.body.classList.toggle("dark")
	}

	useEffect(() => localStorage.setItem("theme", theme), [theme])
	useEffect(() => theme === "dark" && document.body.classList.toggle("dark"), [])

	const value = {
		theme,
		toggleTheme
	}

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	)
}

ThemeProvider.propTypes = {
	children: PropTypes.node
}

export default ThemeProvider