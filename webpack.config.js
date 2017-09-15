
const webpack= require('webpack');
const path= require('path');

const SOURCE_DIR= path.resolve('./client/js');
const BUILD_DIR= path.resolve('./public/js');

const _s= filename => path.join(SOURCE_DIR, filename + '.js');

const webpackConfig= {

	target: 'web',

	entry: {
		script: [ 'script' ].map(k => _s(k)),
	},

	output: {
		path: BUILD_DIR,
		filename: 'script.js',
		publicPath: '/public/js/',
	},

	resolve: {
		extensions: ['', '.js'],
		modulesDirectories: ['node_modules'],
		root: [SOURCE_DIR],
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
			},
		]
	},

	devtool: 'source-map',

	plugins: [ ],
};


// For production builds
if(process.argv.indexOf('-p') !== -1) {

	webpackConfig.plugins.push(
		new webpack.optimize.UglifyJsPlugin()
	);

	webpackConfig.plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		})
	);

	webpackConfig.devtool= false;
} else {
	webpackConfig.plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"development"'
			}
		})
	);
}

module.exports= webpackConfig;
