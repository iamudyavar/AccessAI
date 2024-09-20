import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
	const [backendData, setBackendData] = useState("");
	const [loading, setLoading] = useState(false);
	const apiUrl = "http://127.0.0.1:5000/api"; // URL variable

	const handleFetchData = async () => {
		setLoading(true);
		try {
			const response = await fetch(apiUrl);
			if (response.ok) {
				const data = await response.json();
				setBackendData(data.message);
			} else {
				console.error("Failed to fetch data");
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>AccessAI</h1>
			<div className="card">
				<button onClick={handleFetchData} disabled={loading}>
					{loading ? "Loading..." : "Get response"}
				</button>
			</div>
			<p className="backend-response">
				{backendData ? backendData : loading ? "Loading..." : "Click the button to get the response"}
			</p>
		</>
	);
}

export default App;
