
// @flow

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const _SpeechRecognitionClass = window.SpeechRecognition;

export default class Katrina {

	recognition: _SpeechRecognitionClass;
	isSupported: boolean = false;

	constructor() {

		this.startRecognition = this.startRecognition.bind(this);

		if(_SpeechRecognitionClass) {

			this.isSupported = true;

			this.recognition = new _SpeechRecognitionClass();
			this.recognition.interimResults = true;
			this.recognition.lang = 'en-US';
			// this.recognition.maxAlternatives = 1;
		}
	}

	startRecognition: Function;
	startRecognition() {
		this.recognition.start();
		return this;
	}


	start() {
		this.startRecognition()
			.onPause(this.startRecognition);
	}

	stop() {
		this.recognition.stop();
		this.recognition.removeEventListener('end', this.startRecognition);
	}


	onSpeech(cb: Function) {
		this.recognition.addEventListener('result', cb);
		return this;
	}

	onPause(cb: Function) {
		this.recognition.addEventListener('end', cb);
		return this;
	}
}
