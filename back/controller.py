import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from model import Model
from services import Service

if os.path.exists(".env.dev"):
    load_dotenv(".env.dev")

app = Flask(
    __name__,
    template_folder=os.environ.get("TEMPLATE_FOLDER", "front/dist"),
    static_folder=os.environ.get("STATIC_FOLDER", "front/dist/assets"),
)

CORS(app, origins=os.environ.get("CORS_ORIGIN", "http://127.0.0.1:5000"))

_default_model_path = os.path.join(os.path.dirname(__file__), "models/mnist_model.keras")
MODEL_PATH = os.environ.get("MODEL_PATH", _default_model_path)

try:
    model = Model(MODEL_PATH)
    service = Service(model)
except Exception as e:
    print("Error loading model:", e)
    service = None

@app.route("/model", methods=["POST"])
def process():
    if service is None:
        return jsonify({"error": "Model not loaded"}), 503
    return jsonify({"result": str(service.classify(request.files['image'].read()))})

@app.route("/app")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = os.environ.get("FLASK_DEBUG") == "1"
    app.run(debug=DEBUG, host="0.0.0.0", port=PORT)