import { useRef, useEffect } from "react";

export default function FaceCamera({onCapture}: {onCapture: (dataUrl: string) => void}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error("Error accessing webcam: ", err);
            });
    }, []);

    return (
        <div className="face-camera flex flex-col items-center gap-3">
            <div className="w-96 h-72 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow" onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth || 640;
                        canvas.height = video.videoHeight || 480;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            const dataUrl = canvas.toDataURL('image/png');
                            onCapture(dataUrl);
                        }
                    }
                }}>Capture</button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md" onClick={() => {
                    const video = videoRef.current as HTMLVideoElement | null;
                    if (video && video.srcObject) {
                        const tracks = (video.srcObject as MediaStream).getTracks();
                        tracks.forEach(t => t.stop());
                    }
                }}>Stop</button>
            </div>
        </div>
    )
}