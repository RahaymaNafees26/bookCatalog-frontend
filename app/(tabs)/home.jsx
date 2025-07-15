import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function getBook() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("newest");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [showGenreOptions, setShowGenreOptions] = useState(false);
  const [showYearOptions, setShowYearOptions] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const genreOptions = [
    "Thriller",
    "Romance",
    "Fantasy",
    "Philosophical Fiction",
    "Mystery",
    "Drama",
  ];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) =>
    String(currentYear - i)
  );

  const getApiData = async (pageToFetch = 1, append = false) => {
    const token = await AsyncStorage.getItem("token");
    const url = "http://192.168.1.149:5000/books";
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: search,
          genre: selectedGenre,
          year: selectedYear,
          sort: filter,
          page: pageToFetch,
          limit: 5,
        },
      });
      const books = response.data?.books || [];
      if (append) {
        setData((prev) => { const ids = new Set(prev.map((b) => b._id));
        const newBooks = books.filter((b) => !ids.has(b._id));
        return [...prev, ...newBooks];});
      } else {
        setData(books);
      }
      setHasMore(books.length === 5);
      console.log('Fetched page:', pageToFetch, 'Books:', books.map(b => b.title));

    } catch (err) {
      console.error("Error fetching data", err.response?.data || err.message);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(1);
      setHasMore(true);
      await getApiData(1,false);
    } finally {
      setRefreshing(false);
    }
  };
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await getApiData(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    getApiData(1, false);
  }, [search, filter, selectedGenre, selectedYear]);

  const renderBook = ({ item: book }) => (
    <Link href={{ pathname: "/bookInfo", params: { id: book._id } }} asChild>
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
        style={styles.searchBar}
        placeholder="Search by title or author"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setSortDropdownVisible(!sortDropdownVisible)}
          style={styles.dropdownButton}
        >
          <View style={styles.dropdownItemRow}>
            <Text style={styles.dropdownText}>Sort by</Text>
            <AntDesign
              name={sortDropdownVisible ? "caretup" : "caretdown"}
              size={14}
              color="black"
            />
          </View>
        </Pressable>

        <Link href="/createBook" asChild>
          <Pressable style={styles.addButton}>
            <Text style={styles.buttonText}>+ Add Book</Text>
          </Pressable>
        </Link>
      </View>

      {sortDropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            onPress={() => {
              setFilter("newest");
              setSelectedGenre(null);
              setSelectedYear(null);
              setSortDropdownVisible(false);
              setShowGenreOptions(false);
              setShowYearOptions(false);
            }}
          >
            <Text style={styles.dropdownItem}>Newest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFilter("alphabetical");
              setSelectedGenre(null);
              setSelectedYear(null);
              setSortDropdownVisible(false);
              setShowGenreOptions(false);
              setShowYearOptions(false);
            }}
          >
            <Text style={styles.dropdownItem}>A to Z</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowGenreOptions(!showGenreOptions);
              setShowYearOptions(false);
            }}
          >
            <View style={styles.dropdownItemRow}>
              <Text style={styles.dropdownItemText}>Genre</Text>
              <AntDesign
                name={showGenreOptions ? "caretup" : "caretdown"}
                size={14}
                color="black"
              />
            </View>
          </TouchableOpacity>
          {showGenreOptions &&
            genreOptions.map((genre) => (
              <TouchableOpacity
                key={genre}
                onPress={() => {
                  setSelectedGenre(genre);
                  setFilter(""); // clear other sort
                  setSortDropdownVisible(false);
                  setShowGenreOptions(false);
                }}
                style={styles.subItem}
              >
                <Text>{genre}</Text>
              </TouchableOpacity>
            ))}

          <TouchableOpacity
            onPress={() => {
              setShowYearOptions(!showYearOptions);
              setShowGenreOptions(false);
            }}
          >
            <View style={styles.dropdownItemRow}>
              <Text style={styles.dropdownItemText}>Year</Text>
              <AntDesign
                name={showYearOptions ? "caretup" : "caretdown"}
                size={14}
                color="black"
              />
            </View>
          </TouchableOpacity>
          {showYearOptions &&
            yearOptions.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => {
                  setSelectedYear(year);
                  setFilter(""); // clear other sort
                  setSortDropdownVisible(false);
                  setShowYearOptions(false);
                }}
                style={styles.subItem}
              >
                <Text>{year}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}

      {data.length ? (
        <FlatList
          data={data}
          renderItem={renderBook}
          keyExtractor={(book) => book._id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <Text style={{ textAlign: "center", margin: 10 }}>
                Loading more...
              </Text>
            ) : null
          }
        />
      ) : (
        <Text style={styles.noResult}>Oh darn! We don’t have that.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownButton: {
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 8,
  },
  dropdownText: {
    color: "black",
    fontWeight: "bold",
  },
  dropdownMenu: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    marginTop: 5,
    padding: 10,
  },
  dropdownItem: {
    paddingVertical: 6,
    fontWeight: "bold",
  },
  dropdownItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  dropdownItemText: {
    fontWeight: "bold",
  },
  subItem: {
    paddingLeft: 20,
    paddingVertical: 4,
  },
  addButton: {
    backgroundColor: "purple",
    padding: 6,
    borderRadius: 6,
    marginLeft: "auto",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
