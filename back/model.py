import tensorflow as tf
import numpy as np

class Model:
    def __init__(self, model_path):
        try:
            self.model = tf.keras.models.load_model(model_path)
        except Exception as e:
            raise Exception("model couldn't be loaded") from e

    def classify(self, img):
        if img.ndim < 3 or img.shape[2] < 1:
            raise ValueError(f"Expected an RGB image array, got shape {img.shape}")
        img = img[:, :, 0]
        # img is a uint8 array (values 0-255). np.invert flips the pixel values
        # so that the white canvas background becomes black and the black drawn
        # strokes become white, matching the MNIST training format (white digit
        # on black background). Division by 255 must happen AFTER inversion.
        img = np.invert(np.array([img], dtype=np.uint8))
        img = img / 255.0
        prediction = self.model.predict(img)
        return np.argmax(prediction)