import React from "react"

function Loader() {
	return (
		<div className="fixed inset-0 flex justify-center items-center bg-black opacity-70 z-10">
			<div className="flex items-center justify-center space-x-2 animate-pulse">
				<div className="w-8 h-8 bg-orange-900 rounded-full"/>
				<div className="w-8 h-8 bg-orange-900 rounded-full"/>
				<div className="w-8 h-8 bg-orange-900 rounded-full"/>
			</div>
		</div>
	)
}

export default Loader