
import { h, Component } from 'preact';

export default class LoginPage extends Component {


	static styles = {
		inputField: {
			padding: '.5em 1em',
			fontSize: '1em',
			border: '1px solid #ccc',
			outline: 'none',
			display: 'block',
			width: '100%',
		},
		sidebarWrapper: {
			padding: '1em',
			textAlign: 'center',
		},
		sidebarContent: {
			fontSize: '.8em',
			padding: '1em',
			opacity: '.8',
			lineHeight: '1.7em',
		},
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
	}


	render() {
		return (
			<div class='center-wrapper' style={{ maxWidth: '1000px' }}>
				<br />
				<div class='siimple-shadow--1'>
					<div>
						<div class='flexy-row'>
							<div class='flexy-col flexy-col--6' style={{ padding: '0', margin: '0' }}>
								<LoginSidebar isLoginPage={this.isLoginPage} />
							</div>
							<div class='flexy-col flexy-col--6 vertical-center'>
								<div style={{ padding: '1em', width: '100%' }}>
									{this.isLoginPage? <LoginForm />: <SignupForm />}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export const LoginForm = () => (
	<div class='slide-in'>
		<label style={{ fontSize: '.9em', }}>
			Enter your email
		</label>
		<input
			type='text' name='email'
			style={LoginPage.styles.inputField}
			placeholder='john.doe@example.com'
		/>
	</div>
);

export const SignupForm = () => (
	<div class='slide-in'>
		<label style={{ fontSize: '.9em', }}>
			Create an account
		</label>
		<input
			type='text' name='email'
			style={LoginPage.styles.inputField}
			placeholder='john.doe@example.com'
		/>
	</div>
);

export const LoginSidebar = () => (
	<div style={LoginPage.styles.sidebarWrapper} class='siimple-bg--grey'>
		<br />

		<h3 class='siimple-h3' style={{ textTransform: 'uppercase' }}>Welcome!</h3>

		<div>
			<p class='siimple-p' style={LoginPage.styles.sidebarContent}>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
				quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
				consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
				cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
				proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			</p>
		</div>

		<br />
	</div>
);
