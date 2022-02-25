import React, {useEffect} from "react"
import ReactDOM from "react-dom"

function Modal({children, closeModal}) {

	useEffect(() => {
		document.body.style.overflow = "hidden"
		return () => document.body.style.overflow = "auto"
	}, [])

	return ReactDOM.createPortal(
		<div className="fixed z-10 inset-0 overflow-y-auto py-5" aria-labelledby="modal-title" role="dialog"
			aria-modal="true" onClick={closeModal}>
			<div className="flex items-center justify-center min-h-screen text-center">
				<div>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"/>
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen"
						aria-hidden="true"/>
					<div
						className="inline-block align-bottom rounded-lg
                            text-left overflow-hidden shadow-xl transform transition-all
                            sm:align-middle md:w-fit"
						onClick={e => e.stopPropagation()}
					>
						{children}
					</div>
				</div>
			</div>
		</div>,
		document.getElementById("portal")
	)
}

export default Modal