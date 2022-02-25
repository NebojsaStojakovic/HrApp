import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./index.css"
// Router
import {BrowserRouter} from "react-router-dom"
// Themes
import ThemeProvider from "./contexts/ThemeProvider"
// Redux
import {Provider} from "react-redux"
import store, {Persistor} from "./redux/store"
import {QueryClient, QueryClientProvider} from "react-query"
import {PersistGate} from "redux-persist/integration/react"
import ToastProvider from "./contexts/ToastProvider"
import {ErrorBoundary} from "react-error-boundary"
import { FallbackPage } from "./components/pages/FallbackPage"

const queryClient = new QueryClient()

//this would call server logging
const errorHandler = (error, errorInfo) => {
	console.log("logging", error, errorInfo)
}

ReactDOM.render(
	<React.StrictMode>
		<ErrorBoundary FallbackComponent={FallbackPage} onError={errorHandler}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={Persistor}>
					<ToastProvider>
						<ThemeProvider>
							<BrowserRouter>
								<QueryClientProvider client={queryClient}>
									<App/>
								</QueryClientProvider>
							</BrowserRouter>
						</ThemeProvider>
					</ToastProvider>
				</PersistGate>
			</Provider>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById("root")
)
