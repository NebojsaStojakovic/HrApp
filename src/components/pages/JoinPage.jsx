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
import {lowercaseRegex, numericRegex, uppercaseRegex} from "../../utils"
import {useParams} from "react-router"

const JoinPage = () => {
	const {slug} = useParams()

	const companies = useSelector(state => state.companies.companies)
	const user = useSelector(state => state.user)
	const addToast = useToast()

	const dispatch = useDispatch()

	const JoinSchema = Yup.object().shape({
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
	})

	const formik = useFormik({
		initialValues: {
			username: "",
			email: "",
			password: "",
			companyId: companies?.filter(company => company.attributes.slug === slug)?.[0],
			userRole: "company_user",
			image: null
		},
		validationSchema: JoinSchema,
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

	useEffect(() => {
		dispatch(fetchCompaniesStart())
	}, [])

	useEffect(() => {
		const company = companies?.filter(company => company.attributes.slug === slug)?.[0]
		formik.setFieldValue("companyId", company.id)
		dispatch(createCompanySuccess({
			data: {
				data: company
			}
		}))
	},
	[companies])


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
							<InputPair type={INPUT_TYPES.select}
								inputValue={formik.values.userRole}
								labelText="Role" selectOptions={ROLE_SELECT}
								disabled
							/>
						</div>
						<div>
							<InputPair type={INPUT_TYPES.select}
								inputValue={formik.values.companyId}
								labelText="Company" selectOptions={COMPANIES_ANNEX.concat(companies)}
								disabled
							/>
						</div>
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

export default JoinPage