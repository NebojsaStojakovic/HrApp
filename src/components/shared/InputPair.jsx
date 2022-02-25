import React from "react"
import PropTypes from "prop-types"
import {INPUT_TYPES} from "../../constants"

// factory
function InputPair({
	labelText,
	inputValue,
	setInputValue,
	type,
	selectOptions,
	placeholder,
	onFocus,
	onBlur,
	error,
	disabled,
	name
}) {

	if (type === INPUT_TYPES.text) {
		return <TextInput labelText={labelText} placeholder={placeholder} inputValue={inputValue} setInputValue={setInputValue} onFocus={onFocus} onBlur={onBlur} error={error} name={name}/>
	}

	if (type === INPUT_TYPES.longtext) {
		return <LongTextInput labelText={labelText} placeholder={placeholder} inputValue={inputValue} setInputValue={setInputValue} onFocus={onFocus} onBlur={onBlur} error={error}/>
	}

	if (type === INPUT_TYPES.image) {
		return <ImageQAInput labelText={labelText} image={inputValue} setImage={setInputValue}/>
	}

	if (type === INPUT_TYPES.select) {
		return <SelectInput labelText={labelText} inputValue={inputValue} setInputValue={setInputValue}
			options={selectOptions} onFocus={onFocus} onBlur={onBlur} error={error}
			disabled={disabled}/>
	}

	if (type === INPUT_TYPES.userStatus) {
		return <UserStatusInput labelText={labelText} inputValue={inputValue} setInputValue={setInputValue}
			options={selectOptions} onFocus={onFocus} onBlur={onBlur} error={error}/>
	}

	if (type === INPUT_TYPES.email) {
		return <EmailInput labelText={labelText} inputValue={inputValue} setInputValue={setInputValue} onFocus={onFocus} onBlur={onBlur} error={error}/>
	}

	if (type === INPUT_TYPES.password) {
		return <PasswordInput labelText={labelText} inputValue={inputValue} setInputValue={setInputValue} onFocus={onFocus} onBlur={onBlur} error={error}/>
	}

	return null
}

InputPair.propTypes = {
	labelText: PropTypes.string,
	inputValue: PropTypes.any,
	setInputValue: PropTypes.func,
	type: PropTypes.any,
	selectOptions: PropTypes.array,
	placeholder: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	error: PropTypes.any,
	disabled: PropTypes.bool,
	name: PropTypes.string
}

const ImageQAInput = ({labelText, image, setImage}) => (
	<div className="mb-5">
		<label htmlFor="formFile"
			className="text-sm lg:text-base form-label font-medium text-gray-900 block dark:text-gray-100">
			{labelText}
		</label>
		<input
			className="relative bg-gray-100 border border-gray-100 text-gray-900 text-sm lg:text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white file:bg-gray-900 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:absolute file:top-1.5 file:right-1"
			type="file" id="formFile" accept="image/*"
			onChange={setImage}
		/>
		{image && (<div>
			<img src={image} alt=""/>
		</div>)}
	</div>
)

ImageQAInput.propTypes = {
	labelText: PropTypes.string,
	image: PropTypes.any,
	setImage: PropTypes.func,
}

const TextInput = ({labelText, inputValue, setInputValue, placeholder, onFocus, onBlur, error, name}) => (
	<div className="mb-5">
		<label htmlFor={name || "username"}
			className="text-sm lg:text-base font-medium text-gray-900 block dark:text-gray-100">
			{labelText}
		</label>
		<input type="text" name={name}
			className="bg-gray-100 border border-gray-100 text-gray-900 text-sm lg:text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value={inputValue} required=""
			onChange={setInputValue} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur}/>
		{error && <span className="text-xs text-red-700">{error}</span>}

	</div>
)

TextInput.propTypes = {
	labelText: PropTypes.string,
	placeholder: PropTypes.string,
	inputValue: PropTypes.any,
	setInputValue: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	error: PropTypes.any,
	name: PropTypes.string,
}

const LongTextInput = ({labelText, inputValue, setInputValue, placeholder, onFocus, onBlur, error}) => (
	<div className="mb-5">
		<label htmlFor="userName"
			className="text-sm lg:text-base font-medium text-gray-900 block dark:text-gray-100">
			{labelText}
		</label>
		<textarea
			className="form-control text-sm lg:text-base block w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding
                border border-solid border-gray-100 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
			id="exampleFormControlTextarea1"
			rows="3"
			value={inputValue} required
			onChange={setInputValue}
			placeholder={placeholder}
			onFocus={onFocus} onBlur={onBlur}
		/>
		{error && <span className="text-xs text-red-700">{error}</span>}
	</div>
)

LongTextInput.propTypes = {
	labelText: PropTypes.string,
	placeholder: PropTypes.string,
	inputValue: PropTypes.any,
	setInputValue: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	error: PropTypes.any
}

const SelectInput = ({labelText, inputValue, setInputValue, options, onFocus, onBlur, error, disabled = false}) => (
	<div className="mb-5">
		<label
			htmlFor="userName"
			className="text-sm lg:text-base font-medium text-gray-900 block dark:text-gray-100">
			{labelText}
		</label>
		<select
			disabled={disabled}
			className="bg-gray-100 border border-gray-100 text-gray-900 text-sm lg:text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
			value={inputValue} onChange={setInputValue} id="formCompanies" onFocus={onFocus} onBlur={onBlur}>
			{options.map(option => (
				<option key={option.id} value={option.id}>{option.attributes.name}</option>
			))}
		</select>
		{error && <span className="text-xs text-red-700">{error}</span>}
	</div>
)

SelectInput.propTypes = {
	labelText: PropTypes.string,
	inputValue: PropTypes.any,
	setInputValue: PropTypes.func,
	options: PropTypes.array,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	error: PropTypes.any,
	disabled: PropTypes.bool
}

const UserStatusInput = ({labelText, inputValue, setInputValue, options, onFocus, onBlur, error}) => (
	<div>
		<label htmlFor="userName"
			className="text-sm lg:text-base font-medium text-gray-900 block dark:text-gray-100">
			{labelText}
		</label>
		<select
			className="bg-gray-100 border border-gray-100 text-gray-900 text-sm lg:text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
			value={inputValue} onChange={setInputValue} onFocus={onFocus} onBlur={onBlur}>
			{options.map(option => (
				<option key={option.id} value={option.id}>{option.attributes.name}</option>
			))}
		</select>
		{error && <span className="text-xs text-red-700">{error}</span>}
	</div>
)

UserStatusInput.propTypes = {
	labelText: PropTypes.string,
	inputValue: PropTypes.any,
	setInputValue: PropTypes.func,
	options: PropTypes.array,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	error: PropTypes.any
}

const EmailInput = ({labelText, inputValue, setInputValue, onFocus, onBlur, error}) => (
	<div className="mb-5">
		<label htmlFor="email"
			className="text-sm lg:text-base font-medium text-gray-900 block dark:text-gray-100">
			{labelText}
		</label>
		<input type="email" name="email" id="email"
			className="bg-gray-100 border border-gray-100 text-gray-900 text-sm lg:text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white placeholder:text-sm"
			placeholder="Email..." value={inputValue} required=""
			onChange={setInputValue} onFocus={onFocus} onBlur={onBlur}/>
		{error && <span className="text-xs text-red-700">{error}</span>}
	</div>
)

EmailInput.propTypes = {
	labelText: PropTypes.string,
	inputValue: PropTypes.any,
	setInputValue: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	error: PropTypes.any
}

const PasswordInput = ({labelText, inputValue, setInputValue, onFocus, onBlur, error}) => (
	<div className="mb-5">
		<label htmlFor="password"
			className="text-sm lg:text-base font-medium text-gray-900 block dark:text-gray-100">
			{labelText}
		</label>
		<input type="password" name="password"
			className="bg-gray-100 border border-gray-100 text-gray-900 text-sm lg:text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
			placeholder="*******" value={inputValue} required=""
			onChange={setInputValue} onFocus={onFocus} onBlur={onBlur}/>
		{error && <span className="text-xs text-red-700">{error}</span>}
	</div>
)

PasswordInput.propTypes = {
	labelText: PropTypes.string,
	inputValue: PropTypes.any,
	setInputValue: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	error: PropTypes.any
}

export default InputPair