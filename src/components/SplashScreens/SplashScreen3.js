import React from "react";
import OnboardingSlide from "./OnboardingSlide";

const SplashScreen3 = ({ onNext, onSkip }) => (
  <OnboardingSlide
    image={require("../../../assets/splash222.jpg")}
    eyebrow="Explore"
    title="Premium Sanitary Products"
    description="Browse taps, showers, bathroom fittings, pipes, kitchen accessories, and much more — all from top trusted brands."
    ctaLabel="Next"
    step={2}
    total={4}
    onNext={onNext}
    onSkip={onSkip}
  />
);

export default SplashScreen3;
