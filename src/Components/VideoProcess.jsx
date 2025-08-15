import React, { useState } from "react";
import { processFrame } from "./api/api.js";

export default function VideoProcess() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    setLoading(true);
    try {
      const res = await processFrame(file);
      setResults(res);
    } catch (err) {
      console.error(err);
      alert("Processing failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          🎥 Video AI Gateway Demo
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : "Upload & Process"}
          </button>
        </div>

        {results && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detection Results</h2>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <img src={`data:image/jpeg;base64,${results.detection?.image_base64}`} alt="Processed" className="max-w-full" />
                {results.detection?.detections?.map((d, i) => (
                  <li key={i}>
                    <span className="font-medium">{d.class}</span> - {Math.round(d.score * 100)}%  
                    <span className="text-sm text-gray-500"> [BBox: {d.bbox.join(", ")}]</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">Pose Activity</h2>
              <p className="mt-1 text-lg">{results.pose?.activity}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
