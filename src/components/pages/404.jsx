import React from "react"
import { Link } from "react-router-dom"

const ErrorPage = () => {

	return (
		<>
			<div className="flex flex-col gap-5 text-center justify-center items-center mx-auto max-w-screen-lg p10">
				<h2 className="text-[100px] font-medium text-gray-900 block dark:text-gray-100">404</h2>
				<h4 className="text-[40px] font-medium text-gray-900 block dark:text-gray-100">Opps! Page not found!</h4>
				<p className="text-lg font-medium text-gray-900 block dark:text-gray-100">The page you were looking for doesnt exist. You may have mistyped the adress or the page may have moved.</p>
				<Link className="text-sm md:text-base bg-orange-600 tracking-wide text-gray-100 py-2 px-2 rounded" to="/">Back To Home</Link>
			</div>
		</>
	)
}

export default ErrorPage