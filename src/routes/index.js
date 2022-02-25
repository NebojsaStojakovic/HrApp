import {Route, Routes} from "react-router-dom"
import LoginPage from "../components/pages/LoginPage"
import MainLayout from "../components/pages/MainLayout"
import ProtectedRoutes from "./ProtectedRoutes"
import PendingPage from "../components/pages/PendingPage"
import Company from "../components/pages/Company"
import MyProfile from "../components/pages/MyProfile"
import EditUserPage from "../components/pages/EditUserPage"
import AddQuestion from "../components/pages/questions/AddQuestion"
import JoinPage from "../components/pages/JoinPage"
import CompanyWall from "../components/pages/CompanyWall"
import TeamPageRoleRoute from "./TeamPageRoleRoute"
import QuestionsRoleRoute from "./QuestionsRoleRoute"
import ErrorPage from "../components/pages/404"
import RegisterPage from "../components/pages/RegisterPage"

import {ROLES} from "../constants"

const createRoutes = () => (
	<Routes>
		<Route element={<MainLayout/>}>

			{/* Public routes */}

			<Route path="/" element={<CompanyWall/>}/>

			{/*Admin routes */}

			<Route element={<ProtectedRoutes allowedRoles={[ROLES.admin]} />}>
				<Route path="/pending" element={<PendingPage/>}/>
				<Route path="/team/:id/edit" element={<EditUserPage/>}/>
				<Route path="/add-question" element={<AddQuestion />} />
				<Route path="/edit-question/:id" element={<AddQuestion modeEdit={true}/>} />
				<Route path="/company" element={<Company/>}/>
			</Route>

			{/* User routes */}

			<Route element={<ProtectedRoutes allowedRoles={[ROLES.admin, ROLES.user]} />}>
				<Route path="/team" element={<TeamPageRoleRoute/>}/>
				<Route path="/questions" element={<QuestionsRoleRoute/>}/>
				<Route path="/myprofile" element={<MyProfile/>}/>
			</Route>

			{/* Logged out */}

			<Route element={<ProtectedRoutes unauthenticated />}>
				<Route path="/login" element={<LoginPage/>}/>
				<Route path="/register" element={<RegisterPage/>}/>
				<Route path="/join/:slug" element={<JoinPage/>}/>
			</Route>

			{/* Catch all */}
			<Route path="*" element={<ErrorPage/>}/>
		</Route>
	</Routes>
)


export default createRoutes