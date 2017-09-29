
// @flow

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const _SpeechRecognitionClass = window.SpeechRecognition;

export default class Katrina {

	recognition: _SpeechRecognitionClass;
	isSupported: boolean = false;

	constructor() {

		this.startRecognition = this.startRecognition.bind(this);
		this.onSpeech = this.onSpeech.bind(this);
		this.onPause = this.onPause.bind(this);

		if(_SpeechRecognitionClass) {

			this.isSupported = true;

			this.recognition = new _SpeechRecognitionClass();
			this.recognition.interimResults = true;
			this.recognition.lang = 'en-US';
			// this.recognition.maxAlternatives = 1;
		}
	}


	start() {
		this.startRecognition();
		this.onPause(this.startRecognition);
	}

	stop() {
		this.recognition.stop();
		this.recognition.removeEventListener('end', this.startRecognition);
	}


	startRecognition: Function;
	startRecognition() {
		this.recognition.start();
		return this;
	}


	onSpeech: Function;
	onSpeech(cb: Function) {
		this.recognition.addEventListener('result', cb);
		return this;
	}

	onPause: Function;
	onPause(cb: Function) {
		this.recognition.addEventListener('end', cb);
		return this;
	}
}
