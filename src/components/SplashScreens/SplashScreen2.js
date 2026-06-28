import React from "react";
import OnboardingSlide from "./OnboardingSlide";

const SplashScreen2 = ({ onNext, onSkip }) => (
  <OnboardingSlide
    image={require("../../../assets/splash1.jpg")}
    eyebrow="Welcome"
    title="Your Trusted Sanitary Shopping Destination"
    description="Discover premium sanitary products and modern bathroom solutions — all in one easy-to-use shopping app."
    ctaLabel="Next"
    step={1}
    total={4}
    onNext={onNext}
    onSkip={onSkip}
  />
);

export default SplashScreen2;
