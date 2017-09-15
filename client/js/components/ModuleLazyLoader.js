
import { h, Component } from 'preact';


/**
 * Component to lazy load preact component
 *
 * @property {Function}   onComponentLoad  Function to pass the load handler callback to
 * @property {Component}  loader           Component to render before load
 */
export default class ModuleLazyLoader extends Component {

	state = {
		onComponentLoad: this.props.onComponentLoad,
		Component: this.props.loader || (() => <div>Loading...</div>),
		isLoaded: false,
	};

	componentDidMount() {
		// If load is not complete
		if(!this.state.isLoaded) {

			this.state.onComponentLoad(_Component =>
				this.setState({ Component: _Component, isLoaded: false, }));
		}
	}

	render() { return <this.state.Component />; }
}

