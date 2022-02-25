import React from "react"

function SpinnerLoader() {
	return (
		<div className="flex justify-center items-center p-10">
			<div className="animate-spin w-48 h-48 rounded-full border-8 border-gray-400 border-t-violet-800 z-50"/>
		</div>
	)
}

export default SpinnerLoader