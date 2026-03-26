import cv2
import tensorflow as tf
import numpy as np

class Model:
    def __init__(self,model_path):
        try:
            self.model = tf.keras.models.load_model(model_path)
        except Exception:
            raise Exception("model couldn't be loaded")

    def classify(self, image_path):
        img = cv2.imread(image_path)
        if img is None:
            raise Exception("image could not be read.")
        img = img[:, :, 0]
        img = np.invert(np.array([img]))
        img = img / 255
        prediction = self.model.predict(img)
        return np.argmax(prediction)