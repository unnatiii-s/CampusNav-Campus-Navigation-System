import { useState, useEffect, useRef } from 'react';
import { detectObjects } from '@/lib/vision';
import { DetectedObject } from '@tensorflow-models/coco-ssd';

export function useObstacleDetection(videoElement: HTMLVideoElement | null, isEnabled: boolean) {
    const [obstacles, setObstacles] = useState<DetectedObject[]>([]);

    useEffect(() => {
        if (!videoElement || !isEnabled) {
            setObstacles([]);
            return;
        }

        let isRunning = true;

        const loop = async () => {
            if (!isRunning) return;

            try {
                const results = await detectObjects(videoElement);
                if (isRunning) setObstacles(results);
            } catch (e) {
                console.error(e);
            }

            // Throttle to ~2 FPS to save battery/CPU
            setTimeout(loop, 500);
        };

        loop();

        return () => {
            isRunning = false;
        };
    }, [videoElement, isEnabled]);

    return obstacles;
}
