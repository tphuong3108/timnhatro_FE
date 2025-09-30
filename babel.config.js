module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      'expo-router/babel'
    ],
    plugins: [
      'nativewind/babel',
      'react-native-worklets/plugin'
    ]
  };
};
