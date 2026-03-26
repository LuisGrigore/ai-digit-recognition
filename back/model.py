import tensorflow as tf
import numpy as np

class Model:
    def __init__(self,model_path):
        try:
            self.model = tf.keras.models.load_model(model_path)
        except Exception:
            raise Exception("model couldn't be loaded")

    def classify(self, img):
        if img.ndim < 3 or img.shape[2] < 1:
            raise ValueError(f"Expected an RGB image array, got shape {img.shape}")
        img = img[:, :, 0]
        img = np.invert(np.array([img]))
        img = img / 255
        prediction = self.model.predict(img)
        return np.argmax(prediction)