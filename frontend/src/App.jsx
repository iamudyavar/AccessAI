// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";

// function App() {
// 	const [inputText, setInputText] = useState(""); // For user input
// 	const [responseText, setResponseText] = useState(""); // For LLM response
// 	const [loading, setLoading] = useState(false);
// 	const apiUrl = "http://127.0.0.1:5000/api"; // Replace with actual backend API URL

// 	// Handle change in textarea input
// 	const handleInputChange = (e) => {
// 		setInputText(e.target.value);
// 	};

// 	// Submit input to backend and fetch the LLM response
// 	const handleSubmit = async () => {
// 		if (!inputText.trim()) {
// 			alert("Please enter some code!");
// 			return;
// 		}

// 		setLoading(true);
// 		try {
// 			const response = await fetch(apiUrl, {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ code: inputText }),
// 			});

// 			if (response.ok) {
// 				const data = await response.json();
// 				setResponseText(data.message);
// 			} else {
// 				console.error("Error fetching response:", response.statusText);
// 			}
// 		} catch (error) {
// 			console.error("Error:", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className="app">
// 			{/* Header with logos */}
// 			<header className="app-header">
// 				<div className="logos">
// 					<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
// 						<img src={viteLogo} className="logo" alt="Vite logo" />
// 					</a>
// 					<a href="https://react.dev" target="_blank" rel="noreferrer">
// 						<img src={reactLogo} className="logo react" alt="React logo" />
// 					</a>
// 				</div>
// 				<h1>AccessAI</h1>
// 			</header>

// 			{/* Main container */}
// 			<main className="content-container">
// 				{/* Input box for user code */}
// 				<section className="input-section">
// 					<h2>Enter Your Code</h2>
// 					<textarea
// 						value={inputText}
// 						onChange={handleInputChange}
// 						placeholder="Enter your code here..."
// 						rows={10}
// 					/>
// 					<button onClick={handleSubmit} disabled={loading}>
// 						{loading ? "Processing..." : "Submit to LLM"}
// 					</button>
// 				</section>

// 				{/* Output box for LLM response */}
// 				<section className="output-section">
// 					<h2>LLM Model Response</h2>
// 					<div className="response-box">
// 						{loading ? (
// 							<p className="loading-text">Loading...</p>
// 						) : responseText ? (
// 							<pre>{responseText}</pre>
// 						) : (
// 							<p className="placeholder-text">The LLM response will appear here.</p>
// 						)}
// 					</div>
// 				</section>
// 			</main>
// 		</div>
// 	);
// }

// export default App;

//----------
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";

// function App() {
// 	const [inputText, setInputText] = useState(""); // For user input
// 	const [responseText, setResponseText] = useState(""); // For LLM response
// 	const [loading, setLoading] = useState(false);
// 	const [file, setFile] = useState(null);
// 	const apiUrl = "http://127.0.0.1:5000/api"; // Replace with actual backend API URL

// 	// Handle change in textarea input
// 	const handleInputChange = (e) => {
// 		setInputText(e.target.value);
// 	};

// 	// Handle file input change
// 	const handleFileChange = (e) => {
// 		setFile(e.target.files[0]);
// 	};

// 	// Submit input to backend and fetch the LLM response
// 	const handleSubmit = async () => {
// 		if (!inputText.trim() && !file) {
// 			alert("Please enter some code or upload a file!");
// 			return;
// 		}

// 		setLoading(true);
// 		const formData = new FormData();
		
// 		if (file) {
// 			formData.append("file", file);
// 		} else {
// 			formData.append("code", inputText);
// 		}

// 		try {
// 			const response = await fetch(apiUrl, {
// 				method: "POST",
// 				body: formData,
// 			});

// 			if (response.ok) {
// 				const data = await response.json();
// 				setResponseText(data.message);
// 			} else {
// 				console.error("Error fetching response:", response.statusText);
// 			}
// 		} catch (error) {
// 			console.error("Error:", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className="app">
// 			<header className="app-header">
// 				<div className="logos">
// 					<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
// 						<img src={viteLogo} className="logo" alt="Vite logo" />
// 					</a>
// 					<a href="https://react.dev" target="_blank" rel="noreferrer">
// 						<img src={reactLogo} className="logo react" alt="React logo" />
// 					</a>
// 				</div>
// 				<h1>AccessAI</h1>
// 			</header>

// 			<main className="content-container">
// 				<section className="input-section">
// 					<h2>Enter Your Code or Upload a File</h2>
// 					<textarea
// 						value={inputText}
// 						onChange={handleInputChange}
// 						placeholder="Enter your code here..."
// 						rows={10}
// 					/>
// 					<div className="file-input">
// 						<label htmlFor="file-upload">Choose File</label>
// 						<input 
// 							id="file-upload" 
// 							type="file" 
// 							onChange={handleFileChange} 
// 							accept=".txt,.py,.js,.html,.css,.java,.png,.jpg,.jpeg" 
// 						/>
// 						{file && <span className="file-name">{file.name}</span>}
// 					</div>
// 					<button onClick={handleSubmit} disabled={loading}>
// 						{loading ? "Processing..." : "Submit to LLM"}
// 					</button>
// 				</section>

// 				<section className="output-section">
// 					<h2>LLM Model Response</h2>
// 					<div className="response-box">
// 						{loading ? (
// 							<p className="loading-text">Loading...</p>
// 						) : responseText ? (
// 							<pre>{responseText}</pre>
// 						) : (
// 							<p className="placeholder-text">The LLM response will appear here.</p>
// 						)}
// 					</div>
// 				</section>
// 			</main>
// 		</div>
// 	);
// }

// export default App;


//--------

// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";

// function App() {
// 	const [inputText, setInputText] = useState(""); // For user input
// 	const [responseText, setResponseText] = useState(""); // For LLM response
// 	const [loading, setLoading] = useState(false);
// 	const [file, setFile] = useState(null);
// 	const apiUrl = "http://127.0.0.1:5000/api"; // Replace with actual backend API URL

// 	// Handle change in textarea input
// 	const handleInputChange = (e) => {
// 		setInputText(e.target.value);
// 	};

// 	// Handle file input change
// 	const handleFileChange = (e) => {
// 		setFile(e.target.files[0]);
// 	};

// 	// Submit input to backend and fetch the LLM response
// 	const handleSubmit = async () => {
// 		if (!inputText.trim() && !file) {
// 			alert("Please enter some code or upload a file!");
// 			return;
// 		}

// 		setLoading(true);
// 		const formData = new FormData();
		
// 		if (file) {
// 			formData.append("file", file);
// 		} else {
// 			formData.append("code", inputText);
// 		}

// 		try {
// 			const response = await fetch(apiUrl, {
// 				method: "POST",
// 				body: formData,
// 			});

// 			if (response.ok) {
// 				const data = await response.json();
// 				setResponseText(data.message);
// 			} else {
// 				console.error("Error fetching response:", response.statusText);
// 			}
// 		} catch (error) {
// 			console.error("Error:", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className="app">
// 			<header className="app-header">
// 				<div className="logos">
// 					<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
// 						<img src={viteLogo} className="logo" alt="Vite logo" />
// 					</a>
// 					<a href="https://react.dev" target="_blank" rel="noreferrer">
// 						<img src={reactLogo} className="logo react" alt="React logo" />
// 					</a>
// 				</div>
// 				<h1>AccessAI</h1>
// 			</header>

// 			<main className="content-container">
// 				<section className="input-section">
// 					<h2>Enter Your Code or Upload a File</h2>
// 					<textarea
// 						value={inputText}
// 						onChange={handleInputChange}
// 						placeholder="Enter your code here..."
// 						rows={10}
// 					/>
// 					<div className="input-actions">
// 						<div className="file-input">
// 							<label htmlFor="file-upload">Choose File</label>
// 							<input 
// 								id="file-upload" 
// 								type="file" 
// 								onChange={handleFileChange} 
// 								accept=".txt,.py,.js,.html,.css,.jpg,.jpeg,.png" 
// 							/>
// 							{file && <span className="file-name">{file.name}</span>}
// 						</div>
// 						<button onClick={handleSubmit} disabled={loading}>
// 							{loading ? "Processing..." : "Submit to LLM"}
// 						</button>
// 					</div>
// 				</section>

// 				<section className="output-section">
// 					<h2>LLM Model Response</h2>
// 					<div className="response-box">
// 						{loading ? (
// 							<p className="loading-text">Loading...</p>
// 						) : responseText ? (
// 							<pre>{responseText}</pre>
// 						) : (
// 							<p className="placeholder-text">The LLM response will appear here.</p>
// 						)}
// 					</div>
// 				</section>
// 			</main>
// 		</div>
// 	);
// }

// export default App;

//----------------

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
	const [inputText, setInputText] = useState(""); // For user input
	const [responseText, setResponseText] = useState(""); // For LLM response
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const apiUrl = "http://127.0.0.1:5000/api"; // Replace with actual backend API URL

	// Handle change in textarea input
	const handleInputChange = (e) => {
		setInputText(e.target.value);
	};

	// Handle file input change
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);

		// Create preview for images
		if (selectedFile && selectedFile.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(selectedFile);
		} else {
			setPreview(null);
		}
	};

	// Submit input to backend and fetch the LLM response
	const handleSubmit = async () => {
		if (!inputText.trim() && !file) {
			alert("Please enter some text or upload a file!");
			return;
		}

		setLoading(true);
		const formData = new FormData();
		
		if (file) {
			formData.append("file", file);
		} else {
			formData.append("code", inputText);
		}

		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				body: formData,
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

			<main className="content-container">
				<section className="input-section">
					<h2>Enter Your Text or Upload a File</h2>
					<textarea
						value={inputText}
						onChange={handleInputChange}
						placeholder="Enter your text here..."
						rows={10}
					/>
					<div className="input-actions">
						<div className="file-input">
							<label htmlFor="file-upload">Choose File</label>
							<input 
								id="file-upload" 
								type="file" 
								onChange={handleFileChange} 
								accept=".txt,.py,.js,.html,.css,.png,.jpg,.jpeg,.gif" 
							/>
							{file && <span className="file-name">{file.name}</span>}
						</div>
						<button onClick={handleSubmit} disabled={loading}>
							{loading ? "Processing..." : "Submit to LLM"}
						</button>
					</div>
					{preview && (
						<div className="image-preview">
							<img src={preview} alt="Preview" />
						</div>
					)}
				</section>

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