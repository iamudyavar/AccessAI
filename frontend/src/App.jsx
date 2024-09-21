import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
	const [inputText, setInputText] = useState(""); // For user input
	const [responseText, setResponseText] = useState(""); // For LLM response
	const [loading, setLoading] = useState(false);
	const apiUrl = "http://127.0.0.1:5000/api"; // Replace with actual backend API URL

	// Handle change in textarea input
	const handleInputChange = (e) => {
		setInputText(e.target.value);
	};

	// Submit input to backend and fetch the LLM response
	const handleSubmit = async () => {
		if (!inputText.trim()) {
			alert("Please enter some code!");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: inputText }),
			});

			if (response.ok) {
				const data = await response.json();
				setResponseText(data.message);
			} else {
				console.error("Error fetching response:", response.statusText);
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="app">
			{/* Header with logos */}
			<header className="app-header">
				<div className="logos">
					<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank" rel="noreferrer">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
				</div>
				<h1>AccessAI</h1>
			</header>

			{/* Main container */}
			<main className="content-container">
				{/* Input box for user code */}
				<section className="input-section">
					<h2>Enter Your Code</h2>
					<textarea
						value={inputText}
						onChange={handleInputChange}
						placeholder="Enter your code here..."
						rows={10}
					/>
					<button onClick={handleSubmit} disabled={loading}>
						{loading ? "Processing..." : "Submit to LLM"}
					</button>
				</section>

				{/* Output box for LLM response */}
				<section className="output-section">
					<h2>LLM Model Response</h2>
					<div className="response-box">
						{loading ? (
							<p className="loading-text">Loading...</p>
						) : responseText ? (
							<pre>{responseText}</pre>
						) : (
							<p className="placeholder-text">The LLM response will appear here.</p>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;
