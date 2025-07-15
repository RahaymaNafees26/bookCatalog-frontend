// import React from "react";
// import { useRouter } from "expo-router";
// import { handleSuccess, handleError } from "../utils";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useState } from "react";
// import { View, SafeAreaView,Pressable, Text, TextInput, StyleSheet } from "react-native";
// export default function login() {
//   const [loginInfo, setLoginInfo] = useState({
//     email: "",
//     password: "",
//   });
//   const router = useRouter();
//   const handleChange = (key, value) => {
//     setLoginInfo((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleLogin = async () => {
//     const { email, password } = loginInfo;
//     if (!email || !password) {
//       return handleError("email and password are required");
//     }
//     try {
//       const url = "http://192.168.110.5:5000/auth/login";
//       const response = await axios.post(url, loginInfo, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const result = response.data;
//       const { success, message,jwtToken,name,userId, error } = result;
//       if (success) {
//         handleSuccess(message);
//         await AsyncStorage.setItem("token", jwtToken);
//         await AsyncStorage.setItem("loggedInUser", name);
//         await AsyncStorage.setItem("userId", userId); 
//         console.log("stored JWT Token:", jwtToken);
//         console.log("Stored userId:", userId);
//         setTimeout(() => {
//           router.replace("/home");
//         }, 1000);
//       } else if (error) {
//         const details = error?.details?.[0]?.message;
//         handleError(details);
//       } else {
//         handleError(message);
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.error?.details?.[0]?.message ||
//         err.response?.data?.message ||
//         err.message;
//       handleError(errorMsg);
//     }
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.formBox}>
//         <Text style={styles.maintext}>Login</Text>
//         <View>
//           <Text style={styles.text}>Email</Text>
//           <TextInput
//             onChangeText={(text) => handleChange("email", text)}
//             style={styles.input}
//             value={loginInfo.email}
//             placeholder="Enter your Email"
//           />
//         </View>
//         <View>
//           <Text style={styles.text}>Password</Text>
//           <TextInput
//             onChangeText={(text) => handleChange("password", text)}
//             style={styles.input}
//             value={loginInfo.password}
//             placeholder="Enter Password:"
//             secureTextEntry={true}
//           />
//         </View>
//         <View>
//           <Pressable style={styles.button} onPress={handleLogin}>
//             <Text style={styles.buttonText}>Log In</Text>
//           </Pressable>
//         </View>
//         <View style={styles.linkContainer}>
//           <Text style={styles.linkText}>
//             Doesn't have an account?{" "}
//             <Text style={styles.loginLink} onPress={() => router.push("/")}>
//               Signup
//             </Text>
//           </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f2f2f2",
//   },
//   formBox: {
//     width: "80%",
//     height: "80%",
//     padding: 10,
//     backgroundColor: "white",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   maintext: {
//     fontSize: 25,
//     textAlign: "center",
//     fontWeight: "bold",
//     marginBottom: 18,
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 5,
//     paddingBottom: 8,
//     marginTop: 15,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 6,
//     fontSize: 16,
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: "purple",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 18,
//   },
//   linkContainer: {
//     marginTop: 15,
//     alignItems: "center",
//   },
//   linkText: {
//     fontSize: 14,
//     color: "#555",
//   },
//   loginLink: {
//     color: "blue",
//     fontWeight: "bold",
//     textDecorationLine: "underline",
//   },
// });

import React from "react";
import { useRouter,Redirect } from "expo-router";
import { handleSuccess, handleError } from "../utils";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { View, SafeAreaView,Pressable, Text, TextInput, StyleSheet } from "react-native";
export default function login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { loading, isAuthenticated, refresh } = useAuth();
  const handleChange = (key, value) => {
    setLoginInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("email and password are required");
    }
    try {  // "http://192.168.1.149:5000/auth/login"
      const url = "https://book-catalog-backend-wine.vercel.app/auth/login";
      const response = await axios.post(url, loginInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = response.data;
      const { success, message,jwtToken,name,userId, error } = result;
      if (success) {
        handleSuccess(message);
        await AsyncStorage.setItem("token", jwtToken);
        await AsyncStorage.setItem("loggedInUser", name);
        await AsyncStorage.setItem("userId", userId); 
        console.log("stored JWT Token:", jwtToken);
        console.log("Stored userId:", userId);
        await refresh();
        setTimeout(() => {
          router.replace("/home");
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.details?.[0]?.message ||
        err.response?.data?.message ||
        err.message;
      handleError(errorMsg);
    }
  };
  if (loading) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)/home" />;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.maintext}>Login</Text>
        <View>
          <Text style={styles.text}>Email</Text>
          <TextInput
            onChangeText={(text) => handleChange("email", text)}
            style={styles.input}
            value={loginInfo.email}
            placeholder="Enter your Email"
          />
        </View>
        <View>
          <Text style={styles.text}>Password</Text>
          <TextInput
            onChangeText={(text) => handleChange("password", text)}
            style={styles.input}
            value={loginInfo.password}
            placeholder="Enter Password:"
            secureTextEntry={true}
          />
        </View>
        <View>
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        </View>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Doesn't have an account?{" "}
            <Text style={styles.loginLink} onPress={() => router.push("/")}>
              Signup
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  formBox: {
    width: "80%",
    height: "80%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  maintext: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 18,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    paddingBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: "purple",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#555",
  },
  loginLink: {
    color: "blue",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
export const options = {
  headerShown: false,
};
