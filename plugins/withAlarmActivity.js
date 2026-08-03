const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

module.exports = function withAlarmActivity(config) {
  return withAndroidManifest(config, (config) => {
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(config.modResults);
    mainActivity.$ = mainActivity.$ || {};
    mainActivity.$['android:showWhenLocked'] = 'true';
    mainActivity.$['android:turnScreenOn'] = 'true';
    return config;
  });
};
