import { useState, useEffect, useRef } from 'react';
import { predictLocation } from '@/lib/locationClassifier';

export function useLocation(videoElement: HTMLVideoElement | null, isActive: boolean = true) {
    const [currentLocationId, setCurrentLocationId] = useState('main gate'); // Default to main gate
    const [isLocating, setIsLocating] = useState(false);
    const [lastPrediction, setLastPrediction] = useState<string>('');

    useEffect(() => {
        if (!videoElement || !isActive) return;

        let isRunning = true;

        const loop = async () => {
            if (!isRunning) return;

            try {
                // Predict
                const result = await predictLocation(videoElement);

                if (result && result.probability > 0.7) {
                    // If high confidence
                    setLastPrediction(`Found: ${result.className} (${(result.probability * 100).toFixed(0)}%)`);

                    // Update location if it's a valid node in our graph
                    // In a real app, we might need a "smoothing" buffer (e.g. 3 consecutive frames)
                    if (result.className) {
                        setCurrentLocationId(result.className.toLowerCase()); // Ensure case matches graph keys
                    }
                }
            } catch (e) {
                console.error("Loc loop error", e);
            }

            // Run every 2 seconds to save battery
            if (isRunning) setTimeout(loop, 2000);
        };

        loop();

        return () => {
            isRunning = false;
        };
    }, [videoElement, isActive]);

    return {
        currentLocationId,
        setCurrentLocationId, // Allow manual override for testing
        lastPrediction
    };
}
