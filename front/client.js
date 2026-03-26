// Base URL for the API. Defaults to an empty string so all requests use the
// same origin as the page (works when Flask serves both the frontend and the
// API). Override by setting window.API_BASE_URL before loading this module
// when the API lives on a different host.
const API_BASE_URL = window.API_BASE_URL ?? '';

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