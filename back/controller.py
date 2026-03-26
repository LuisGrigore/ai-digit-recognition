import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from model import Model
from services import Service

load_dotenv(dotenv_path=".env.dev")

app = Flask(__name__, template_folder="../front", static_folder="../front")

CORS(app, origins=os.environ.get("CORS_ORIGIN"))
_default_model_path = os.path.join(os.path.dirname(__file__), "models/mnist_model.keras")
MODEL_PATH = os.environ.get("MODEL_PATH", _default_model_path)

try:
    model = Model(MODEL_PATH)
    service = Service(model)
except Exception as e:
    print(e)
    service = None


@app.route("/model", methods=["POST"])
def process():
    if service is None:
        return jsonify({"error": "Model not loaded"}), 503
    return jsonify(
        {"result": f"{str(service.classify(request.files['image'].read()))}"}
    )


@app.route("/app")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    debug = (lambda p: int(p) == 1 if p else False)(os.environ.get("FLASK_DEBUG"))
    port = (lambda p: int(p) if p else None)(os.environ.get("PORT"))
    app.run(debug=debug, host="0.0.0.0", port=port)
