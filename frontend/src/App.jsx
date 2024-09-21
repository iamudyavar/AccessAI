import { useState } from "react";
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
	const apiUrl = "http://127.0.0.1:5000/api"; // Replace with actual backend API URL

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
	);
}

export default App;
