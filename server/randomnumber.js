function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
  // from the MDN Wiki 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
module.exports = getRandomArbitrary