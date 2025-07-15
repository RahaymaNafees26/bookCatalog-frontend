// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import Toast from "react-native-toast-message";
// import React from "react";
// import { useColorScheme } from "@/hooks/useColorScheme";

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen name="login" options={{ headerShown: false }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <Toast />
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }


import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack} from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import React from "react";
import {Text,View} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import useAuth from '../hooks/useAuth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { loading, isAuthenticated } = useAuth();

  if (!loaded) {
    return null;
  }
  if (loading) {
     return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Loading...</Text>
    </View>
  );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ?(
          <>
          {/* Private part of the app */}
          <Stack.Screen name="(tabs)"  />
          <Stack.Screen name="saved" />
          <Stack.Screen name="update" />
          <Stack.Screen name="bookInfo" />
          <Stack.Screen name="createBook" />
          </>
        ):(
             <>
          {/* Public part of the app */}
          <Stack.Screen name="index" /> 
          <Stack.Screen name="login" />
        </>
        )}
      </Stack>
      <Toast />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
