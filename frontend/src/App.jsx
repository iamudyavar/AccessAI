import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import newHeroImage from "./assets/newimage.png";
import SuggestionCard from "./components/SuggestionCard";
import "./App.css";

function App() {
	const [inputText, setInputText] = useState("");
	const [file, setFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [codeSuggestions, setCodeSuggestions] = useState([]);
	const [visualSuggestions, setVisualSuggestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [url, setUrl] = useState("");
	const apiUrl = "http://127.0.0.1:5000/api";

	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const handleInputChange = (e) => {
		setInputText(e.target.value);
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			const allowedExtensions = /(\.html|\.css|\.js|\.jpg|\.jpeg|\.png|\.gif)$/i;
			if (!allowedExtensions.exec(selectedFile.name)) {
				alert("Only HTML, CSS, JS, or image files are allowed.");
				e.target.value = "";
				return;
			}

			setFile(selectedFile);

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

			if (inputText.trim()) {
				formDataCode.append("code", inputText);
			}

			if (file) {
				if (file.type.startsWith("image/")) {
					formDataImage.append("image", file);
				} else {
					formDataCode.append("file", file);
				}
			}

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

			setCodeSuggestions(codeSuggestionsResponse);
			setVisualSuggestions(visualSuggestionsResponse);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenSimulation = () => {
		if (!url.trim()) {
			alert("Please enter a valid URL.");
			return;
		}
		navigate(`/simulation?url=${encodeURIComponent(url)}`);
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	return (
		<div className="app">
			<header className="hero-section">
				<div className="hero-content">
					<div className="hero-left">
						<h1>AccessAI</h1>
						<p>Revolutionizing web accessibility</p>
					</div>
				</div>
			</header>

			<div className={`content-wrapper ${submitted ? "submitted" : ""}`}>
				<section className="input-section">
					<h2>Submit Your Code or File</h2>
					<textarea
						value={inputText}
						onChange={handleInputChange}
						placeholder="Enter your code here..."
						rows={10}
					/>
					<div className="file-upload">
						<input
							type="file"
							accept=".html,.css,.js,.jpg,.jpeg,.png,.gif"
							onChange={handleFileChange}
							className="file-input"
							ref={fileInputRef}
						/>
						<button onClick={triggerFileInput} className="file-upload-button">
							Choose File
						</button>
						{file && <span className="file-name">{file.name}</span>}
					</div>
					{imagePreview && (
						<div className="image-preview">
							<img src={imagePreview} alt="Preview" />
						</div>
					)}
					<button onClick={handleSubmit} disabled={loading} className="submit-button">
						{loading ? "Processing..." : "Submit"}
					</button>

					<div className="simulation-section">
						<h3>Or Open a Simulation</h3>
						<input
							type="text"
							placeholder="Enter a URL"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
						/>
						<button
							onClick={handleOpenSimulation}
							disabled={!url}
							className="open-simulation-button"
						>
							Open Simulation
						</button>
					</div>
				</section>

				{submitted && (
					<section className="output-section">
						{loading ? (
							<p className="loading-text">Loading...</p>
						) : (
							<>
								{codeSuggestions.length > 0 && (
									<div className="suggestion-section">
										<h3>Code Suggestions</h3>
										{codeSuggestions.map((suggestion, index) => (
											<SuggestionCard
												key={index}
												title={suggestion.suggestionTitle}
												suggestion={suggestion.suggestion}
											/>
										))}
									</div>
								)}
								{visualSuggestions.length > 0 && (
									<div className="visual-suggestion-section">
										<h3>Visual Suggestions</h3>
										{visualSuggestions.map((suggestion, index) => (
											<SuggestionCard
												key={index}
												title={suggestion.suggestionTitle}
												suggestion={suggestion.suggestion}
											/>
										))}
									</div>
								)}
							</>
						)}
					</section>
				)}
			</div>
		</div>
	);
}

export default App;
