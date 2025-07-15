import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { handleSuccess, handleError } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function BookDetails() {
  const router = useRouter();
  const { id, fromCollection, fromSaved } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  const getBookData = async () => {
    const token = await AsyncStorage.getItem("token");
    const loggedInUserId = await AsyncStorage.getItem("userId");
    const url = "https://book-catalog-backend-wine.vercel.app/books";
    try {
      const response = await axios.get(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setBook(response.data);
        console.log("book creator:", response.data.createdBy?._id);
        console.log("loggedInUserId:", loggedInUserId);
        if (
          response.data.createdBy?._id === loggedInUserId &&
          fromCollection === "true"
        ) {
          setIsCreator(true);
        }
      }
    } catch (err) {
      console.error("Error fetching data", err.response?.data || err.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel", // Will dismiss the alert
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const url = "https://book-catalog-backend-wine.vercel.app/books";
              await axios.delete(`${url}/${book._id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              router.push({ pathname: "/home", params: { refresh: true } });
            } catch (err) {
              console.error(
                "Error deleting book",
                err.response?.data || err.message
              );
            }
          },
        },
      ]
    );
  };

  // const handleSave = async () => {
  //   try {
  //     const existing = await AsyncStorage.getItem("savedBooks");
  //     let savedBooks = existing ? JSON.parse(existing) : [];

  //     const alreadySaved = savedBooks.find((b) => b._id === book._id);
  //     if (!alreadySaved) {
  //       savedBooks.push(book);
  //       await AsyncStorage.setItem("savedBooks", JSON.stringify(savedBooks));
  //       handleSuccess("Book added to saved collection!");
  //     } else {
  //       handleSuccess("This book is already saved.");
  //     }
  //   } catch (err) {
  //     console.error("Error saving book:", err);
  //     handleError("Failed to save book.");
  //   }
  // };
  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId"); // assuming you store logged-in user here
    if (!userId) {
      handleError("User not logged in");
      return;
    }
    const key = `savedBooks_${userId}`;

      const existing = await AsyncStorage.getItem(key);
      let savedBooks = existing ? JSON.parse(existing) : [];

      const alreadySaved = savedBooks.find((b) => b._id === book._id);
      if (!alreadySaved) {
        savedBooks.push(book);
        await AsyncStorage.setItem(key, JSON.stringify(savedBooks));
        handleSuccess("Book added to saved collection!");
      } else {
        handleSuccess("This book is already saved.");
      }
    } catch (err) {
      console.error("Error saving book:", err);
      handleError("Failed to save book.");
    }
  };

  useEffect(() => {
    getBookData();
  }, []);

  if (!book) return <Text style={{ padding: 10 }}>Loading...</Text>;

  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#fff"}}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={{position:"relative"}}>
        <Image
          source={{ uri: book.images }}
          style={styles.bookImage}
          resizeMode="contain"
        />
        {fromCollection !== "true" && fromSaved !== "true" && (
            <Pressable onPress={handleSave} style={styles.saveIcon}>
              <Ionicons name="bookmark-outline" size={28} color="#000" />
            </Pressable>
        )}
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Title:</Text>
      </View>
      <Text style={styles.value}>{book.title}</Text>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>Author:</Text>
      </View>
      <Text style={styles.value}>{book.author}</Text>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>Genre:</Text>
      </View>
      <Text style={styles.value}>{book.genre}</Text>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>Year of Publication:</Text>
      </View>
      <Text style={styles.value}>{book.year}</Text>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>Description:</Text>
      </View>
      <Text style={styles.value}>{book.description}</Text>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>Added By:</Text>
      </View>
      <Text style={styles.value}>
        {book.createdBy?.name} ({book.createdBy?.email})
      </Text>

      {isCreator && (
        <View style={styles.buttonRow}>
          <Link
            href={{ pathname: "/update", params: { id: book._id } }}
            asChild
          >
            <Pressable style={styles.updateButton}>
              <Text style={styles.buttonText}>Update</Text>
            </Pressable>
          </Link>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40, // Add some padding at the bottom
  },
  bookImage: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  saveIcon: {
    top: 10,
    position:'absolute',
    right:10,
    zIndex:1,
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    alignContent: "center",
  },
  value: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
    paddingLeft: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  updateButton: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#b00020",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  labelContainer: {
    backgroundColor: "#e6e0f8", // light purple
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
    justifyContent: "center",
  },
});

export const options = {
  headerShown: false,
};

