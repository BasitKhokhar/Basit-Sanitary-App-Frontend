// Safely load dotenv, even if it's not installed yet
try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not installed, skipping .env load');
}

export default () => ({
  expo: {
    name: "basitsanitary",
    slug: "basit-sanitary",
    owner: "basit5000",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon2.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/icons.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    scheme: "basitsanitaryapp",

    android: {
      package: "com.basitkhokhar.sanitaryapp",
      adaptiveIcon: {
        foregroundImage: "./assets/iconss.png"
      },
      // Inline map (react-native-maps) needs this. Set GOOGLE_MAPS_API_KEY in
      // .env, then run `npx expo prebuild` to inject it into AndroidManifest.
      // Until a key is set, ShopLocation shows an "open in Maps" fallback.
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },

    web: {
      favicon: "./assets/icon2.png"
    },

    plugins: [
      "expo-secure-store",
      "expo-web-browser",
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "merchant.com.basitsanitary",
          "enableGooglePay": true
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            kotlinVersion: "2.0.20",
            newArchEnabled: true
          },
          ios: {
            newArchEnabled: true
          }
        }
      ]
    ],

    extra: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      API_BASE_URL: process.env.API_BASE_URL,
      EXPO_CLIENT_ID: process.env.EXPO_CLIENT_ID,
      ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      // IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
      eas: { projectId: process.env.EXPO_PROJECT_ID }
    }
  }
});
