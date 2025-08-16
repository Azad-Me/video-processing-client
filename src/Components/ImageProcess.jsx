import React, { useState } from "react";
import { processFrame } from "./api/api.js";
import { Modal } from 'antd';

export default function ImageProcess() {
  const BASEURL = import.meta.env.VITE_BASE_URLL;
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    setLoading(true);
    try {
      const res = await processFrame(file, BASEURL, "images/process");
      setResults(res);
    } catch (err) {
      console.error(err);
      alert("Processing failed");
    }
    setImageProcessing(true)
    setLoading(false);
  };

  return (
    <div className="min-h-140  w-full rounded-lg bg-gray-100 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-3xl flex flex-row bg-white shadow-lg rounded-xl p-6">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
            🎥 Image AI Gateway Demo
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
              className={`px-6 py-2 rounded-lg text-white font-medium ${loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading ? "Processing..." : "Upload & Process"}
            </button>
          </div>

        </div>
        <div >
          {results && (
            <Modal
              title={
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Detection Results</span>
                </div>
              }
              width="80%"
              style={{
                top: 80,
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              bodyStyle={{
                height: "70vh",
                overflowY: "auto",
                padding: 0
              }}
              open={imageProcessing}
              onCancel={() => setImageProcessing(false)}
              footer={null}
              maskStyle={{ backdropFilter: 'blur(4px)' }}
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="md:w-2/3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-200 relative">
                  <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-600 shadow-xs flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Active Detection
                  </div>
                  <div className="h-full flex items-center justify-center">
                    <div className="relative group">
                      <img
                        src={`data:image/jpeg;base64,${results.detection?.image_base64}`}
                        alt="Processed"
                        className="max-h-[65vh] object-contain rounded-md shadow-sm transition-all duration-200 group-hover:shadow-md"
                      />
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-100 rounded-md pointer-events-none transition-all duration-300"></div>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="md:w-1/3 p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-600 w-1 h-5 mr-2 rounded-full"></span>
                    Detection Details
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Detected Objects
                      </h3>
                      <ul className="space-y-3">
                        {results.detection?.detections?.map((d, i) => (
                          <li
                            key={i}
                            className="p-3 bg-gradient-to-r from-white to-gray-50 rounded-md shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-200 relative"
                          >
                            <div className="absolute -left-1 top-3 w-1 h-6 bg-blue-500 rounded-full"></div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-800 capitalize flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                {d.class}
                              </span>
                              <span className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold shadow-inner">
                                {Math.round(d.score * 100)}%
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 font-mono flex items-center">
                              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                              </svg>
                              BBox: [{d.bbox.map(num => num.toFixed(2)).join(", ")}]
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Pose Analysis
                      </h3>
                      <div className="p-3 bg-gradient-to-r from-white to-green-50 rounded-md shadow-xs border border-gray-100 flex items-center hover:shadow-sm transition-shadow duration-200">
                        <div className="bg-gradient-to-br from-green-100 to-green-200 p-2 rounded-full mr-3 shadow-inner">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-700"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-800 capitalize">
                          {results.pose?.activity || 'No activity detected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )}

        </div>
      </div>
    </div>
  );
}
