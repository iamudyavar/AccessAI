import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Simulation from "./pages/Simulation";

function AppRouter() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/simulation" element={<Simulation />} />
			</Routes>
		</Router>
	);
}

export default AppRouter;
