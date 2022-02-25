import axios from "axios"

export const axiosInstanceWithAuth = axios.create({
	baseURL: process.env.REACT_APP_SERVER_ADDRESS,
})

export const axiosInstanceWithoutAuth = axios.create({
	baseURL: process.env.REACT_APP_SERVER_ADDRESS,
})

axiosInstanceWithAuth.interceptors.request.use((req) => {
	const token = localStorage.getItem("token")
	req.headers.Authorization = `Bearer ${token}`
	return req
})
