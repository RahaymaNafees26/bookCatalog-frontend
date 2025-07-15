import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyCollection() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const getMyBooks = async () => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    console.log("MyCollection userId:", userId);
    const url = "https://book-catalog-backend-wine.vercel.app/books";
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search,createdBy:userId},
      });
      if (response.data?.books?.length) {
          setData(response.data.books);
      }
      else {
        setData([]);
      }
    } catch (err) {
      console.error(
        "Error fetching my collection",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    getMyBooks();
  }, [search]);

  const renderBook = ({ item: book }) => (
    <Link
      href={{
        pathname: "/bookInfo",
        params: { id: book._id, fromCollection: "true" },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        <Image
          source={{ uri: book.images }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
      </Pressable>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Search your books..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />
      {data.length ? (
        <FlatList
          data={data}
          renderItem={renderBook}
          keyExtractor={(book) => book._id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noResult}>No books added by you.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 140,
    height: 180,
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  author: {
    fontSize: 14,
    color: "gray",
  },
  noResult: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "gray",
  },
});
export const options = {
  headerShown: false,
};
