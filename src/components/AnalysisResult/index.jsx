import React, { useEffect, useState } from "react";
import BASE_URL from "../services/helper";
const AnalysisResults = () => {
  const [imagePaths, setImagePaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisResults = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/analysis/run-analysis`);
        const data = await response.json();

        if (response.ok) {
          setImagePaths(data.imagePaths);
        } else {
          console.error("Analysis failed:", data.error);
        }
      } catch (error) {
        console.error("Error fetching analysis results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisResults();
  }, []);

  return (
    <div>
      <h2>Analysis Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {imagePaths.map((path, index) => (
            <img
              key={index}
              src={path}
              alt={`Analysis Result ${index + 1}`}
              style={{ width: "100%" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
