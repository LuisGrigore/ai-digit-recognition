# AI Digit Recognition

A full-stack application that lets you draw a digit on a canvas and uses a trained CNN (Convolutional Neural Network) to classify it.

## Project Structure

```
.
├── back/               # Python / Flask backend
│   ├── controller.py   # Flask routes
│   ├── model.py        # Keras model wrapper
│   ├── services.py     # Image pre-processing
│   ├── train.py        # Model training script
│   └── requirements.txt
└── front/              # Vanilla JS frontend
    ├── index.html
    ├── main.js
    ├── client.js
    ├── style.css
    ├── canvas/
    │   ├── canvas_controller.js
    │   └── canvas_view.js
    └── result/
        ├── result_controller.js
        └── result_view.js
```

## Requirements

- Python 3.10+
- A modern browser (Chrome, Firefox, Safari, Edge)

## Setup

### 1. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

### 2. Install Python dependencies

```bash
pip install -r back/requirements.txt
```

### 3. Train the model

Run the training script from the project root. This will download the MNIST dataset, train the CNN, and save the model as `back/mnist_model.keras`.

```bash
python -m back.train
```

Training uses early stopping (patience=3) so it will finish well before the 50-epoch maximum.

### 4. Start the backend server

```bash
cd back
python -m flask --app controller run
```

The server starts at `http://127.0.0.1:5000`.

To enable debug mode (development only):

```bash
FLASK_DEBUG=1 python -m flask --app controller run
```

### 5. Open the frontend

Navigate to `http://127.0.0.1:5000/app` in your browser.

## Configuration

| Environment variable | Default                        | Description                                                  |
|----------------------|--------------------------------|--------------------------------------------------------------|
| `FLASK_DEBUG`        | `0`                            | Set to `1` to enable Flask debug mode                        |
| `CORS_ORIGIN`        | `http://127.0.0.1:5000`        | Allowed CORS origin for the `/model` endpoint                |
| `PORT`               | `5000`                         | Port the Flask dev-server listens on (set automatically by hosting platforms) |
| `MODEL_PATH`         | `<script-dir>/mnist_model.keras` | Absolute or relative path to the trained Keras model file  |

To configure the API base URL on the frontend, set `window.API_BASE_URL` before `main.js` is loaded:

```html
<script>window.API_BASE_URL = 'https://your-api-domain.com';</script>
<script type="module" src="main.js"></script>
```

## Free Deployment on Render.com

[Render.com](https://render.com) offers a free tier for web services that is well-suited for this project.

### Steps

1. **Push the repository to GitHub** (or GitLab / Bitbucket).

2. **Create a new Web Service** on Render and point it at your repository.
   Render will auto-detect `render.yaml` and pre-fill the build/start commands.

3. **Build command** (from `render.yaml`):
   ```
   pip install -r back/requirements.txt && python back/train.py
   ```
   This installs all Python dependencies and trains the MNIST model during the build phase.
   The trained file is saved to `back/mnist_model.keras` and is available at runtime.

4. **Start command** (from `render.yaml`):
   ```
   gunicorn --chdir back --workers 2 controller:app
   ```

5. Once deployed, open `https://<your-service>.onrender.com/app`.

### Notes

- The free tier spins down after 15 minutes of inactivity; the first request after a cold start may take ~30–60 seconds.
- TensorFlow installation is large (~500 MB); Render's free build minutes should cover it.
- No separate environment variables are required — defaults in `render.yaml` handle everything.

## How It Works

1. The user draws a digit on the HTML5 canvas (black stroke on white background).
2. On submit, the canvas is exported as a PNG blob and sent to `POST /model`.
3. The backend pre-processes the image:
   - Converts to RGBA, resizes to 28×28 pixels.
   - Composites onto a white RGB background.
   - Extracts the red channel (grayscale proxy).
   - **Inverts** pixel values so the white background becomes black and the black strokes become white — matching the MNIST training format (white digit on black background).
   - Normalises to [0, 1].
4. The CNN predicts the digit class (0–9) and returns it as JSON.
5. The result is displayed below the canvas.

## Model Architecture

| Layer          | Details                          |
|----------------|----------------------------------|
| Conv2D         | 32 filters, 3×3, ReLU            |
| MaxPooling2D   | 2×2                              |
| Conv2D         | 64 filters, 3×3, ReLU            |
| MaxPooling2D   | 2×2                              |
| Flatten        |                                  |
| Dense          | 128 units, ReLU                  |
| Dropout        | 0.5                              |
| Dense (output) | 10 units, Softmax                |

Data augmentation (rotation, shift, shear, zoom) is applied during training. Horizontal flipping is **disabled** because it would corrupt digit labels (e.g. flipping a 6 produces a 9).
