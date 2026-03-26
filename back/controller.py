import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from model import Model
from services import Service

app = Flask(__name__, template_folder="../front", static_folder="../front")

# Restrict CORS to the configured origin (defaults to localhost for development).
# Set the CORS_ORIGIN environment variable in production.
CORS(app, origins=os.environ.get("CORS_ORIGIN", "http://127.0.0.1:5000"))

try:
    model = Model("mnist_model.h5")
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
    # Never run with debug=True in production.
    # Set the FLASK_DEBUG environment variable to "1" to enable debug mode.
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(debug=debug)
