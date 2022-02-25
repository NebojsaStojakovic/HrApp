import React, {useState} from "react"
import Modal from "./shared/Modal"
import InputPair from "./shared/InputPair"
import PropTypes from "prop-types"
import {useInviteMutation} from "../hooks/reactQueryHooks"
import {useToast} from "../contexts/ToastProvider"

function InviteModal({closeModal, companySlug}) {

	const [email, setEmail] = useState("")
	const [errorEmail, setErrorEmail] = useState("")
	const addToast = useToast()

	const {mutate} = useInviteMutation({
		onError: () => {
			addToast({type: "danger", text: "Invitation failed!"})
		},
		onSuccess: () => {
			addToast({type: "success", text: "Invitation successful!"})
		}
	})

	const validateEmail = () => {
		if (!email || email === "") {
			setErrorEmail("Email cant be empty!")
			return false
		}
		// else if (emailRegEx.test(email)) {
		// 	setErrorEmail("Not a valid email!")
		// 	return false
		// }
		else {
			setErrorEmail(false)
			return true
		}
	}

	function handleSubmit(e) {
		e.preventDefault()
		if (!validateEmail()) return
		mutate({email, companySlug})
		closeModal()
	}

	return (
		<Modal closeModal={closeModal}>
			<div
				className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all p-6 flex-col align-middle text-gray-900 dark:text-white dark:bg-gray-900 w-[300px] md:w-[500px]">
				<div className="flex justify-between items-center mb-3">
					<h1 className="text-lg text-gray-900 dark:text-white">Invite a member</h1>
					<button
						onClick={closeModal}
					>
						<i className="fas fa-times text-gray-900 dark:text-gray-100"/>
					</button>
				</div>

				<div>
					<InputPair type="email"
						inputValue={email}
						onBlur={validateEmail}
						onFocus={() => setErrorEmail("")}
						error={errorEmail}
						setInputValue={e => setEmail(e.target.value)} labelText="Email"/>
				</div>

				<div className="mt-5 flex justify-center items-center gap-6">
					<button className="text-white bg-red-700 hover:bg-red-500 rounded px-4 py-2"
						onClick={closeModal}
					>
                        Cancel
					</button>
					<button className="text-white bg-orange-600 hover:bg-orange-500 rounded px-4 py-2" type="button"
						onClick={handleSubmit}>SUBMIT
					</button>
				</div>
			</div>
		</Modal>
	)
}

InviteModal.propTypes = {
	closeModal: PropTypes.func,
	companySlug: PropTypes.string
}

export default InviteModal