const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const parts = require('./webpack/parts');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


// Postcss
const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const flexibility = require('postcss-flexibility');
const sorting = require('postcss-sorting');
const color_rgba_fallback = require('postcss-color-rgba-fallback');
const opacity = require('postcss-opacity');
const pseudoelements = require('postcss-pseudoelements');
const will_change = require('postcss-will-change');
const cssnano = require('cssnano');


// Plugins - HMR
const hotModuleReplacement = new webpack.HotModuleReplacementPlugin();

// Plugins - Get html automatically
const htmlWebpack = new HtmlWebpackPlugin({
  template: 'index.html'
});

// Plugins - Automatically loaded modules. Module (value) is loaded when the identifier (key) is used as free constiable in a module. The identifier is filled with the exports of the loaded module.
const provide = new webpack.ProvidePlugin({
  '$': 'jquery',
  'jQuery': "jquery",
  "window.jQuery": "jquery"
});

// Plugins - Etract an extra css file from the JS bundle
const extractText = new ExtractTextPlugin(
  path.join('./[name].css'), {
    allChunks: true
  }
);





// Sass loader setting for css module:
const inline = 'style!css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass!sass-resources';
const extract = extractText.extract("style", "css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass!sass-resources");


const common = {
  context: path.join(__dirname, 'app'),
  entry: {
    app: ['./index.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/mfs/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', '/app/vendors'],
    alias: {
      materialize: path.resolve(__dirname, 'app/vendors/materialize/js/bin/materialize.js'),
      hammerjs: path.resolve(__dirname, 'app/vendors/materialize/js/hammer.min.js')
    },
  },
  profile: true,
  cache: true,
  module: {
    noParse: [],
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      exclude: /(node_modules|bower_components|vendors)/
    }, {
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: /estoolbox/
    }, {
      test: /\.json/,
      loader: 'json',
      exclude: /(node_modules|bower_components|vendor)/
    }, {
      test: /\.(ttf|otf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader?name=[path][name].[ext]'
    }, {
      test: /\.htaccess$/,
      loader: 'file-loader?name=[name].[ext]'
    },{
      test: /\.(jpg|JPG|png|gif)$/,
      loader: 'file-loader?name=[path][name].[ext]',
    }, {
      test: /\.hbs$/,
      loader: 'handlebars'
    }]
  },
  plugins: [
    htmlWebpack,
    provide
  ],
  postcss: [
    cssnext({
      browsers: [
        "Android >= 2.3",
        "BlackBerry >= 7",
        "Chrome >= 9",
        "Firefox >= 4",
        "Explorer >= 9",
        "iOS >= 5",
        "Opera >= 11",
        "Safari >= 5",
        "OperaMobile >= 11",
        "OperaMini >= 6",
        "ChromeAndroid >= 9",
        "FirefoxAndroid >= 4",
        "ExplorerMobile >= 9"
      ]
    }),
    cssnano({
      // 关闭cssnano的autoprefixer选项，不然会和前面的autoprefixer冲突
      autoprefixer: false,
      reduceIdents: false,
      zindex: false,
      discardUnused: false,
      mergeIdents: false
    }),
    flexibility,
    will_change,
    color_rgba_fallback,
    opacity,
    pseudoelements,
    sorting
  ]
};

let config;
switch(process.env.npm_lifecycle_event) {
  case 'build:prod':
    config = merge(
      common,
      parts.clean('dist'),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractSCSStoCSS(
        [/(node_modules|bower_components|vendors)/, path.resolve(__dirname, "app/scss/vendors"), path.resolve(__dirname, "app/vendors")],
        "include"
      ),
      parts.SCSStoCSSModule(
        [/node_modules/, path.resolve(__dirname, "app/scss/vendors"), path.resolve(__dirname, "app/vendors")],
        "exclude",
        [
          path.resolve(__dirname, "node_modules/compass-mixins/lib"),
          path.resolve(__dirname, "app/vendors/materialize/sass")
        ],
        false,
        [path.resolve(__dirname, "app/scss/main.scss")],
        false
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      // parts.eslint([/(node_modules|bower_components|vendors)/], "exclude"),
      parts.sassLint(),
      parts.optimize()
    );
    break;
  case "build:dev":
    config = merge(
      common,
      {
        devtool: 'inline-source-map'
      },
      parts.extractSCSStoCSS(
        [/(node_modules|bower_components|vendor)/],
        "exclude",
        [
          path.resolve(__dirname, "node_modules/compass-mixins/lib"),
          path.resolve(__dirname, "app/vendors/materialize/sass")
        ],
        false
      )
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'inline-source-map'
      },
      parts.extractSCSStoCSS(
        [/(node_modules|bower_components|vendors)/, path.resolve(__dirname, "app/scss/vendors"), path.resolve(__dirname, "app/vendors")],
        "include"
      ),
      parts.SCSStoCSSModule(
        [/node_modules/, path.resolve(__dirname, "app/scss/vendors"), path.resolve(__dirname, "app/vendors")],
        "exclude",
        [
          path.resolve(__dirname, "node_modules/compass-mixins/lib"),
          path.resolve(__dirname, "app/vendors/materialize/sass")
        ],
        false,
        [path.resolve(__dirname, "app/scss/main.scss")],
        true
      ),
      parts.devServer({
        // Customize host/port here if needed
        host: 'localhost',
        port: 8100
      })
    );
}


module.exports = config;
//
