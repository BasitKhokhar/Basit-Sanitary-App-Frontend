import 'dotenv/config';

export default () => ({
  expo: {
    name: "Basit Sanitary App",
    slug: "basit-sanitary-app",
    owner: "basitkhokhar4949",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon2.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/icons.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      package: "com.basitkhokhar.sanitaryapp",
      adaptiveIcon: {
        foregroundImage: "./assets/iconss.png",
      }
    },
    web: {
      favicon: "./assets/icon2.png"
    },
    plugins: [
      "expo-secure-store",
    ],
    extra: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      API_BASE_URL: process.env.API_BASE_URL,
      eas: {
        projectId: "00419d90-2f51-4972-b963-c5d1daad4b19" 
      },

    }
  }
});
