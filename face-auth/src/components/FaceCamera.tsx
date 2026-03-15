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
        <div className="face-camera">
            <video
                ref={videoRef}
                autoPlay
                width="400"
            />
            <button onClick={() => {
                const video = videoRef.current;
                if (video) {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL('image/png');
                        onCapture(dataUrl);
                    }
                }
            }}>
                Capture
            </button>
        </div>
    )
}