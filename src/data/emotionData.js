// stores all of the mapping from emotion to gradient and phrases
// emotions: happy, sad, anger, fear, surprise, disgust, calm

// note: should i have the colors represent the emotion or should the colors be the opposite e.g. should stress be stressing colors or relaxing colors

// as expected the css default colors are so ugly, can i customize more????
const emotionData = {
  happy: {
    hexGradient: "radial-gradient(circle, #ffbd31 0%, #fed168 15%, #ffeebe 85%)",
    phrase: "yay! good vibes!"
  }, // good

  sad: {
    hexGradient: "radial-gradient(circle, #edd8ad 0%, #ebeded 15%, #c9def1 85%)",
    phrase: "what's up? everything okay?"
  },

  anger: {
    hexGradient: "radial-gradient(circle, #DC5E42 0%, #BF512A 15%, #9E1818 85%)",
    phrase: "WHY ARE WE CRASHING OUT?!"
  },

  fear: {
    hexGradient: "radial-gradient(circle, #EFDCDF 0%, #edbcdf 15%, #BEC3F0 85%)",
    phrase: "it's going to be okay! deep breaths"
  },

  surprise: {
    hexGradient: "radial-gradient(circle, #fca16d 0%, #fc6c8e 15%, #feb3ca 85%)",
    phrase: "WHAT HAPPENED I HAVE TO KNOW RN"
  },

  disgust: {
    hexGradient: "radial-gradient(circle, #f8caa9 0%, #698f44 15%, #AAD087 85%)",
    phrase: "gag me with a spoon"
  }, // good

  calm: {
    hexGradient: "radial-gradient(circle, #040d44 0%, #354a79 15%, #739ec1 85%)",
    phrase: "deep breaths"
  }, // good
  
  overstimulated: {
    hexGradient: "radial-gradient(circle, #7e4c07 0%, #a78353 15%, #e0d4c4 15%)",
    phrase: "take a break, you deserve it",
    },

    stress: {
      hexGradient: "radial-gradient(circle, #9aafcc 0%, #afc1d9 20%, #E6ECEF 80%)",
      phrase: "chill out, you got this"
    }

};

export default emotionData;