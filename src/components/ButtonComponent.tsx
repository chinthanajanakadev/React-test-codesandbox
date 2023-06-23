import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const ButtonComponent: React.FC = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    loadModelFromStorage();
  }, []);

  const loadModelFromStorage = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('localstorage://my-model');
      setModel(loadedModel);
      console.log('Model loaded from storage');
    } catch (error) {
      console.log('No model found in storage. Training new model...');
      trainModel();
    }
  };

  const trainModel = async () => {
    // Code for training a simple TensorFlow.js model
    // Replace with your own training logic
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);
    await model.fit(xs, ys, { epochs: 10 });
    setModel(model);
    console.log('Model trained');
  };

  const handleRunModel = () => {
    if (model) {
      const inputTensor = tf.tensor2d([[Number(inputText)]]);
      const outputTensor = model.predict(inputTensor) as tf.Tensor;
      const predictionValue = Array.from(outputTensor.dataSync())[0];
      setPrediction(predictionValue.toString());
    }
  };

  const handleSaveModel = async () => {
    if (model) {
      const modelName = prompt('Enter a name for the model:');
      if (modelName) {
        await model.save(`localstorage://${modelName}`);
        console.log('Model saved to storage');
      }
    }
  };

  return (
    <div>
      <button onClick={handleRunModel}>Run Model</button>
      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <div>Prediction: {prediction}</div>
      <button onClick={handleSaveModel}>Save Model</button>
    </div>
  );
};

export default ButtonComponent;

