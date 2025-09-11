import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [cameraError, setCameraError] = useState(null);

  const stopStream = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {
        // ignore
      }
      streamRef.current = null;
    }
  };

  const start = async () => {
    setLoading(true);
    setCameraError(null);
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = "Camera is not available in this browser.";
      setCameraError(msg);
      setLoading(false);
      toast.error(msg);
      return;
    }

    // Try to request environment (rear) camera first; fallback to any camera
    const attempts = [
      { video: { facingMode: "environment" }, audio: false },
      { video: true, audio: false },
    ];

    for (const constraints of attempts) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // some browsers require explicit play
          try {
            await videoRef.current.play();
          } catch (playErr) {
            // ignore play errors; video may autoplay once user interacts
            console.warn("Video play() failed:", playErr);
          }
        }
        setLoading(false);
        setCameraError(null);
        return;
      } catch (err) {
        console.warn("getUserMedia attempt failed:", err, constraints);
        // try next
      }
    }

    const msg =
      "Unable to access camera. Check permissions or try a different browser.";
    setCameraError(msg);
    setLoading(false);
    toast.error(msg);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) start();
    return () => {
      mounted = false;
      stopStream();
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob);
        }
      },
      "image/png",
      0.92
    );
  };

  const handleClose = () => {
    stopStream();
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Use Camera</h3>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close camera"
          >
            ✕
          </button>
        </div>

        <div className="w-full h-72 bg-gray-900 rounded overflow-hidden flex items-center justify-center">
          {loading ? (
            <div className="text-white">Starting camera...</div>
          ) : cameraError ? (
            <div className="text-center px-4">
              <div className="text-white mb-2">{cameraError}</div>
              <div className="text-sm text-gray-300">
                Make sure camera permissions are allowed and try Retry, or use
                the file input.
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
          )}
        </div>

        <div className="mt-3 flex items-center justify-between space-x-2">
          <button
            onClick={handleCapture}
            disabled={!!cameraError || loading}
            className={`flex-1 rounded-lg px-4 py-2 shadow ${
              cameraError || loading
                ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Capture
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={start}
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2"
            >
              Retry
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;
