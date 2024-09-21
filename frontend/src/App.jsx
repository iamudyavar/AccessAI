import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SuggestionCard from "./components/SuggestionCard";
import "./App.css";

function App() {
	const [inputText, setInputText] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const apiUrl = "http://127.0.0.1:5000/api"; // Replace with actual backend API URL

	const handleInputChange = (e) => {
		setInputText(e.target.value);
	};

	const handleSubmit = async () => {
		if (!inputText.trim()) {
			alert("Please enter some code!");
			return;
		}
		setLoading(true);
		setSubmitted(true);
		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: inputText }),
			});
			if (response.ok) {
				const data = await response.json();
				setSuggestions(data.suggestions);
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
		<div className={`app ${submitted ? "submitted" : ""}`}>
			<div className="input-container">
				{!submitted && (
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
				)}
				<div className="input-section">
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
				</div>
			</div>
			{submitted && (
				<div className="output-container">
					{loading ? (
						<p className="loading-text">Loading...</p>
					) : (
						<div className="suggestion-list">
							{suggestions.map((suggestion, index) => (
								<SuggestionCard
									key={index}
									title={suggestion.suggestionTitle}
									suggestion={suggestion.suggestion}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default App;
