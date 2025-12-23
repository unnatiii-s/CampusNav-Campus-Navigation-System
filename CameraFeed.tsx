'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

interface CameraFeedProps {
    onVideoReady?: (video: HTMLVideoElement) => void;
    className?: string;
    facingMode?: "user" | "environment";
}

export default function CameraFeed({ onVideoReady, className, facingMode = "environment" }: CameraFeedProps) {
    const webcamRef = useRef<Webcam>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Video constraints for mobile
    const videoConstraints = {
        facingMode: facingMode, // Use rear camera by default for navigation
        width: { ideal: 1280 },
        height: { ideal: 720 }
    };

    useEffect(() => {
        if (webcamRef.current && webcamRef.current.video && isLoaded) {
            if (onVideoReady) {
                onVideoReady(webcamRef.current.video);
            }
        }
    }, [isLoaded, onVideoReady]);

    return (
        <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={() => setIsLoaded(true)}
                className="absolute top-0 left-0 w-full h-full object-cover"
                playsInline // Important for iOS
            />
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p>Starting Camera...</p>
                </div>
            )}
        </div>
    );
}
