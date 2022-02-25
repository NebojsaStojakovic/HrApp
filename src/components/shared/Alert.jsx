import React from "react"
import PropTypes from "prop-types"
import "../../styles/CustomStyles.css"

const Alert = ({ type, text }) => {
	return (
		<div className={`alert alert-${type} fixed bottom-20 right-20 z-10 text-sm rounded-md shadow-lg text-white px-4 py-3 w-64 flex items-center justify-start gap-4`}>
			<div>
				<i className="danger fas fa-exclamation-circle text-white"/>
				<i className="success fas fa-check-circle text-white"/>
			</div>
			<div className="flex-col gap-3">
				<p className="text-white capitalize text-base">{type}</p>
				<p className="text-white capitalize text-sm">{text}</p>
			</div>
		</div>
	)
}

Alert.propTypes = {
	type: PropTypes.string,
	text: PropTypes.string
}

export default Alert