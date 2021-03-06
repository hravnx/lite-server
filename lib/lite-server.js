var historyFallback = require('connect-history-api-fallback');
var log = require('connect-logger');
var yargs = require('yargs');
var sync = require('browser-sync').create();
var defaultOpenPath = '';

yargs.option('files', {
  describe: 'array of file paths to watch',
  type: 'array'
});

yargs.boolean('notify').default('notify', true);

var argv = yargs.argv;
var openPath = getOpenPath();
var options =
  {
    port: argv.port || 3000,
    openPath: openPath,
    files: argv.files ? argv.files : [
      openPath + '/**/*.html',
      openPath + '/**/*.css',
      openPath + '/**/*.js'
    ],
    baseDir: argv.baseDir || './',
    fallback: '/' + openPath + '/index.html'
  };

if (argv.verbose) {
  console.log('options', options);
}

function getOpenPath() {
  var src = argv.open || defaultOpenPath;
  if (!src) {
    return '.'
  }
  return src;
}

sync.init({
  server: {
    port: options.port,
    baseDir: options.baseDir,
    middleware: [
      log(),
      historyFallback({ index: options.fallback })
    ]
  },
  files: options.files,
  notify: argv.notify
});
