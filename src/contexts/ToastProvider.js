import React, {createContext, useCallback, useContext, useEffect, useState} from "react"
import Alert from "../components/shared/Alert"
import PropTypes from "prop-types"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

function ToastProvider({children}) {

	// object with attributes {type, text}
	const [toast, setToast] = useState(null)

	useEffect(() => {
		if (toast) {
			const timer = setTimeout(
				() => setToast(null),
				3000
			)
			return () => clearTimeout(timer)
		}
	}, [toast])

	const addToast = useCallback(
		(toast) => {
			setToast(toast)
		},
		[setToast]
	)

	return (
		<ToastContext.Provider value={addToast}>
			{children}
			{toast && <Alert text={toast?.text} type={toast?.type}/>}
		</ToastContext.Provider>
	)
}

ToastProvider.propTypes = {
	children: PropTypes.element,
}

export default ToastProvider