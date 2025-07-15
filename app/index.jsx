// import React from 'react';
// import { useRouter } from 'expo-router';
// import { handleSuccess, handleError } from '../utils';
// import axios from 'axios';
// import { useState } from 'react';
// import { View, Pressable, Text, TextInput, StyleSheet } from 'react-native';

// const App=()=>{
//   const [signupInfo,setSignupInfo]=useState({
//     name:'',
//     email:'',
//     password:''
//   })

//   const router=useRouter();

//   const handleChange=(key,value)=>{
//     setSignupInfo(prev=>({
//       ...prev,
//       [key]:value
//     }))
//   }

//   const handleSignup=async()=>{
//     const{name,email,password}=signupInfo
//     if(!name||!email||!password){
//       return handleError('name,email and password are required')
//     }

//     try{
//       const url='http://192.168.110.5:5000/auth/signup';

//       const response=await axios.post(url,signupInfo,{
//         headers:{
//            'Content-Type': 'application/json'
//         }
//       })
//       const result=response.data;
//       const{success,message,error}=result;
//       if(success){
//         handleSuccess(message);
//         setTimeout(()=>{
//           router.replace('/login');
//         }, 1000);
//         }
//       else if (error) {
//         const details = error?.details?.[0]?.message;
//         handleError(details);
//       }
//       else {
//         handleError(message);
//       }
//     }
//      catch (err) {
//       const errorMsg =
//         err.response?.data?.error?.details?.[0]?.message ||
//         err.response?.data?.message ||
//         err.message;
//       handleError(errorMsg);
//     }

//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.formBox}>
//         <Text style={styles.maintext}>Signup</Text>
//         <View>
//           <Text style={styles.text}>Name</Text>
//           <TextInput
//             onChangeText={(text) => handleChange('name', text)}
//             style={styles.input}
//             value={signupInfo.name}
//             placeholder='Enter your Name' />
//         </View>
//         <View>
//           <Text style={styles.text}>Email</Text>
//           <TextInput
//             onChangeText={(text) => handleChange('email', text)}
//             style={styles.input}
//             value={signupInfo.email}
//             placeholder='Enter your Email' />
//         </View>
//         <View>
//           <Text style={styles.text}>Password</Text>
//           <TextInput
//             onChangeText={(text) => handleChange('password', text)}
//             style={styles.input}
//             value={signupInfo.password}
//             placeholder='Enter Password:'
//             secureTextEntry={true} />
//         </View>
//         <View>
//           <Pressable style={styles.button} onPress={handleSignup}>
//             <Text style={styles.buttonText}>Sign Up</Text>
//           </Pressable>
//         </View>
//         <View style={styles.linkContainer}>
//           <Text style={styles.linkText}>
//             Already have an account?{' '}
//             <Text style={styles.loginLink} onPress={() => router.push('/login')}>
//               Login
//             </Text>
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f2f2f2',
//   },
//   formBox: {
//     width: '80%',
//     height: '80%',
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   maintext: {
//     fontSize: 25,
//     textAlign: 'center',
//     fontWeight: 'bold',
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
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 6,
//     fontSize: 16,
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: 'purple',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   linkContainer: {
//   marginTop: 15,
//   alignItems: 'center',
//   },
//   linkText: {
//   fontSize: 14,
//   color: '#555',
// },
//   loginLink: {
//   color: 'blue',
//   fontWeight: 'bold',
//   textDecorationLine: 'underline',
// },

// })

// export default App;

import React from "react";
import { useRouter, Redirect } from "expo-router";
import { handleSuccess, handleError } from "../utils";
import axios from "axios";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { View, Pressable, Text, TextInput, StyleSheet } from "react-native";

const App = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const handleChange = (key, value) => {
    setSignupInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignup = async () => {
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("name,email and password are required");
    }

    try {
      const url = "https://book-catalog-backend-wine.vercel.app/auth/signup";

      const response = await axios.post(url, signupInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = response.data;
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          router.replace("/login");
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
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.maintext}>Signup</Text>
        <View>
          <Text style={styles.text}>Name</Text>
          <TextInput
            onChangeText={(text) => handleChange("name", text)}
            style={styles.input}
            value={signupInfo.name}
            placeholder="Enter your Name"
          />
        </View>
        <View>
          <Text style={styles.text}>Email</Text>
          <TextInput
            onChangeText={(text) => handleChange("email", text)}
            style={styles.input}
            value={signupInfo.email}
            placeholder="Enter your Email"
          />
        </View>
        <View>
          <Text style={styles.text}>Password</Text>
          <TextInput
            onChangeText={(text) => handleChange("password", text)}
            style={styles.input}
            value={signupInfo.password}
            placeholder="Enter Password:"
            secureTextEntry={true}
          />
        </View>
        <View>
          <Pressable style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </View>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => router.push("/login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

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
    padding: 20,
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

export default App;
export const options = {
  headerShown: false,
};
