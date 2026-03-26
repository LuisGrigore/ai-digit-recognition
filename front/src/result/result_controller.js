export class ResultController{
	constructor({result_view, http_client}){
		this.result_view = result_view
		this.http_client = http_client
	}
	sendImage(image) {
		this.http_client.sendImage(image).then((result) => {
			this.result_view.updateResultText(result)
		}).catch((err) => {
			this.result_view.updateResultText(err)
		});
	}
}