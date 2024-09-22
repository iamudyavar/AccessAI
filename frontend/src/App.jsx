import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SuggestionCard from "./components/SuggestionCard";
import "./App.css";

function App() {
	const [inputText, setInputText] = useState("");
	const [file, setFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null); // For image preview
	const [codeSuggestions, setCodeSuggestions] = useState([]);
	const [visualSuggestions, setVisualSuggestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [url, setUrl] = useState(""); // State for URL input
	const apiUrl = "http://127.0.0.1:5000/api"; // Replace with actual backend API URL

	const navigate = useNavigate(); // Hook to navigate programmatically

	const handleInputChange = (e) => {
		setInputText(e.target.value);
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			const allowedExtensions = /(\.html|\.css|\.js|\.jpg|\.jpeg|\.png|\.gif)$/i;
			if (!allowedExtensions.exec(selectedFile.name)) {
				alert("Only HTML, CSS, JS, or image files are allowed.");
				e.target.value = ""; // Reset the input
				return;
			}

			setFile(selectedFile);

			// If the file is an image, create a preview
			if (selectedFile.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (e) => setImagePreview(e.target.result);
				reader.readAsDataURL(selectedFile);
			} else {
				setImagePreview(null);
			}
		}
	};

	const handleSubmit = async () => {
		if (!inputText.trim() && !file) {
			alert("Please enter some code or attach a file!");
			return;
		}

		setLoading(true);
		setSubmitted(true);

		try {
			const formDataCode = new FormData();
			const formDataImage = new FormData();

			// If there's input text, prepare formData for code
			if (inputText.trim()) {
				formDataCode.append("code", inputText);
			}

			// If a file is provided, prepare formData for image
			if (file) {
				if (file.type.startsWith("image/")) {
					formDataImage.append("image", file);
				} else {
					formDataCode.append("file", file);
				}
			}

			// Call backend for code suggestions
			let codeSuggestionsResponse = [];
			if (formDataCode.has("code") || formDataCode.has("file")) {
				const responseCode = await fetch(apiUrl, {
					method: "POST",
					body: formDataCode,
				});
				if (responseCode.ok) {
					const data = await responseCode.json();
					codeSuggestionsResponse = data.suggestions || [];
				}
			}

			// Call backend for visual suggestions (image)
			let visualSuggestionsResponse = [];
			if (formDataImage.has("image")) {
				const responseImage = await fetch(apiUrl, {
					method: "POST",
					body: formDataImage,
				});
				if (responseImage.ok) {
					const data = await responseImage.json();
					visualSuggestionsResponse = data.suggestions || [];
				}
			}

			// Set the suggestions
			setCodeSuggestions(codeSuggestionsResponse);
			setVisualSuggestions(visualSuggestionsResponse);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	// Function to handle the "Open Simulation" button click
	const handleOpenSimulation = () => {
		if (!url.trim()) {
			alert("Please enter a valid URL.");
			return;
		}
		navigate(`/simulation?url=${encodeURIComponent(url)}`); // Redirect to the simulation page with the URL as a query parameter
	};

	return (
		<div className={`app ${submitted ? "submitted" : ""}`}>
			<div className="container">
				{" "}
				{/* Added container for flex layout */}
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
						<h2>Enter Your Code or Attach a File</h2>
						<textarea
							value={inputText}
							onChange={handleInputChange}
							placeholder="Enter your code here..."
							rows={10}
						/>
						<input
							type="file"
							accept=".html,.css,.js,.jpg,.jpeg,.png,.gif"
							onChange={handleFileChange}
						/>

						{/* Image Preview */}
						{imagePreview && (
							<div className="image-preview">
								<img
									src={imagePreview}
									alt="Preview"
									style={{ width: "200px", height: "auto" }}
								/>
							</div>
						)}

						<button onClick={handleSubmit} disabled={loading}>
							{loading ? "Processing..." : "Submit to LLM"}
						</button>

						{/* URL Input and Open Simulation Button */}
						<div className="simulation-section">
							<h3>Or Open a Simulation</h3>
							<input
								type="text"
								placeholder="Enter a URL"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								style={{ width: "100%", padding: "8px" }}
							/>
							<button
								onClick={handleOpenSimulation}
								style={{
									marginTop: "10px",
									backgroundColor: url ? "#007bff" : "#ccc", // Change background color
									cursor: url ? "pointer" : "not-allowed", // Change cursor based on input
								}}
								disabled={!url} // Disable the button if URL is empty
							>
								Open Simulation
							</button>
						</div>
					</div>
				</div>
				{submitted && (
					<div className="output-container">
						{loading ? (
							<p className="loading-text">Loading...</p>
						) : (
							<>
								{codeSuggestions.length > 0 && (
									<div className="suggestion-section">
										<h3 style={{ textAlign: "center" }}>Code Suggestions</h3>
										<div className="suggestion-list">
											{codeSuggestions.map((suggestion, index) => (
												<SuggestionCard
													key={index}
													title={suggestion.suggestionTitle}
													suggestion={suggestion.suggestion}
												/>
											))}
										</div>
									</div>
								)}

								{visualSuggestions.length > 0 && (
									<div className="visual-suggestion-section" style={{ marginTop: "20px" }}>
										<div className="visual-suggestion-list">
											{visualSuggestions.map((suggestion, index) => (
												<SuggestionCard
													key={index}
													title={suggestion.suggestionTitle}
													suggestion={suggestion.suggestion}
												/>
											))}
										</div>
									</div>
								)}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
