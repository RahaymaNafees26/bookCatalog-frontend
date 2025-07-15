// app/saved.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { handleSuccess, handleError } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Saved() {
  const [savedBooks, setSavedBooks] = useState([]);
  const router = useRouter();

  // useEffect(() => {
  //   const loadSaved = async () => {
  //     const stored = await AsyncStorage.getItem("savedBooks");
  //     if (stored) setSavedBooks(JSON.parse(stored));
  //   };
  //   loadSaved();
  // }, []);
  useEffect(() => {
    const loadSaved = async () => {
       const userId = await AsyncStorage.getItem("userId");
    if (!userId) return; // user not logged in
    const key = `savedBooks_${userId}`;

      const stored = await AsyncStorage.getItem(key);
      if (stored) setSavedBooks(JSON.parse(stored));
      else setSavedBooks([]);
    };
    loadSaved();
  }, []);


  if (savedBooks.length === 0) {
   return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text style={{ padding: 20 }}>No saved books yet.</Text>
    </SafeAreaView>
  );
  }

  const handleUnsave = async (bookId) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;
    const key = `savedBooks_${userId}`;

      const existing = await AsyncStorage.getItem(key);
      let savedBooks = existing ? JSON.parse(existing) : [];

      const updatedBooks = savedBooks.filter((b) => b._id !== bookId);
      await AsyncStorage.setItem(key, JSON.stringify(updatedBooks));

      setSavedBooks(updatedBooks); 
      handleSuccess("Book removed from saved collection!");
    } catch (err) {
      console.error("Error unsaving book:", err);
      handleError("Failed to remove book.");
    }
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#fff"}}>
    <FlatList
      data={savedBooks}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/bookInfo",
              params: { id: item._id, fromSaved: "true" },
            })
          }
        >
          <Image source={{ uri: item.images }} style={styles.image} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </View>
          <Pressable
            onPress={() => handleUnsave(item._id)}
            style={styles.unsaveIcon}
          >
            <Ionicons name="bookmark" size={24} color="#000" />
          </Pressable>
        </Pressable>
      )}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: { width: 80, height: 80, resizeMode: "contain" },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  author: { marginLeft: 10, color: "#666" },
  unsaveIcon: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
export const options = {
  headerShown: false,
};

