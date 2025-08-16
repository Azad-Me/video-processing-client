import React, { useEffect, useRef, useState } from "react";

export default function RealTimeViewer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sock, setSock] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastImage, setLastImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [pose, setPose] = useState("Unknown");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws"); // adjust host/port
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.image) setLastImage(data.image);
      if (data.detection) setDetections(data.detection.detections || []);
      if (data.pose) setPose(data.pose.activity || "Unknown");
    };
    setSock(ws);
    return () => ws.close();
  }, []);

  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    })();
  }, []);

  // Send frames at a fixed interval
  useEffect(() => {
    if (!sock || !connected) return;
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      const v = videoRef.current;
      const c = canvasRef.current;
      const ctx = c.getContext("2d");

      // Resize down to save bandwidth/CPU
      const targetW = 640;
      const scale = targetW / v.videoWidth;
      c.width = targetW;
      c.height = Math.round(v.videoHeight * scale);

      ctx.drawImage(v, 0, 0, c.width, c.height);
      c.toBlob(
        (blob) => {
          if (!blob) return;
          const fr = new FileReader();
          fr.onloadend = () => {
            // fr.result is dataURL (base64)
            sock.send(JSON.stringify({ image: fr.result }));
          };
          fr.readAsDataURL(blob);
        },
        "image/jpeg",
        0.8
      );
    }, 150); // ~6-7 fps
    return () => clearInterval(interval);
  }, [sock, connected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Connection Status */}
        <div className={`flex items-center p-4 rounded-lg ${
          connected 
            ? "bg-green-50 border border-green-200 text-green-800" 
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}></div>
          <span className="font-medium">WebSocket: {connected ? "Connected" : "Disconnected"}</span>
        </div>

        {/* Video Feeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
              <h3 className="font-medium text-gray-800">Camera Feed</h3>
            </div>
            <div className="p-4">
              <video 
                ref={videoRef} 
                className="w-full rounded-lg border border-gray-200"
                muted 
                playsInline 
              />
            </div>
          </div>

          {lastImage && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
                <h3 className="font-medium text-gray-800">Processed View</h3>
              </div>
              <div className="p-4">
                <img 
                  src={lastImage} 
                  alt="annotated" 
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Detection Results */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
            <h3 className="font-medium text-gray-800">Analysis Results</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Pose Detection</h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                pose === "Unknown" 
                  ? "bg-gray-100 text-gray-800" 
                  : "bg-blue-100 text-blue-800"
              }`}>
                {pose}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Object Detections ({detections.length})</h4>
              <ul className="space-y-3">
                {detections.map((d, i) => (
                  <li key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-800">{d.class}</span>
                      <span className="ml-2 text-sm text-gray-500">{(d.score * 100).toFixed(1)}%</span>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {d.bbox.map(n => Math.round(n)).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}