const NodeExternals = require('webpack-node-externals')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (options, webpack) {
	return {
		...options,
		entry: ['webpack/hot/poll?100', options.entry],
		externals: [
			NodeExternals({
				allowlist: ['webpack/hot/poll?100']
			})
		],

		plugins: [
			...options.plugins,
			new webpack.HotModuleReplacementPlugin(),
			new webpack.WatchIgnorePlugin({
				paths: [/\.js$/, /\.d\.ts$/]
			}),
			new RunScriptWebpackPlugin({
				name: options.output.filename,
				autoRestart: true
			}),
			new TsconfigPathsPlugin(),
			new CopyWebpackPlugin({ patterns: [{ from: 'src/project/i18n', to: 'i18n' }] })
		]
	}
}
