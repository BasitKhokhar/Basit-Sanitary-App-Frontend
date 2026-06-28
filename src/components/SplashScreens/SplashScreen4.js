import React from "react";
import OnboardingSlide from "./OnboardingSlide";

const SplashScreen4 = ({ onNext, onSkip }) => (
  <OnboardingSlide
    image={require("../../../assets/splash333.jpg")}
    eyebrow="Services"
    title="Expert Plumbing at Your Doorstep"
    description="Book skilled plumbers for installations, repairs, and maintenance. Fast service, trusted experts, and guaranteed quality work."
    ctaLabel="Next"
    step={3}
    total={4}
    onNext={onNext}
    onSkip={onSkip}
  />
);

export default SplashScreen4;
