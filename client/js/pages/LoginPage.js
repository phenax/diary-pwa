
import { h, Component } from 'preact';
import { route } from 'preact-router';

import { loginUser, findUser, createUser, UnauthorizedError, NotFoundError } from '../libs/fetch';
import { formObject } from '../libs/utils';

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
		user: null,
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
		const data = formObject($form);

		if(this.isLoginPage) {
			if(!this.state.user) {
				// Find the user with email/username
				this.findUser(data.email);
			} else {
				// Login the user
				this.authenticate(data.email, data.password, $form);
			}
		} else {
			// Create new user
			this.signupUser(data, $form);
		}

		return false;
	}

	findUser(username) {
		return findUser(username)
			.then(data => {
				if(!data.UserPosts || !data.UserPosts.User)
					throw new NotFoundError();
				return data.UserPosts.User;
			})
			.then(user => this.setState({ user, error: null }))
			.catch(e => {
				console.log(e);

				let errorMessage = 'Something went wrong';
				if(e instanceof NotFoundError) {
					errorMessage = 'Couldn\'t find your account';
				}

				this.setState({ error: errorMessage });
			});
	}


	signupUser(data, $form) {
		return createUser(data)
			.then(data => {
				switch(data.Status) {
					case 200: // Take the user to dashboard
						$form.reset();
						return route('/', false);
					case 400:
						throw new Error(data.Message);
					case 409:
						throw new Error(data.Message, []);
					default:
						throw new Error(data.Message);
				}
			})
			.catch(e => {
				console.log(e);

				this.setState({
					error: e.message || 'Something went wrong'
				});
			});
	}


	authenticate(username, password, $form) {
		return loginUser(username, password)
			.then(data => {
				switch(data.Login.Status) {
					case 200: // Take the user to dashboard
						$form.reset();
						return route('/', false);
					case 400:
						throw new Error(data.Login.Message);
					case 401:
						throw new UnauthorizedError(data.Login.Message, []);
					default:
						throw new Error(data.Login.Message);
				}
			})
			.catch(e => {
				console.log(e);

				let errorMessage = e.message;
				if(e instanceof UnauthorizedError) {
					errorMessage = 'Password you entered was incorrect';
				}

				this.setState({ error: errorMessage || 'Something went wrong' });
			});
	}


	render() {
		return (
			<div class='center-wrapper' style={{ maxWidth: '1000px' }}>
				<Title>Login/Register</Title>

				<br />
				<div class='siimple-bg--white siimple-shadow--1'>
					<div class='flexy-row'>
						<div class='flexy-col flexy-col--6 vertical-center' style={{ padding: '0', margin: '0' }}>
							<LoginSidebar isLoginPage={this.isLoginPage} />
						</div>
						<div class='flexy-col flexy-col--6 vertical-center siimple-color--navy'>
							<div style={{ padding: '1.5em', width: '100%' }}>
								<form onSubmit={this.onFormSubmit} style={{ display: 'block', width: '100%' }}>
									{this.isLoginPage? <LoginForm user={this.state.user} ctx={this} />: <SignupForm />}
									{this.state.error? <div class='siimple-color--red-1'>{this.state.error}</div>: null}
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export const LoginForm = ({ user = null, ctx }) => (
	<div>
		<Title>Log in to your account</Title>

		<div>
			<div class='slide-in' style={{ display: (user? 'none': 'block') }}>
				<h4 class='siimple-h4 siimple-color--navy'>
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
					<button class='siimple-btn siimple-btn--primary' type='submit' style={{ display: 'block', width: '100%' }}>
						Continue
					</button>
				</div>
			</div>
			<div class='slide-in' style={{ display: (user? 'block': 'none') }}>
				<h4 class='siimple-h4 siimple-color--navy' style={{ textAlign: 'center' }}>
					<div>{user? (
						<div>
							<div>Hi, {user.Name}!</div>
							<div>
								<small class='siimple-small' style={{ color: 'inherit',opacity: '.6' }}>@{user.Username}</small>
							</div>
						</div>
					): null}</div>
					<div style={{ textAlign: 'right' }}>
						<button
							onClick={() => ctx.setState({ user: null, error: null })}
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
					<button class='siimple-btn siimple-btn--primary' type='submit' style={{ display: 'block', width: '100%' }}>
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

		<h4 class='siimple-h4 siimple-color--navy'>
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
			<button class='siimple-btn siimple-btn--primary' type='submit' style={{ display: 'block', width: '100%' }}>
				Login
			</button>
		</div>
	</div>
);

export const LoginSidebar = ({ isLoginPage = true }) => (
	<div style={LoginPage.styles.sidebarWrapper} class='siimple-bg--navy'>
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
