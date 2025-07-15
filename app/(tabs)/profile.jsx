import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function Profile() {
  const [name, setName] = useState("");
  const [bookCount, setBookCount] = useState(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { refresh } = useAuth(); 

  useEffect(() => {
    const loadUser = async () => {
      const storedName = await AsyncStorage.getItem("loggedInUser");
      if (storedName) setName(storedName);
    };
    loadUser();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      const response = await axios.get("http://192.168.1.149:5000/books", {
        headers: { Authorization: `Bearer ${token}` },
        params: { createdBy: userId }
      });
        setBookCount(response.data.books.length);
    } catch (err) {
      console.error("Error fetching books:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchMyBooks();
    }
  }, [isFocused]);

  // const handleLogout = async () => {
  //   await AsyncStorage.multiRemove([
  //     "token",
  //     "loggedInUser",
  //     "userId",
  //     "userEmail",
  //   ]);
  //   router.replace("/login");
  // };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "token",
      "loggedInUser",
      "userId",
      "userEmail",
    ]);
    await refresh();
    router.replace("/login");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.heading}>My Profile</Text>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{name}</Text>
      <Text style={styles.label}>Books added by me:</Text>
      <Text style={styles.value}>{bookCount}</Text>
      <Link href="/saved" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Saved Collection</Text>
        </Pressable>
      </Link>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, color: "#555", textTransform: "uppercase" },
  value: { fontSize: 18, marginBottom: 20, textTransform: "uppercase" },
  button: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { fontWeight: "bold", color: "#333" },
  logoutButton: {
    backgroundColor: "#b00020",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
export const options = {
  headerShown: false,
};
