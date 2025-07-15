import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function updateItem() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImage] = useState("");

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      const url = "http://192.168.1.149:5000/books";
      const response = await axios.get(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOriginalData(response.data);
      setTitle(response.data.title);
      setAuthor(response.data.author);
      setYear(response.data.year);
      setGenre(response.data.genre);
      setImage(response.data.images);
      setDescription(response.data.description);
    };
    fetchData();
  }, [id]);

  const updateApiData = async () => {
    const token = await AsyncStorage.getItem("token");
    const url = "http://192.168.1.149:5000/books";
    const updateData = {
      title: title || originalData.title,
      author: author || originalData.author,
      genre: genre || originalData.genre,
      year: year || originalData.year,
      images: images || originalData.images,
      description: description || originalData.description,
    };
    try {
      await axios.put(`${url}/${id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      router.push({ pathname: "/bookInfo", params: {id, refresh: true ,fromCollection: "true" }});
    } catch (err) {
      console.error("Failed to update data", err.response?.data || err.message);
    }
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#fff"}}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Update Book</Text>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Update Title"
        />
        <Text style={styles.label}>Author</Text>
        <TextInput
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
          placeholder="Update Author"
        />
        <Text style={styles.label}>Genre</Text>
        <TextInput
          style={styles.input}
          value={genre}
          onChangeText={setGenre}
          placeholder="Update Genre"
        />
        <Text style={styles.label}>Year</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={year}
            onValueChange={(itemValue) => setYear(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Year" value="" />
            {Array.from({ length: 30 }, (_, i) => {
              const y = String(new Date().getFullYear() - i);
              return <Picker.Item label={y} value={y} key={y} />;
            })}
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Update Description"
          multiline
        />
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={images}
          onChangeText={setImage}
          placeholder="Update Image"
        />

        <Pressable style={styles.button} onPress={updateApiData}>
          <Text style={styles.buttonText}>Update Book</Text>
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
  button: {
    backgroundColor: "purple", //"#6c5ce7"
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
});
export const options = {
  headerShown: false,
};
