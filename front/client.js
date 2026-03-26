class Client{
	async sendImage(image){
		const formData = new FormData();

        formData.append('image', image, 'canvas_image.png');

		const response = await fetch('http://127.0.0.1:5000/model', {
			method: 'POST',
			body: formData,
		});
		const data = await response.json()
		return data.result

	}
}
export default Client