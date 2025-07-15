import { Tabs } from "expo-router";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarIcon: ({ color, size }) => {
           switch (route.name) {
            case "home":
              return <Ionicons name="home" size={size} color={color} />;
            case "profile":
              return <FontAwesome name="user" size={size} color={color} />;
            case "myCollection":
              return (
                <MaterialCommunityIcons
                  name="bookshelf"
                  size={size}
                  color={color}
                />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="myCollection" options={{ title: "My Collection" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
