const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist'),
  },
  // Cloudflare Worker environment is similar to a webworker
  target: 'webworker',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  mode: 'development',
  // wrangler doesn't like eval which devtools use in development
  devtool: 'none',
  module: {
    rules: [
      {
        // Compile Typescript code
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
}
