
import { h, Component } from 'preact';

import { loginUser, UnauthorizedError } from '../libs/fetch';

import Title from '../components/Title';

export default class LoginPage extends Component {


	static styles = {
		inputWrap: {
			padding: '.5em 0',
		},
		inputField: {
			padding: '.5em 1em',
			fontSize: '1em',
			border: '1px solid #ccc',
			outline: 'none',
			display: 'block',
			width: '100%',
		},
		sidebarWrapper: {
			padding: '3em 1.5em',
		},
		sidebarContent: {
			fontSize: '1em',
			padding: '1em 0',
			opacity: '.6',
			lineHeight: '1.7em',
		},
	};


	state = {
		email: null,
		error: null,
	};

	constructor(props) {
		super(props);

		const action = this.props.path;

		this.isLoginPage = false;

		switch(action) {
			case '/login': {
				this.isLoginPage = true;
				break;
			}
		}

		this.onFormSubmit = this.onFormSubmit.bind(this);
	}


	onFormSubmit(e) {
		e.preventDefault();

		const $form = e.currentTarget;
		const data = new FormData($form);

		if(this.isLoginPage) {
			if(!this.state.email) {
				// TODO: Make a call to user find
				this.setState({ email: data.get('email') });
			} else {
				// TODO: Get a FormData polyfill
				loginUser(data.get('email'), data.get('password'))
					.then(data => console.log(data))
					.catch(e => {
						if(e instanceof UnauthorizedError) {
							this.setState({ error: 'Password you entered was incorrect' });
						}
					});
			}
		} else {
			console.log('Signup');
		}

		return false;
	}


	render() {
		return (
			<div class='center-wrapper' style={{ maxWidth: '1000px' }}>
				<Title>Login/Register</Title>

				<br />
				<div class='siimple-shadow--1'>
					<div>
						<div class='flexy-row'>
							<div class='flexy-col flexy-col--6 vertical-center' style={{ padding: '0', margin: '0' }}>
								<LoginSidebar isLoginPage={this.isLoginPage} />
							</div>
							<div class='flexy-col flexy-col--6 vertical-center'>
								<div style={{ padding: '1.5em', width: '100%' }}>
									<form onSubmit={this.onFormSubmit} style={{ display: 'block', width: '100%' }}>
										{this.isLoginPage? <LoginForm email={this.state.email} ctx={this} />: <SignupForm />}
										{this.state.error? <div class='siimple-color--red-1'>{this.state.error}</div>: null}
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export const LoginForm = ({ email = null, ctx }) => (
	<div>
		<Title>Log in to your account</Title>

		<div>
			<div class='slide-in' style={{ display: (email? 'none': 'block') }}>
				<h4 class='siimple-h4'>
					Login
				</h4>
				<div>
					<label style={{ fontSize: '.9em' }}>
						Enter your email
					</label>
					<input
						type='text' name='email'
						style={LoginPage.styles.inputField}
						placeholder='john.doe@example.com'
					/>
				</div>
				<div style={{ padding: '1em 0' }}>
					<button class='siimple-btn siimple-btn--navy' type='submit' style={{ display: 'block', width: '100%' }}>
						Continue
					</button>
				</div>
			</div>
			<div class='slide-in' style={{ display: (email? 'block': 'none') }}>
				<h4 class='siimple-h4' style={{ textAlign: 'center' }}>
					<div>{email}</div>
					<div style={{ textAlign: 'right' }}>
						<button
							onClick={() => ctx.setState({ email: null })}
							class='siimple-a'
							style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
							type='button'>
							Not you?
						</button>
					</div>
				</h4>
				<div>
					<label style={{ fontSize: '.9em' }}>
						Enter password
					</label>
					<input
						type='password' name='password'
						style={LoginPage.styles.inputField}
						placeholder='********'
					/>
				</div>
				<div style={{ padding: '1em 0' }}>
					<button class='siimple-btn siimple-btn--navy' type='submit' style={{ display: 'block', width: '100%' }}>
						Login
					</button>
				</div>
			</div>
		</div>
	</div>
);

export const SignupForm = () => (
	<div class='slide-in'>
		<Title>Create an account</Title>

		<h4 class='siimple-h4'>
			Create an account
		</h4>

		<div style={LoginPage.styles.inputWrap}>
			<label style={{ fontSize: '.9em', }}>
				Name
			</label>
			<input
				type='text' name='name'
				style={LoginPage.styles.inputField}
				placeholder='John Doe'
			/>
		</div>

		<div style={LoginPage.styles.inputWrap}>
			<label style={{ fontSize: '.9em', }}>
				Username
			</label>
			<input
				type='text' name='username'
				style={LoginPage.styles.inputField}
				placeholder='johnnydoer69'
			/>
		</div>

		<div style={LoginPage.styles.inputWrap}>
			<label style={{ fontSize: '.9em', }}>
				Email
			</label>
			<input
				type='email' name='email'
				style={LoginPage.styles.inputField}
				placeholder='john.doe@example.com'
			/>
		</div>

		<div style={LoginPage.styles.inputWrap}>
			<label style={{ fontSize: '.9em', }}>
				Password
			</label>
			<input
				type='password' name='password'
				style={LoginPage.styles.inputField}
				placeholder='********'
			/>
		</div>


		<div style={{ padding: '1em 0' }}>
			<button class='siimple-btn siimple-btn--navy' type='submit' style={{ display: 'block', width: '100%' }}>
				Login
			</button>
		</div>
	</div>
);

export const LoginSidebar = ({ isLoginPage = true }) => (
	<div style={LoginPage.styles.sidebarWrapper} class='siimple-bg--grey'>
		<br />

		<h3 class='siimple-h3' style={{ textTransform: 'uppercase' }}>
			<div>
				Welcome!
			</div>
			<small class='siimple-small' style={{ opacity: '.5' }}>
				{isLoginPage?
					'Log in to your diary account':
					'Register for an account to use diary'}
			</small>
		</h3>

		<div>
			<p class='siimple-p' style={LoginPage.styles.sidebarContent}>
				<p class='siimple-p'>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
					tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
				</p>
				<p class='siimple-p'>
					quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
					consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
				</p>
				<p class='siimple-p'>
					cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
					proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</p>
		</div>

		<br />
	</div>
);
