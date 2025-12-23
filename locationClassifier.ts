import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;
let mobilenet: tf.LayersModel | null = null;
let classNames: string[] = [];
let isLoading = false;

export interface LocationPrediction {
    className: string;
    probability: number;
}

export async function loadLocationModel() {
    if (model && mobilenet) return { model, mobilenet, classNames };
    if (isLoading) return null;

    try {
        isLoading = true;
        console.log('Loading Models...');

        // Load class names
        const response = await fetch('/custom_model/class_names.json');
        classNames = await response.json();

        // Load Custom Head
        model = await tf.loadLayersModel('/custom_model/model.json');

        // Load MobileNet Base (Must match training script version: 0.25_224)
        const mobilenetFull = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        const layer = mobilenetFull.getLayer('conv_pw_13_relu');
        mobilenet = tf.model({ inputs: mobilenetFull.inputs, outputs: layer.output });

        console.log('Models Loaded. Classes:', classNames);

        return { model, mobilenet, classNames };
    } catch (err) {
        console.error('Failed to load location models:', err);
        return null;
    } finally {
        isLoading = false;
    }
}

export async function predictLocation(source: HTMLVideoElement | HTMLImageElement): Promise<LocationPrediction | null> {
    const data = await loadLocationModel();
    if (!data || !data.model || !data.mobilenet) return null;

    // Guard: Check for invalid dimensions (0x0)
    let width = 0;
    let height = 0;
    if (source instanceof HTMLVideoElement) {
        width = source.videoWidth;
        height = source.videoHeight;
    } else {
        width = source.width;
        height = source.height;
    }

    if (width === 0 || height === 0) {
        console.warn('Skipping prediction: Source dimensions are 0x0');
        return null;
    }

    try {
        return tf.tidy(() => {
            // 1. Preprocess image
            let tensor = tf.browser.fromPixels(source)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .div(255.0)
                .expandDims();

            // 2. Extract Features (MobileNet)
            const features = data.mobilenet!.predict(tensor) as tf.Tensor;

            // 3. Predict Class (Custom Head)
            const predictions = data.model!.predict(features) as tf.Tensor;
            const probabilities = predictions.dataSync();

            // Debug: Log top 3
            const top3 = Array.from(probabilities)
                .map((p, i) => ({ className: data.classNames[i], probability: p }))
                .sort((a, b) => b.probability - a.probability)
                .slice(0, 3);
            console.log("Top 3 Predictions:", top3);

            const bestIdx = predictions.argMax(1).dataSync()[0];

            const bestClass = data.classNames[bestIdx];
            const bestProb = probabilities[bestIdx];

            return {
                className: bestClass,
                probability: bestProb
            };
        });
    } catch (e) {
        console.error("Prediction error", e);
        return null;
    }
}
