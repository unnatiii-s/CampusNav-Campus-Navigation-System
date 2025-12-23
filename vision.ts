import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

// Singleton to hold the model
let model: cocoSsd.ObjectDetection | null = null;
let isLoading = false;

/**
 * Loads the COCO-SSD model if not already loaded.
 */
export async function loadModel() {
    if (model) return model;
    if (isLoading) {
        // Wait for it to load if already detected
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (model) return model;
        }
    }

    try {
        isLoading = true;
        console.log('Loading COCO-SSD model...');
        model = await cocoSsd.load({
            base: 'lite_mobilenet_v2' // Use lite version for mobile performance
        });
        console.log('COCO-SSD model loaded.');
        return model;
    } catch (err) {
        console.error('Failed to load COCO-SSD model:', err);
        throw err;
    } finally {
        isLoading = false;
    }
}

/**
 * Runs detection on a video element.
 * @param video HTMLVideoElement
 * @returns Array of DetectedObject
 */
export async function detectObjects(video: HTMLVideoElement) {
    const net = await loadModel();
    if (!net || !video) return [];

    try {
        // Only detect if video has data
        if (video.readyState === 4) {
            const predictions = await net.detect(video);
            return predictions;
        }
        return [];
    } catch (err) {
        console.error("Detection error:", err);
        return [];
    }
}
