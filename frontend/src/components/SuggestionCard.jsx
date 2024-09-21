import React from "react";
import "./SuggestionCard.css";

function SuggestionCard({ title, suggestion }) {
	return (
		<div className="suggestion-card">
			<h3>{title}</h3>
			<p>{suggestion}</p>
		</div>
	);
}

export default SuggestionCard;
