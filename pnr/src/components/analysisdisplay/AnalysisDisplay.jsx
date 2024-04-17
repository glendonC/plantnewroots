import React from 'react';
import './analysisdisplay.css'; // Ensure proper styling is set in this CSS file

const AnalysisDisplay = ({ generatedText }) => {
    return (
        <div className="analysis-display">
            <h2>Generated Recommendations</h2>
            {generatedText ? (
                <div className="generated-text">
                    <p>{generatedText}</p>
                </div>
            ) : (
                <p>No recommendations generated yet.</p>
            )}
        </div>
    );
};

export default AnalysisDisplay;
