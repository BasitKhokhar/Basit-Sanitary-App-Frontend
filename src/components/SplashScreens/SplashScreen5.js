import React from "react";
import OnboardingSlide from "./OnboardingSlide";

const SplashScreen5 = ({ onNext }) => (
  <OnboardingSlide
    image={require("../../../assets/splash4.jpg")}
    eyebrow="Get Started"
    title="Join Us for a Better Sanitary Experience"
    description="Create an account to explore our wide range of high-quality sanitary products. Sign up now for an enhanced shopping experience!"
    ctaLabel="Let's Get Started"
    step={4}
    total={4}
    isLast
    onNext={onNext}
  />
);

export default SplashScreen5;
