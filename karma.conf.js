module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'app/js/personal/*.js',
      'test/*.js'
    ],

    browsers: ['Chrome'],

    autoWatch: true
  });
};