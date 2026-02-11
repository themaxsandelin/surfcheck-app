module.exports = ({ config }) => {
  const fullConfig = {
    ...config,
    extra: {
      ...config.extra,
      apiKey: process.env.EXPO_BUILD_API_KEY
    }
  };

  return {
    ...fullConfig,
  };
};