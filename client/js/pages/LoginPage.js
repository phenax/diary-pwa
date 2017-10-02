
import { h, Component } from 'preact';
import { route } from 'preact-router';

import { loginUser, findUser, createUser, UnauthorizedError, NotFoundError } from '../libs/fetch';
import { formObject } from '../libs/utils';
import bus from '../libs/listeners';
import { setUser } from '../libs/db';

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
			display: 'block',
			width: '100%',
			height: '100%',
		},
		sidebarContent: {
			fontSize: '.9em',
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

		this.isLoginPage = false;

		const action = this.props.path;
		if(/^\/login$/.test(action)) {
			this.isLoginPage = true;
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
				let user;

				switch(data.Status) {
					case 200: // Take the user to dashboard
						$form.reset();
						user = JSON.parse(data.Message);
						bus.setAuth(user);
						if(user) {
							setUser(user);
						}
						route('/', false);
						break;
					default:
						throw new Error(data.Message);
				}

				return user;
			})
			.catch(e => {
				console.log(e);
				this.setState({ error: e.message || 'Something went wrong' });
			});
	}


	authenticate(username, password, $form) {

		return loginUser(username, password)
			.then(data => {

				switch(data.Login.Status) {
					case 200: // Take the user to dashboard
						if(data.UserPosts) {
							$form.reset();
							bus.setAuth(data.UserPosts.User);
							setUser(data.UserPosts.User);
							route('/', false);
						} else {
							throw new Error('Something went wrong');
						}
						break;
					case 401:
						throw new UnauthorizedError(data.Login.Message, []);
					default:
						throw new Error(data.Login.Message);
				}

				return data.UserPosts.User;
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
					<div class='flexy-row flexy-row__sm-block'>
						<div class='flexy-col flexy-col--6 vertical-center'>
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

		<br />

		<div>
			<div class='slide-in' style={{ display: (user? 'none': 'block') }}>
				
				<div>
					<label style={{ fontSize: '.9em' }}>
						Enter your username or email
					</label>
					<input
						type='text' name='email'
						style={LoginPage.styles.inputField}
						placeholder='john.doe@example.com'
					/>
				</div>
				<div style={{ padding: '1em 0' }}>
					<button class='siimple-btn siimple-btn--primary siimple-btn--bg' type='submit' style={{ display: 'block', width: '100%' }}>
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
					<button class='siimple-btn siimple-btn--primary siimple-btn--bg' type='submit' style={{ display: 'block', width: '100%' }}>
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

		<br />

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
			<button class='siimple-btn siimple-btn--primary siimple-btn--bg' type='submit' style={{ display: 'block', width: '100%' }}>
				Register
			</button>
		</div>
	</div>
);

export const LoginSidebar = ({ isLoginPage = true }) => (
	<div style={LoginPage.styles.sidebarWrapper} class='login-sidebar-wrapper siimple-bg--navy'>
		<h3 class='siimple-h3' style={{ textTransform: 'uppercase' }}>
			<div>
				Welcome!
			</div>
			<small class='siimple-small' style={{ opacity: '.5' }}>
				{isLoginPage?
					'Log in to your account':
					'Register for an account'}
			</small>
		</h3>

		<div>
			<p class='siimple-p hide-sm' style={LoginPage.styles.sidebarContent}>
				<p class='siimple-p'>
					Join diary to create your own online diary
				</p>
				<p class='siimple-p'>
					You can use DiaryPWA to make your own personal journal of daily events, memories, ideas, secrets and thoughts.
				</p>
			</p>
		</div>
	</div>
);
