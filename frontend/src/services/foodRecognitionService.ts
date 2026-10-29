import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export interface ImagePrediction {
  label: string;
  confidence: number;
}

let modelPromise: Promise<mobilenet.MobileNet> | null = null;

const getModel = async () => {
  if (!modelPromise) {
    modelPromise = (async () => {
      await tf.ready();
      return mobilenet.load({ version: 2, alpha: 1 });
    })();
  }

  return modelPromise;
};

const loadImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image for classification'));
    image.src = src;
  });

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Unable to read image file'));
    reader.readAsDataURL(file);
  });

export const foodRecognitionService = {
  classifyImageData: async (imageData: string) => {
    const model = await getModel();
    const image = await loadImageElement(imageData);
    const predictions = await model.classify(image, 5);

    return predictions.map((prediction) => ({
      label: prediction.className,
      confidence: Math.round(prediction.probability * 1000) / 1000,
    })) as ImagePrediction[];
  },

  classifyFile: async (file: File) => {
    const imageData = await readFileAsDataUrl(file);
    const predictions = await foodRecognitionService.classifyImageData(imageData);
    return {
      imageData,
      predictions,
    };
  },
};
