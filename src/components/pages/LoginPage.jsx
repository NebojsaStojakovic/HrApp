import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {loginError, loginStart} from "../../redux/actions/actions"
import {Link} from "react-router-dom"
import Loader from "../shared/Loader"
import InputPair from "../shared/InputPair"
import {INPUT_TYPES} from "../../constants"
import {useToast} from "../../contexts/ToastProvider"
import {useFormik} from "formik"
import * as Yup from "yup"

const LoginPage = () => {

	const dispatch = useDispatch()

	const user = useSelector(state => state.user)

	const addToast = useToast()

	const LoginSchema = Yup.object().shape({
		email: Yup.string()
			.lowercase()
			.email("Must be a valid email!")
			.required("Email can't be empty!!"),
		password: Yup.string()
			.min(8, "Minimum 8 characters required!")
			.required("Password can't be empty!"),
	})

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: LoginSchema,
		onSubmit: values => {
			const data = {
				email: values.email,
				password: values.password
			}
			dispatch(loginStart(data))
		},
	})

	if (user.error) {
		addToast({type: "danger", text: user.error.message})
		dispatch(loginError(null))
	}

	return (
		<>
			{user.isLoading && <Loader/>}
			<div>
				<div className="flex justify-between items-center mx-auto max-w-screen-lg py-10">
					<div
						className="bg-white shadow-md border border-gray-200 rounded-lg w-full lg:w-2/5 max-w-md p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto">
						<form className="space-y-4" action="#" onSubmit={formik.handleSubmit}>
							<h3 className="text-lg text-center font-medium text-gray-900 dark:text-white">Sign in to our
                                platform</h3>
							<div>
								<InputPair type={INPUT_TYPES.email} inputValue={formik.values.email}
									setInputValue={formik.handleChange} labelText="Your email"
									onBlur={formik.handleBlur} error={formik.touched.email && formik.errors.email}/>
							</div>
							<div>
								<InputPair type={INPUT_TYPES.password} inputValue={formik.values.password}
									setInputValue={formik.handleChange} labelText="Your password"
									onBlur={formik.handleBlur}
									error={formik.touched.password && formik.errors.password}/>
							</div>
							<button type="submit"
								className="w-full text-white bg-orange-600 hover:bg-orange-500 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center shadow-md tracking-wide">Login to your account
							</button>
							<div className="text-sm font-medium text-gray-500 dark:text-gray-300">Not registered?
								<Link to="/register" className="ml-2 text-orange-600 hover:underline">Create
                                    account</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}

export default LoginPage
