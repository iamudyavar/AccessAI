import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring"; // For dropdown animations

function Simulation() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const url = queryParams.get("url");

	const [filter, setFilter] = useState(""); // Initial state for the filter
	const [open, setOpen] = useState(false); // Track if dropdown is open
	const [isAnimating, setIsAnimating] = useState(false); // Control wipe animation

	// Screen wipe animation control using CSS
	const applyFilterWithAnimation = (selectedFilter) => {
		// Start animation
		setIsAnimating(true);

		// Delay the filter application until the animation completes
		setTimeout(() => {
			// Apply the appropriate CSS filter for color blindness simulation
			switch (selectedFilter) {
				case "deuteranopia":
					setFilter("grayscale(0.5) sepia(1) hue-rotate(-50deg) saturate(1.2) contrast(0.85)");
					break;
				case "protanopia":
					setFilter("grayscale(0.5) sepia(1) hue-rotate(-35deg) saturate(1.2) contrast(0.85)");
					break;
				case "tritanopia":
					setFilter("grayscale(0.5) sepia(1) hue-rotate(90deg) saturate(1.1) contrast(0.85)");
					break;
				default:
					setFilter(""); // No filter for normal vision
			}

			// End animation after applying filter
			setIsAnimating(false);
		}, 500); // Adjust duration to match the wipe animation timing
	};

	const handleFilterChange = (selectedFilter) => {
		applyFilterWithAnimation(selectedFilter);
		setOpen(false); // Close options after selection
	};

	// React Spring animation for showing options
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
			{/* Floating filter controls */}
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
				}}
			>
				<button
					onClick={() => setOpen(!open)}
					style={{
						backgroundColor: "#6200EA",
						color: "#fff",
						border: "none",
						padding: "10px",
						borderRadius: "4px",
						cursor: "pointer",
						fontSize: "16px",
					}}
				>
					Choose Disability
				</button>

				{/* Options will show below the button */}
				{open && (
					<animated.div style={optionsAnimation}>
						<ul style={{ listStyle: "none", padding: 0, margin: "10px 0" }}>
							<li>
								<button onClick={() => handleFilterChange("")} style={getButtonStyle()}>
									Normal Vision
								</button>
							</li>
							<li>
								<button
									onClick={() => handleFilterChange("deuteranopia")}
									style={getButtonStyle()}
								>
									Deuteranopia (Red-Green)
								</button>
							</li>
							<li>
								<button
									onClick={() => handleFilterChange("protanopia")}
									style={getButtonStyle()}
								>
									Protanopia (Red-Green)
								</button>
							</li>
							<li>
								<button
									onClick={() => handleFilterChange("tritanopia")}
									style={getButtonStyle()}
								>
									Tritanopia (Blue-Yellow)
								</button>
							</li>
						</ul>
					</animated.div>
				)}
			</div>

			{/* Screen wipe effect when filter changes */}
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
					zIndex: 1, // Ensure it is above iframe but behind controls
				}}
			></div>

			{/* Render the full-screen iframe if URL is present */}
			{url ? (
				<iframe
					src={url}
					title="Simulation"
					width="100%"
					height="100%"
					style={{
						border: "none",
						filter: filter, // Apply the filter dynamically
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
		</div>
	);
}

export default Simulation;

// Helper function for button styles
function getButtonStyle() {
	return {
		backgroundColor: "#f0f0f0",
		color: "#333",
		border: "none",
		padding: "8px 16px",
		margin: "4px 0",
		borderRadius: "4px",
		cursor: "pointer",
		width: "100%",
		textAlign: "left",
		fontSize: "14px",
	};
}
