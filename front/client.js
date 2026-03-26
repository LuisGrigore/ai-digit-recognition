// Base URL for the API. Override by setting window.API_BASE_URL before loading
// this module (e.g. from a server-rendered config block), or update this
// default for your deployment environment.
const API_BASE_URL = window.API_BASE_URL ?? 'http://127.0.0.1:5000';

class Client {
	async sendImage(image) {
		const formData = new FormData();
		formData.append('image', image, 'canvas_image.png');

		const response = await fetch(`${API_BASE_URL}/model`, {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error ?? `Server error: ${response.status}`);
		}

		const data = await response.json();
		return data.result;
	}
}

export default Client;