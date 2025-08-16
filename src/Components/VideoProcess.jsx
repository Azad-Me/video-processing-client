import React, { useState } from "react";
import { processFrame } from "./api/api";

function VideoProcessor() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = async (event) => {
    const BASEURL = import.meta.env.VITE_BASE_URLL;
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    // const formData = new FormData();
    // formData.append("file", file);

    try {
      const data = await processFrame(file, BASEURL, "videos/video_processing");

    //   const data = await response.json();
      setFrames(data.frames); // backend sends { frames: [ ... ] }
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Video Processing Demo</h1>
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="mb-4"
      />

      {loading && <p>Processing video... please wait</p>}

      {!loading && frames.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {frames.map((frame, index) => (
            <div key={index} className="border p-2 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">
                Frame {frame.frame_index}
              </h2>
              <img
                src={frame.image}
                alt={`frame-${index}`}
                className="w-full rounded"
              />
              <div className="mt-2">
                <p className="text-sm font-bold">Detections:</p>
                <ul className="text-sm">
                  {frame.detections.map((det, i) => (
                    <li key={i}>
                      {det.class} ({(det.score * 100).toFixed(1)}%) -{" "}
                      {JSON.stringify(det.bbox)}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-bold mt-2">
                  Pose: {frame.pose?.activity || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoProcessor;
