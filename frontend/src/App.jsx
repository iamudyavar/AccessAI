import { useState, useRef } from "react";
import "./App.css";
import backgroundImage from './assets/newimage.png'; // Background image

function App() {
    const [inputText, setInputText] = useState("");
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [outputText, setOutputText] = useState("");
    const [loading, setLoading] = useState(false);

    const submitSectionRef = useRef(null);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
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

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOutputText("Processed Output: Your input has been successfully processed!");
        }, 2000);
    };

    const scrollToSubmitSection = () => {
        submitSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="app">
            <header className="hero-section">
                <div className="hero-content">
                    <div className="hero-left">
                        <h1>AccessAI</h1>
                        <p>
                            AccessAI helps developers enhance the accessibility of their code with AI-powered suggestions.
                            With just a few clicks, you can upload code or images and receive recommendations to make your project more inclusive.
                        </p>
                        <button className="cta-button" onClick={scrollToSubmitSection}>Get Started</button>
                    </div>
                </div>
            </header>

            <section className="input-section" ref={submitSectionRef}>
                <h2 className="section-heading">Submit Your Code or Image</h2>

                <textarea
                    value={inputText}
                    onChange={handleInputChange}
                    rows={8}
                    className="code-input"
                />

                <div className="file-upload">
                    <input type="file" onChange={handleFileChange} className="file-input" />
                    <label htmlFor="file" className="dotted-border">
                        <span>Upload an Image</span>
                    </label>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                </div>

                <button onClick={handleSubmit} className="submit-button dotted-border">
                    {loading ? "Processing..." : "Submit"}
                </button>

                {outputText && <div className="output-box">{outputText}</div>}
            </section>

            {/* Adding more content */}
            <section className="additional-content">
                <h2>Why Choose AccessAI?</h2>
                <p>
                    At AccessAI, we believe in creating a more inclusive web. Our tools are designed to ensure that developers
                    can easily check and enhance the accessibility of their projects, making them usable for everyone.
                </p>
                <p>
                    Our AI-driven approach analyzes your code and provides tailored recommendations to help you meet
                    accessibility standards effortlessly. Whether you're building a website, app, or software, AccessAI ensures your project is inclusive.
                </p>
            </section>
        </div>
    );
}

export default App;
