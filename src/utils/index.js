/**
 * Takes a Date object and returns formatted string of type MMM - dd - YYYY
 *
 * @param {Date} date
 * @returns {string} - formatted date
 */
export const formatDate = (date) => {
	return new Date(date).toLocaleDateString("en-US",{ year: "numeric", month: "short", day: "2-digit" })
}

/**
 * Returns question in arr with id of id
 *
 * @param {Number} id
 * @param {Array} arr
 * @returns {Object} - question
 */
export const extractQuestionById = (id, arr) => {
	let selected = null
	arr.forEach(question => {
		if (question.id === id) {
			selected = question.attributes.text
		}
	})
	return selected
}

/**
 * Return question type in arr with id of id
 *
 * @param id
 * @param arr
 * @returns {string} - type
 */
export const extractQuestionType = (id, arr) => {
	let type = null
	arr.forEach(question => {
		if (question.id === id) {
			type = question.attributes.type
		}
	})
	return type
}

/**
 * Returns unique order for questions
 *
 * @param {Array} uniqueOrders
 * @returns {number} - unique order
 */
export const makeUniqueOrder = (uniqueOrders) => {
	let ord = 0
	let exit = false
	while (exit === false) {
		if (ord in uniqueOrders) {
			ord++
		} else {
			exit = true
		}
	}
	return ord
}

/**
 * Email testing regex
 *
 * @type {RegExp}
 */
export const lowercaseRegex = /(?=.*[a-z])/
export const uppercaseRegex = /(?=.*[A-Z])/
export const numericRegex = /(?=.*[0-9])/
