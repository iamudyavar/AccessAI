import React, { useState, useRef, useEffect } from "react";
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
	const [selectedLenses, setSelectedLenses] = useState([]);
	const [isLensesOpen, setIsLensesOpen] = useState(false);
	const apiUrl = "https://gwnpw5ju4l.execute-api.us-east-1.amazonaws.com/Stage3/api";

	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const dropdownRef = useRef(null);
	const contentRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsLensesOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const lensOptions = [
		{ value: "Visual Disabilities", label: "Visual Disabilities" },
		{ value: "Physical Disabilities", label: "Physical Disabilities" },
		{ value: "Elderly Users", label: "Elderly Users" },
		{ value: "Non-native English Speakers", label: "Non-native English Speaker" },
	];

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

	const handleLensChange = (lens) => {
		setSelectedLenses((prevLenses) =>
			prevLenses.includes(lens) ? prevLenses.filter((l) => l !== lens) : [...prevLenses, lens]
		);
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

	const scrollToContent = () => {
		contentRef.current.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="app">
			<header className="hero-section">
				<div className="hero-content">
					<div className="hero-left">
						<h1 className="hero-title">AccessAI</h1>
						<p className="hero-subtitle">Revolutionizing web accessibility</p>
						<button onClick={scrollToContent} className="get-started-button">
							Get Started
						</button>
					</div>
				</div>
			</header>

			<div ref={contentRef} className={`content-wrapper ${submitted ? "submitted" : ""}`}>
				<section className="input-section">
					<h2>Check Your Website</h2>
					<textarea
						value={inputText}
						onChange={handleInputChange}
						placeholder="Enter your code here..."
						rows={10}
					/>
					<div className="file-and-lens-container">
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
						<div className="lens-selection" ref={dropdownRef}>
							<div className="custom-select">
								<button
									className="select-button"
									onClick={() => setIsLensesOpen(!isLensesOpen)}
								>
									{selectedLenses.length
										? `${selectedLenses.length} Lenses`
										: "Select Lenses"}
									<span className="dropdown-arrow">▼</span>
								</button>
								{isLensesOpen && (
									<div className="select-items">
										{lensOptions.map((lens) => (
											<div
												key={lens.value}
												className="select-option"
												onClick={() => handleLensChange(lens.value)}
											>
												<input
													type="checkbox"
													checked={selectedLenses.includes(lens.value)}
													onChange={() => {}}
													onClick={(e) => e.stopPropagation()}
												/>
												<span>{lens.label}</span>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
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
