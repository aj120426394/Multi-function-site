const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

/**
 * Creating a webpack dev-server configuration with customize host and port.
 * @param {String} host -The address you want to host this project
 * @param {Number} port -The port you want to host this porject.
 * @returns {{devServer: {historyApiFallback: boolean, hot: boolean, inline: boolean, stats: string, host: *, port: *}, plugins: [*]}}
 */
exports.devServer = function({host, port}) {
  console.log("test");
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,
      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: host, // Defaults to `localhost`
      port: port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
};

/**
 * Creating a webpack UglifyJS / Dedupe / NoErrors plugin configuration.
 * - Plugins - Search for equal or similar files and deduplicate them in the output.
 * - Plugins - When there are errors while compiling this plugin skips the emitting phase (and recording phase), so there are no assets emitted that include errors.
 * - Plugins - Compress the JS bundle
 *
 * @returns {{plugins: [*]}}
 */
exports.optimize = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        // Don't beautify output (enable for neater output)
        beautify: false,
        // Eliminate comments
        comments: false,
        compress: {
          warnings: false,
          drop_console: true
        },
        sourceMap: false,
        mangle: {
          except: ['$', 'jQuery']
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.NoErrorsPlugin()
    ]
  };
};

/**
 * Creating a webpack configuration for environment variable.
 * @param {String} key - The variable key.
 * @param {String} value - The value you would like to assign.
 * @returns {{plugins: [*]}}
 */
exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
};


/**
 * Creating a webpack extract bundle configuration, extract the webpack runtime setting and some library.
 * @param {String} name -The name of the extract js file.
 * @param {Array} entries -The path of the js file.
 * @returns {{entry: {}, plugins: [*]}}
 */
exports.extractBundle = function({name, entries}) {
  const entry = {};
  entry[name] = entries;
  return {
    // Define an entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [name, 'manifest']
      })
    ]
  };
};

//
/**
 * Creating a webpack cleaning plugin configuration to delete the old version of the production folder.
 * @param {String} path -The path of the production folder.
 * @returns {{plugins: [*]}}
 */
exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
      })
    ]
  };
};

/**
 * Creating the configuration of converting SCSS to inline css.
 * @param {RegExp} excludePaths -The regular expression of exclude path.
 * @param {Array} extraResources -The array of the paths of the external resource you want to include.
 * @param {Boolean} sourceMap -The controller of enable source map.
 * @returns {{module: {loaders: [*,*]}, sassLoader: {includePaths: *}}}
 */
exports.inlineSCSStoCSS = function(excludePaths, extraResources, sourceMap){
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loaders: ["style-loader", "css-loader?sourceMap!postcss-loader"]
        },
        {
          test: /\.scss$/,
          loaders: ["style-loader", "css-loader?sourceMap!postcss-loader!sass-loader"],
          exclude: excludePaths
        }
      ]
    },
    sassLoader: {
      sourceMap: sourceMap,
      includePaths: extraResources
    }
  };
};

/**
 * Creating the configuration of converting SCSS to extract css.
 * @param {RegExp} excludePaths -The regular expression of exclude path.
 * @param {Array} extraResources -The array of the paths of the external resource you want to include.
 * @param {Boolean} sourceMap -The controller of enable source map.
 * @returns {{module: {loaders: [*,*]}, sassLoader: {includePaths: *}, plugins: [*]}}
 */
exports.extractSCSStoCSS = function(excludePaths, extraResources, sourceMap) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!postcss-loader!sass-loader"),
          exclude: excludePaths
        }
      ]
    },
    sassLoader: {
      sourceMap: sourceMap,
      includePaths: extraResources
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
};


/**
 * This is a under-testing function for creating the configuration of CSS module.
 * @param {RegExp} excludePaths -The regular expression of exclude path.
 * @param {Array} extraResources -The array of the paths of the external resource you want to include.
 * @param {Boolean} sourceMap -The controller of enable source map.
 * @param {Array} sassResource -The SASS main resource. Normally, it's the main scss file in your project.
 * @param {Boolean} inline -The controller of enable inline CSS.
 * @returns {{module: {loaders: [*,*]}, sassLoader: {sourceMap: *, includePaths: *}, sassResources: *, plugins: [*]}}
 * @constructor
 */
exports.SCSStoCSSModule = function(excludePaths, extraResources, sourceMap, sassResource, inline) {
  // Sass loader setting for css module:
  const extractCSS = new ExtractTextPlugin('[name].[chunkhash].css');

  const inline = 'style!css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass!sass-resources';
  const extract = extractCSS.extract("style", "css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass!sass-resources");

  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: extractCSS.extract("style-loader", "css-loader!postcss-loader")
        },
        {
          test: /\.scss$/,
          loader: inline ? inline : extract,
          exclude: excludePaths
        }
      ]
    },
    sassLoader: {
      sourceMap: sourceMap,
      includePaths: extraResources
    },
    sassResources: sassResource,
    plugins: [
      // Output extracted CSS to a file
      extractCSS
    ]
  };
};

/**
 * Creating a ES linting configuration for webpack.
 * @param {RegExp} excludePath -The excluding path of the eslint.
 * @returns {{module: {preLoaders: [*]}}}
 */
exports.eslint = function(excludePath) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.jsx?$/,
          loaders: ['eslint'],
          include: excludePath
        }
      ]
    }
  }
};

/**
 * Creating a Sass linting configuration for webpack.
 * @returns {{plugins: [*]}}
 */
exports.sassLint = function(){
  return {
    plugins: [
      new StyleLintPlugin({
        configFile: '.stylelintrc',
        files: ['**/*.s?(a|c)ss'],
        syntax: 'scss',
        failOnError: false,
      })
    ]
  }
};
