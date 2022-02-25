import {useSelector} from "react-redux"
import {Navigate, Outlet, useLocation} from "react-router-dom"
import PropTypes from "prop-types"

const ProtectedRoutes = ({allowedRoles, unauthenticated}) => {
	const user = useSelector(state => state.user)
	const location = useLocation()

	if (unauthenticated) {
		if (user.isLoggedIn) {
			return <Navigate to="/" state={{from: location}} replace/>
		} else {
			return <Outlet />
		}
	}

	return (
		allowedRoles?.some(role => role === user?.profile?.attributes.userRole)
			? <Outlet/>
			: user.isLoggedIn
				? <Navigate to="/unauthorized" state={{from: location}} replace/>
				:  <Navigate to="/login" state={{from: location}} replace/>
	)
}

ProtectedRoutes.propTypes = {
	allowedRoles: PropTypes.array,
	unauthenticated: PropTypes.bool,
}

export default ProtectedRoutes