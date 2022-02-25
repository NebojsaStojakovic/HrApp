import React, {useEffect} from "react"
import {Link} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {createCompanySuccess, fetchCompaniesStart, loginError, registerStart} from "../../redux/actions/actions"
import Loader from "../shared/Loader"
import InputPair from "../shared/InputPair"
import {COMPANIES_ANNEX, INPUT_TYPES, ROLE_SELECT} from "../../constants"
import {useToast} from "../../contexts/ToastProvider"
import {useFormik} from "formik"
import * as Yup from "yup"
import { lowercaseRegex, numericRegex, uppercaseRegex } from "../../utils"

const RegisterPage = () => {
	const companies = useSelector(state => state.companies)
	const user = useSelector(state => state.user)
	const addToast = useToast()

	const SignupSchema = Yup.object().shape({
		username: Yup.string()
			.min(2, "Too Short!")
			.required("Username can't be empty!"),
		email: Yup.string()
			.lowercase()
			.email("Must be a valid email!")
			.required("Email can't be empty!!"),
		password: Yup.string()
			.matches(lowercaseRegex, "One lowercase required!")
			.matches(uppercaseRegex, "One uppercase required!")
			.matches(numericRegex, "One number required!")
			.min(8, "Minimum 8 characters required!")
			.required("Password can't be empty!"),
		companyId: Yup.string()
			.notOneOf(["-1"], "Please, choose your company!"),
		companyName: Yup.string()
			.when("companyId", {
				is: "0",
				then: Yup.string()
					.required("Company Name is required")
			}),
		companySlug: Yup.string()
			.when("companyId", {
				is: "0",
				then: Yup.string()
					.required("Company Slug is required")
			})
	})

	const formik = useFormik({
		initialValues: {
			username: "",
			email: "",
			password: "",
			companyId: "-1",
			userRole: "company_user",
			image: null,
			companyName: "",
			companySlug: ""
		},
		validationSchema: SignupSchema,
		onSubmit: values => {
			let company = formik.values.companyId
			const payload = {
				username: values.username,
				email: values.email,
				password: values.password,
				company,
				userRole: values.userRole
			}
			if (parseInt(company) < 1) {
				company = {name: values.companyName, slug: values.companySlug}
				payload.company = company
			}
			if (values.image) {
				payload.image = values.image
			}
			dispatch(registerStart(payload))
		},
	})

	const dispatch = useDispatch()

	function handleCompanyChange(e) {
		formik.setFieldValue("companyId", e.target.value)
		dispatch(createCompanySuccess({
			data: {
				data: companies.companies.find(company => company.id === parseInt(e.target.value))
			}
		}))
	}

	useEffect(() => {
		dispatch(fetchCompaniesStart())
	}, [])


	if (user.error) {
		addToast({type: "danger", text: user.error.message})
		dispatch(loginError(null))
	}

	return (
		<>
			{user.isLoading && <Loader/>}
			<div className="flex justify-between items-center mx-auto max-w-screen-lg py-10">
				<div
					className="bg-white shadow-md border border-gray-200 rounded-lg mx-auto w-full lg:w-2/5 max-w-md p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
					<form className="space-y-6" action="#"
						onSubmit={formik.handleSubmit}>
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
						<div>
							<InputPair type={INPUT_TYPES.text} inputValue={formik.values.username}
								setInputValue={formik.handleChange} labelText="Your name"
								placeholder="Your name..."
								onBlur={formik.handleBlur}
								name="username"
								error={formik.touched.username && formik.errors.username}/>

						</div>
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
						<div>
							<InputPair type={INPUT_TYPES.image}
								inputValue={formik.values.image}
								setInputValue={e => formik.setFieldValue("image", e.target.files[0])}
								labelText="Profile photo"/>
							{formik.values.image && (
								<div className="mt-5">
									<p className="mb-3 text-sm text-gray-900 dark:text-gray-100">Photo preview:</p>
									<img className="rounded-md w-40 h-40 object-cover"
										src={URL.createObjectURL(formik.values.image)} alt="new photo"/>
								</div>
							)}
						</div>
						<div>
							<InputPair type={INPUT_TYPES.select} inputValue={formik.values.userRole}
								setInputValue={e => formik.setFieldValue("userRole", e.target.value)}
								labelText="Role" selectOptions={ROLE_SELECT}/>
						</div>
						<div>
							<InputPair type={INPUT_TYPES.select}
								inputValue={formik.values.companyId}
								setInputValue={e => handleCompanyChange(e)}
								labelText="Company" selectOptions={COMPANIES_ANNEX.concat(companies?.companies)}
								onBlur={formik.handleBlur}
								error={formik.touched.companyId && formik.errors.companyId}/>
						</div>
						{(formik.values.companyId === "0") && (
							<>
								<div className="font-medium text-gray-900 block mb-2 dark:text-gray-300">
                                    Create a new company
								</div>
								<div>
									<InputPair type={INPUT_TYPES.text} inputValue={formik.values.companyName}
										setInputValue={formik.handleChange} labelText="Company
                    					name" placeholder="Company name..."
										onBlur={formik.handleBlur}
										name="companyName"
										error={formik.touched.companyName && formik.errors.companyName}/>
								</div>
								<div>
									<InputPair type={INPUT_TYPES.text} inputValue={formik.values.companySlug}
										setInputValue={formik.handleChange} labelText="Company slug"
										placeholder="Company slug..."
										name="companySlug"
										onBlur={formik.handleBlur}
										error={formik.touched.companySlug && formik.errors.companySlug}/>
								</div>
							</>
						)}
						<div className="flex justify-between items-center">
							<div className="text-sm font-medium text-gray-500 dark:text-gray-300">
								<Link to="/login" className="text-orange-600 hover:underline">Allready
                                    have an account?</Link>
							</div>
							<button type="submit"
								className=" text-white bg-orange-600 hover:bg-orange-500 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center shadow-md tracking-wide">Register
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default RegisterPage