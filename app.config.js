module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      apiKey: process.env.EXPO_BUILD_API_KEY,
    }
  };
};