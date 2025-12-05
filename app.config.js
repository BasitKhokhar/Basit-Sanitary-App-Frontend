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

    scheme: "basitsanitaryapp",

    android: {
      package: "com.basitkhokhar.sanitaryapp",
      adaptiveIcon: {
        foregroundImage: "./assets/iconss.png"
      }
    },

    web: {
      favicon: "./assets/icon2.png"
    },

    plugins: [
      "expo-secure-store",

      // ✅ Kotlin version fix (required for your Gradle error)
      [
        "expo-build-properties",
        {
          android: {
            kotlinVersion: "2.0.20"
          }
        }
      ]
    ],

    extra: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      API_BASE_URL: process.env.API_BASE_URL,

      EXPO_CLIENT_ID: process.env.EXPO_CLIENT_ID,
      ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
      // IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,

      eas: {
        projectId: process.env.EXPO_PROJECT_ID
      }
    }
  }
});
