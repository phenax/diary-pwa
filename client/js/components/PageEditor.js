
import {h, Component} from 'preact';


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

	constructor(props) {
		super(props);

		this.isEditMode = !!this.props.page;
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
						<textarea
							type='text' name='Content'
							class='siimple-textarea'
							placeholder='I took a shit today...'
							style={PageEditor.styles.contentField}
						/>
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
