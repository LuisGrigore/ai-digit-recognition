export class ResultView{
	constructor({res_text}){
		this.res_text = res_text
	}
	updateResultText(res){
		this.res_text.textContent = res
	}
}