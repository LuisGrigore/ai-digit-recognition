from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from model import Model
from services import Service

app = Flask(__name__, template_folder="../front", static_folder="../front")
CORS(app)

try:
    model = Model("mnist_model.h5")
    service = Service(model)
except Exception as e:
    print(e)
    service = None


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/model", methods=["POST", "GET"])
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
    app.run(debug=True)
