
import { h, Component } from 'preact';


/**
 * Component to lazy load preact component
 *
 * @property {Function}   onComponentLoad  Function to pass the load handler callback to
 * @property {?VDomNode}  loader           Component to render before load
 * @property {?Number}    delay            Delay the loading of component (ms)
 */
export default class ModuleLazyLoader extends Component {

	state = {
		Component: this.props.loader || (() => <div>Loading...</div>),
		isLoaded: false,
	};

	// Load the component
	_loadComponent() {
		this.props.onComponentLoad(_Component =>
			this.setState({ Component: _Component, isLoaded: false, }));
	}

	componentDidMount() {
		// If load is not complete
		if(!this.state.isLoaded) {
			setTimeout(() => this._loadComponent(), this.props.delay || 0);
		}
	}

	render() { return this.state.Component; }
}


// import ModuleLazyLoader from './components/ModuleLazyLoader';
// const Loadd = () => <div>Loading...</div>;

// const onComponentLoad = cb =>
// 	require.ensure([], () => {
// 		const HomePage = require('./layouts/HomePage').default;
// 		cb(<HomePage />);
// 	});

// render(
// 	<ModuleLazyLoader onComponentLoad={onComponentLoad} loader={<Loadd />} />,
// 	document.getElementById('render-hook')
// );

