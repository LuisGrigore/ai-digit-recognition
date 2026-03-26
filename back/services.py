from PIL import Image
import io
from model import Model
import numpy as np


class Service:
    def __init__(self, model):
        self.model: Model = model

    def preprocess_image(self, blob):
        image = Image.open(io.BytesIO(blob)).convert("RGBA")

        image = image.resize((28, 28), Image.Resampling.BILINEAR)

        background = Image.new("RGB", image.size, (255, 255, 255))
        background.paste(image, (0, 0), image)

        img_array = np.array(background)

        return img_array

    def classify(self, blob):
        img = self.preprocess_image(blob)
        return self.model.classify(img)