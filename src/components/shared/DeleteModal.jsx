import React from "react"
import Modal from "./Modal"
import PropTypes from "prop-types"

function DeleteModal({onConfirm, onCancel, user, modeQuestion, disabled}) {
	return(
		<Modal closeModal={onCancel}>
			<div
				className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden  transform transition-all w-[300px] md:w-fit sm:align-middle sm:max-w-lg sm:w-full p-6">
				<div className="">
					<div className="sm:flex sm:items-start">
						<div
							className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							<svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
								viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
							</svg>
						</div>
						<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
								id="modal-title">
								{modeQuestion ? `Delete question` : `Delete account`}
							</h3>
							<div className="mt-2">
								<p className="text-sm text-gray-500 dark:text-gray-300">
									{modeQuestion ? "Are you sure you want to permanently delete this question" : `Are you sure you want to permanently delete ${user.attributes.name}&apos;s account?`}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="sm:flex sm:flex-row-reverse mt-5">
					<button type="button"
						disabled={disabled}
						className="w-full inline-flex justify-center rounded shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
						onClick={onConfirm}>
                        Delete
					</button>
					<button type="button"
						disabled={disabled}
						className="mt-3 disabled:opacity-50 w-full inline-flex justify-center rounded shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-gray-100 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
						onClick={onCancel}>
                        Cancel
					</button>
				</div>
			</div>
		</Modal>
	)
}

DeleteModal.propTypes = {
	onConfirm: PropTypes.func,
	onCancel: PropTypes.func,
	user: PropTypes.object,
	modeQuestion: PropTypes.any,
	disabled: PropTypes.bool,
}

export default DeleteModal