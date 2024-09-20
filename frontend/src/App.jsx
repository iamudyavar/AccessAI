import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);
	const [backendData, setBackendData] = useState(""); // State to store backend response
	const apiUrl = "http://127.0.0.1:5000/api"; // URL variable

	useEffect(() => {
		const fetchData = async () => {
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
			}
		};

		fetchData(); // Call the function to fetch data
	}, [apiUrl]);

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
				<button onClick={() => setCount(1)}>count is {count}</button>
			</div>
			<p className="backend-response">{backendData ? backendData : "Loading..."}</p>
		</>
	);
}

export default App;
