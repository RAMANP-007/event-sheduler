const findWeatherForEvent = (event, weatherData) => {
  const eventTime = new Date(event.date).getTime();
  // Find the closest forecast in the list
  const closestForecast = weatherData.list.reduce((prev, curr) => {
        // The new API provides date as a string 'YYYY-MM-DD HH:MM:SS'
    const currTime = new Date(curr.date).getTime();
    const prevTime = new Date(prev.date).getTime();
    return Math.abs(currTime - eventTime) < Math.abs(prevTime - eventTime) ? curr : prev;
  });
  return closestForecast;
};

const analyzeWeather = (weather) => {
    // The new API provides 'main' directly in the forecast object
  const condition = weather.main.toLowerCase();
  const riskyConditions = ['rain', 'snow', 'thunderstorm', 'squall'];

  if (riskyConditions.includes(condition)) {
    return {
      risky: true,
      recommendation: `Weather is ${condition}. Consider rescheduling or moving indoors.`,
    };
  }
  return { risky: false };
};

module.exports = { findWeatherForEvent, analyzeWeather };
