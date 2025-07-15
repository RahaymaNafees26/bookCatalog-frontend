import {useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { Picker } from "@react-native-picker/picker";
import { handleSuccess, handleError } from "@/utils";
import * as ImagePicker from "expo-image-picker";

export default function Create() {
  const [bookInfo, setBookInfo] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    description: "",
    images: "",
  });
   const [pickedImage,setPickedImage]=useState(null);
  const router = useRouter();
  const handleChange = (key, value) => {
    setBookInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
     
      if (!result.canceled) {
        handleChange("images", result.assets[0].uri);
        setPickedImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image", error.message);
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => `${currentYear - i}`);
  };
  const handlePost = async () => {
    const { title, author, year, genre,description, images } = bookInfo;
    if (!title || !author || !genre || !year || !description || !images) {
      return handleError("All fields are required");
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("genre", genre);
      formData.append("year", year);
      formData.append("description", description);
      formData.append("image", {
        uri: pickedImage.uri,
        type: pickedImage.mimeType|| pickedImage.type || "image/jpeg",
        name: pickedImage.fileName||"book.jpg",
      });
      const token = await AsyncStorage.getItem("token");
      const url = "https://book-catalog-backend-wine.vercel.app/books";

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
           'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        handleSuccess("Book Added!");
        router.push("/home");
      }
    } catch (err) {
       if (err.response) {
    console.error('Error response:', err.response.data);
  } else if (err.request) {
    console.error('Error request:', err.request);
  } else {
    console.error('Error message:', err.message);
  }
    }
  };
  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#fff"}}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Add New Book</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={bookInfo.title}
          onChangeText={(text) => handleChange("title", text)}
          placeholder="Enter Title"
        />

        <Text style={styles.label}>Author</Text>
        <TextInput
          style={styles.input}
          value={bookInfo.author}
          onChangeText={(text) => handleChange("author", text)}
          placeholder="Enter Author"
        />

        <Text style={styles.label}>Genre</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={bookInfo.genre}
            onValueChange={(value) => handleChange("genre", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Genre" value="" />
            {[
              "Thriller",
              "Romance",
              "Fantasy",
              "Philosophical Fiction",
              "Mystery",
              "Drama",
            ].map((g) => (
              <Picker.Item key={g} label={g} value={g} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Year of Publication</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={bookInfo.year}
            onValueChange={(value) => handleChange("year", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Year" value="" />
            {generateYears().map((y) => (
              <Picker.Item key={y} label={y} value={y} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={bookInfo.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholder="Enter Description"
        />

        <Text style={styles.label}>Cover Image</Text>
        <Pressable style={styles.imageButton} onPress={pickImage}>
          <Text>Select Cover Image</Text>
        </Pressable>
        {bookInfo.images ? (
          <Image
            source={{ uri: bookInfo.images }}
            style={{
              width: 160,
              height: 160,
              alignSelf: "center",
              marginVertical: 10,
            }}
          />
        ) : null}

        <Pressable style={styles.button} onPress={handlePost}>
          <Text style={styles.buttonText}>Save Book</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingBottom: 150,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    color: "#333",
  },
  label: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 16,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 6,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  imageButton: {
    backgroundColor: "#eee",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  button: {
    backgroundColor: "purple",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export const options = {
  headerShown: false,
};
