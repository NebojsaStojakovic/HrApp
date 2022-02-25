import Sidebar from "../shared/Sidebar"
import { Outlet } from "react-router"
import TopNav from "../shared/TopNav"

const MainLayout = () => {
	return (
		<div>
			<Sidebar/>
			<div className="main">
				<div className="main__content bg-gray-100 dark:bg-gray-700">
					<TopNav />
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default MainLayout