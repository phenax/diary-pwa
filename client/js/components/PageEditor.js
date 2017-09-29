
import {h, Component} from 'preact';

import SpeechRecognitionLib from '../libs/speech-recognition';


export default class PageEditor extends Component {

	static styles = {
		wrapper: {
			padding: '1em 0',
		},
		titleField: {
			fontSize: '2em',
			height: 'auto',
			padding: '.3em .5em',
			display: 'block',
			width: '100%',
		},
		contentField: {
			height: '400px',
			minHeight: '200px',
			padding: '1em',
			display: 'block',
			width: '100%',
			resize: 'vertical',
		},

		ratingLabel: {
			display: 'block',
		},

		ratingText: {
			textAlign: 'center',
			fontSize: '2.6em',
			padding: '.6em',
			borderRadius: '5px',
			cursor: 'pointer',
		},

		submitBtn: {
			textTransform: 'uppercase',
			fontSize: '1em',
			padding: '.3em 1em',
			height: 'auto',
		},
	};

	RATINGS = [
		{ value: 1, icon: '☹' },
		{ value: 2, icon: '😐' },
		{ value: 3, icon: '😊' },
		{ value: 4, icon: '😄' },
	];



	state = {
		isSpeechRecognitionOn: false,
	};

	constructor(props) {
		super(props);

		this.isEditMode = !!this.props.page;

		this.toggleSpeechRecognition = this.toggleSpeechRecognition.bind(this);
	}

	componentDidMount() {
		
		if(this.isEditMode) {

			// Set the values to the input fields
			Object.keys(this.props.page).map(propName => {

				const $inputs =
					Array.from(this.base.querySelectorAll(`[name="${propName}"]`));

				if($inputs.length) {
					if($inputs[0].type === 'radio' || $inputs[0].type === 'checkbox') {
						$inputs
							.map($el => { $el.checked = false; return $el; })
							.filter($el => $el.value == this.props.page[propName])
							.forEach($el => $el.checked = 'checked');
					} else {
						$inputs
							.forEach($el => $el.value = this.props.page[propName]);
					}
				}
			});
		}

		this.initSpeechRecognition();
	}

	initSpeechRecognition() {

		this.recognition = new SpeechRecognitionLib();

		if(this.recognition.isSupported) {

			const $contentTextarea = this.base.querySelector('.js-post-content');

			let prevGuess = null;

			this.recognition.onSpeech(e => {

				let content = $contentTextarea.value;

				const result =
					Array.from(e.results)
						.map(result => result[0])
						.map(result => result.transcript)
						.join('');

				if(prevGuess) {
					content = content.slice(0, content.length - prevGuess.length - 1);
				}

				if(e.results[0].isFinal) {
					prevGuess = null;
				} else {
					prevGuess = result;
				}

				$contentTextarea.value = `${(content.length)? `${content} `: ''}${result}`;
			});
		}
	}

	toggleSpeechRecognition() {

		if(this.recognition.isSupported) {

			if(this.state.isSpeechRecognitionOn) {
				this.recognition.stop();
			} else {
				this.recognition.start();
			}

			this.setState({ isSpeechRecognitionOn: !this.state.isSpeechRecognitionOn });
		}
	}

	render() {
		return (
			<div style={PageEditor.styles.wrapper}>
				<div>
					<div>
						<input
							type='text' name='Title'
							class='siimple-input'
							placeholder='Enter the page title'
							style={PageEditor.styles.titleField}
						/>
					</div>

					<br />

					<div>
						<div style={{ textAlign: 'right' }}>
							<button
								type='button'
								onClick={this.toggleSpeechRecognition}>
								<i class=''>
									{this.state.isSpeechRecognitionOn? 'Stop': 'Start'}
								</i>
							</button>
						</div>
						<div>
							<textarea
								type='text' name='Content'
								class='siimple-textarea js-post-content'
								placeholder='I took a shit today...'
								style={PageEditor.styles.contentField}
							/>
						</div>
					</div>

					<br />

					<div class='siimple-grid'>
						<div class='siimple-grid-row'>
							{this.RATINGS.map(rating => (
								<div class="siimple-grid-col siimple-grid-col--3">
									<label class='megacheckbox' style={PageEditor.styles.ratingLabel}>
										<input
											type='radio' name='Rating'
											class='megacheckbox--radio'
											value={rating.value} checked
										/>
										<div class='megacheckbox--text' style={PageEditor.styles.ratingText}>
											{rating.icon}
										</div>
									</label>
								</div>
							))}
						</div>
					</div>

					<br />


					<div style={{ textAlign: 'right' }}>
						<button class='siimple-btn siimple-btn--navy' type='submit' style={PageEditor.styles.submitBtn}>
							Post
						</button>
					</div>
				</div>
			</div>
		);
	}
}
