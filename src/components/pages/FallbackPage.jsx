import PropTypes from "prop-types"


export const FallbackPage = ({error, resetErrorBoundary}) => {
	return (
		<>
			<div className="flex flex-col gap-5 text-center justify-center items-center mx-auto max-w-screen-lg p10">
				<p className="text-[40px] font-medium text-gray-900 block dark:text-gray-100">Something went wrong:</p>
				<pre className="text-[40px] font-medium text-gray-900 block dark:text-gray-100">{error.message}</pre>
				<button className="text-sm md:text-base bg-orange-600 tracking-wide text-gray-100 py-2 px-2 rounded" onClick={resetErrorBoundary}>Try again</button>
			</div>
		</>
	)
}

FallbackPage.propTypes = {
	error: PropTypes.any,
	resetErrorBoundary: PropTypes.any,
}