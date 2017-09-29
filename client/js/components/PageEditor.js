
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
			height: '300px',
			minHeight: '160px',
			padding: '1em',
			display: 'block',
			width: '100%',
			resize: 'vertical',
		},

		ratingLabel: {
			display: 'block',
			width: '100%',
		},

		ratingText: {
			textAlign: 'center',
			fontSize: '2.5em',
			padding: '.6em',
			borderRadius: '5px',
			cursor: 'pointer',
		},

		submitBtn: {
			textTransform: 'uppercase',
			fontSize: '1em',
			padding: '.5em 1em',
			height: 'auto',
			margin: '1em 0',
			width: '100%',
		},
	};

	RATINGS = [
		{ value: 1, class: 'fa fa-frown-o' },
		{ value: 2, class: 'fa fa-meh-o' },
		{ value: 3, class: 'fa fa-smile-o' },
		{ value: 4, class: 'fa fa-x-laughing' },
	];



	state = {
		isSpeechRecognitionOn: false,
	};

	constructor(props) {
		super(props);

		this.isEditMode = !!this.props.page;

		this.toggleSpeechRecognition = this.toggleSpeechRecognition.bind(this);

		this.initSpeechRecognition();
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
	}

	initSpeechRecognition() {

		this.recognition = new SpeechRecognitionLib();

		if(this.recognition.isSupported) {

			let $contentTextarea;
			let prevGuess = null;

			this.recognition.onSpeech(e => {

				if(!$contentTextarea) {
					$contentTextarea = this.base.querySelector('.js-post-content');
				}

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

					<div style={{ paddingTop: '.7em' }} class='textarea-action-wrapper'>
						<textarea
							type='text' name='Content'
							class='siimple-textarea textarea-action js-post-content'
							id='contentTextarea'
							placeholder='I took a shit today...'
							style={PageEditor.styles.contentField}
						/>
						{
							(this.recognition || {}).isSupported?
								(<div class='textarea-action--btn-list'>
									<label
										for='contentTextarea'
										type='button'
										class='siimple-btn siimple-btn--navy'
										style={{ padding: '0 1.3em', height: 'auto', border: 'none' }}
										onClick={this.toggleSpeechRecognition}>
										<i class={`fa fa-${this.state.isSpeechRecognitionOn? 'microphone-slash': 'microphone'}`}></i>
									</label>
								</div>): null
						}
					</div>

					<br />

					<div>
						<div class='flexy-row'>
							{this.RATINGS.map(rating => (
								<div class="flexy-col" style={{ width: '100%' }}>
									<label class='megacheckbox' style={PageEditor.styles.ratingLabel}>
										<input
											type='radio' name='Rating'
											class='megacheckbox--radio'
											value={rating.value} checked
											style={{ display: 'none' }}
										/>
										<div class='megacheckbox--text' style={PageEditor.styles.ratingText}>
											<i class={rating.class} />
										</div>
									</label>
								</div>
							))}
						</div>
					</div>

					<br />


					<div style={{ textAlign: 'right' }}>
						<button class='siimple-btn siimple-btn--navy' type='submit' style={PageEditor.styles.submitBtn}>
							Save post
						</button>
					</div>
				</div>
			</div>
		);
	}
}
