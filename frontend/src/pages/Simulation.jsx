import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import Draggable from "react-draggable";
import { ClipLoader } from "react-spinners";

function Simulation() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const url = queryParams.get("url");

	const [filter, setFilter] = useState("");
	const [open, setOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const [insightVisible, setInsightVisible] = useState(false);
	const [insightLoading, setInsightLoading] = useState(false);
	const [insightText, setInsightText] = useState("");

	const applyFilterWithAnimation = (selectedFilter) => {
		// Start animation
		setIsAnimating(true);
		setInsightVisible(false); // Hide insights immediately

		const animationDuration = 500; // Duration of the wipe animation

		setTimeout(() => {
			let text = "";
			switch (selectedFilter) {
				case "deuteranopia":
					setFilter("grayscale(0.5) sepia(1) hue-rotate(-50deg) saturate(1.2) contrast(0.85)");
					text = "This looks good! Consider using shapes to enhance clarity.";
					break;
				case "protanopia":
					setFilter("grayscale(0.5) sepia(1) hue-rotate(-35deg) saturate(1.2) contrast(0.85)");
					text = "This looks good! Ensure important elements are distinguishable.";
					break;
				case "tritanopia":
					setFilter("grayscale(0.5) sepia(1) hue-rotate(90deg) saturate(1.1) contrast(0.85)");
					text = "This looks good! Ensure high contrast for key elements.";
					break;
				case "achromatopsia":
					setFilter("grayscale(1)");
					text = "This looks good! Use textures and patterns for differentiation.";
					break;
				case "low-vision":
					setFilter("blur(4px) contrast(1.5)");
					text =
						"Text may appear small; consider optimizing for larger fonts and higher contrast for better readability.";
					break;
				case "high-contrast":
					setFilter("contrast(2) brightness(0.8)");
					text =
						"This looks good! High contrast can enhance visibility, but be mindful of color combinations.";
					break;
				default:
					setFilter(""); // Resets filter for normal vision
					text = "";
					setInsightLoading(false);
					setInsightVisible(false); // Hide insights for normal vision
					setIsAnimating(false); // Reset animation state immediately
					return; // Exit early
			}

			// Show loading after animation
			setInsightText(text);
			setInsightVisible(true);
			setInsightLoading(true);

			setTimeout(() => {
				setInsightLoading(false);
				setIsAnimating(false);
			}, 1000); // Keep the loading spinner for a while before hiding
		}, animationDuration);
	};

	const handleFilterChange = (selectedFilter) => {
		applyFilterWithAnimation(selectedFilter);
		setOpen(false);
	};

	const optionsAnimation = useSpring({
		opacity: open ? 1 : 0,
		transform: open ? `translateY(0)` : `translateY(-20px)`,
		config: { tension: 200, friction: 15 },
	});

	return (
		<div
			className="simulation-page"
			style={{ height: "100vh", overflow: "hidden", position: "relative" }}
		>
			<Draggable>
				<div
					className="filter-controls"
					style={{
						position: "absolute",
						top: "20px",
						left: "20px",
						zIndex: 2,
						backgroundColor: "rgba(255, 255, 255, 0.9)",
						borderRadius: "8px",
						padding: "10px",
						boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
						cursor: "move",
					}}
				>
					<button onClick={() => setOpen(!open)} style={getButtonStyle()}>
						Choose Disability
					</button>

					{open && (
						<animated.div style={optionsAnimation}>
							<ul style={{ listStyle: "none", padding: 0, margin: "10px 0" }}>
								{[
									{ name: "Normal Vision", value: "" },
									{
										name: "Red-Green Color Blindness (Deuteranopia/Protanopia)",
										value: "protanopia",
									},
									{ name: "Blue-Yellow Color Blindness (Tritanopia)", value: "tritanopia" },
									{ name: "Achromatopsia", value: "achromatopsia" },
									{ name: "Low Vision", value: "low-vision" },
									{ name: "High Contrast", value: "high-contrast" },
								].map(({ name, value }) => (
									<li key={value}>
										<button
											onClick={() => handleFilterChange(value)}
											style={getButtonStyle()}
										>
											{name}
										</button>
									</li>
								))}
							</ul>
						</animated.div>
					)}
				</div>
			</Draggable>

			<div
				className={`wipe-animation ${isAnimating ? "active" : ""}`}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(255, 255, 255, 0.9)",
					transition: "transform 0.5s ease-out",
					transform: isAnimating ? "translateX(0)" : "translateX(-100%)",
					zIndex: 1,
				}}
			></div>

			{url ? (
				<iframe
					src={url}
					title="Simulation"
					width="100%"
					height="100%"
					style={{
						border: "none",
						filter: filter,
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					}}
				/>
			) : (
				<p>No URL provided</p>
			)}

			{/* AI Powered Insights Box */}
			{insightVisible && (
				<div
					className="ai-insights"
					style={{
						position: "absolute",
						bottom: "20px",
						left: "20px",
						border: "5px solid transparent",
						padding: "15px",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
						zIndex: 2,
						width: "250px",
						fontSize: "16px",
						backgroundColor: "#fff",
						borderImage: "linear-gradient(135deg, #FFEB3B, #FFFFFF, #2196F3) 1",
					}}
				>
					<h4 style={{ margin: 0 }}>AI Insights</h4>
					{insightLoading ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "50px",
							}}
						>
							<ClipLoader size={25} color={"#333"} loading={insightLoading} />
						</div>
					) : (
						<p>{insightText}</p>
					)}
				</div>
			)}
		</div>
	);
}

export default Simulation;

function getButtonStyle() {
	return {
		backgroundColor: "#f0f0f0",
		color: "#333",
		border: "none",
		padding: "10px 20px",
		margin: "8px 0",
		borderRadius: "4px",
		cursor: "pointer",
		width: "100%",
		textAlign: "left",
		fontSize: "14px",
	};
}
