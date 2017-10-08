
import { h, Component } from 'preact';
import { route } from 'preact-router';

import { editUser, UnauthorizedError } from '../../libs/fetch';

import Title from '../../components/Title';
import Flash from '../../components/Flash';
import PatternLock from '../../components/PatternLock';

export default class UserEditPage extends Component {

	state = {
		password: '',
	};

	constructor(props) {
		super(props);

		this.onPatternComplete = this.onPatternComplete.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
	}

	onPatternComplete(password) {
		this.setState({ password });
	}


	onFormSubmit(e) {
		e.preventDefault();

		if(this.state.password.length === 0) {
			Flash.setFlash('The session password has to be atleast 2 points', 'red', 'white');
			return false;
		}

		editUser({ SessionPassword: this.state.password })
			.then(resp => {
				console.log(resp);
				switch(resp.Status) {
					case 200:
						Flash.setFlash('You session password has been activated', 'green' ,'navy');
						route('/', false);
						return resp;
					case 401:
						throw new UnauthorizedError();
					default:
						throw new Error();
				}
			})
			.catch(e => {
				if(e instanceof UnauthorizedError) {
					Flash.setFlash('You are not logged in', 'red', 'white');
					route('/', false);
				} else {
					Flash.setFlash('Something went wrong', 'red', 'white');
				}
			});

		return false;
	}

	render() {
		return (
			<div>
				<Title>Edit profile</Title>
				<div class='center-wrapper' style={{ padding: '2em 1em' }}>

					<h2 class='siimple-h2'>
						<div>
							Edit profile
						</div>
					</h2>

					<br />

					<form onSubmit={this.onFormSubmit}>

						<h5 class='siimple-h5'>
							<div>Set your session password</div>
							<small
								style={{ opacity: '.6' }}
								class='siimple-small'>
								The session password allows you to password protect your session
							</small>
						</h5>
						<div style={{ textAlign: 'right' }}>
							{
								this.state.password?
									<button
										type='submit'
										class='siimple-btn siimple-btn--purple'>
										Save password
									</button>: null
							}
						</div>
						<div style={{ textAlign: 'center' }}>
							<PatternLock
								onPatternComplete={this.onPatternComplete}
							/>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
