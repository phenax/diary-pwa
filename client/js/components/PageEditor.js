
import {h, Component} from 'preact';

import SpeechRecognitionLib from '../libs/speech-recognition';
import { ratingFaces } from '../libs/icons';

export default class PageEditor extends Component {

	static styles = {
		wrapper: {
			padding: '1em 0',
		},
		titleField: { },
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
			padding: '.6em 0',
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

	RATINGS = ratingFaces;


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
		} else {
			Array.from(this.base.querySelectorAll('input,textarea'))
				.forEach($input => {
					if($input.type === 'radio' || $input.type === 'checkbox') {
						$input.checked = true;
					} else {
						$input.value = '';
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
							class='siimple-input siimple-input--bg'
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
										style={{
											padding: '0 1.3em',
											height: 'auto',
											border: 'none',
										}}
										onClick={this.toggleSpeechRecognition}>
										{this.state.isSpeechRecognitionOn? 'Turn off mic': 'Turn on mic'}
									</label>
								</div>): null
						}
					</div>

					<br />

					<div>
						<div class='flexy-row post-happy-scale'>
							{this.RATINGS.map((rating, i) => (
								<div class="flexy-col flexy-col--3" key={i}>
									<label class='megacheckbox' style={PageEditor.styles.ratingLabel}>
										<input
											type='radio' name='Rating'
											class='megacheckbox--radio'
											value={rating.value} checked
											style={{ display: 'none' }}
										/>
										<div class='megacheckbox--text' style={PageEditor.styles.ratingText}>
											{rating.icon? rating.icon: <i class={rating.class} />}
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
