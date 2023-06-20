//This script logs the user in client side with Firebase
import React, { useContext, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const auth = getAuth();
  const handleEmail = (emailEntered) => {
    setEmail(emailEntered);
  };
  const handlePassword = (passEntered) => {
    setPassword(passEntered);
  };
  const handlePress = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      alert("You are logged in!");
      navigation.push("Welcome");
    } catch (error) {
      alert(error.message);
    }
  };
  if (isLoggedIn) {
    navigation.push("Welcome");
  }
  const forgotPassword = () => {
    navigation.push("Forgot");
  };

  const URI = "../assets/mountainBackground.jpg";

  return (
    <ImageBackground source={require(URI)} style={{ height: "100%" }}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={handleEmail}
          placeholder="Email"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={handlePassword}
          placeholder="Password"
        />
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.txt}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={forgotPassword} style={styles.forgotButton}>
          <Text style={styles.txt}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    padding: 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    marginRight: 8,
    padding: 3,
  },
  goal: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#f38375",
    padding: 10,
    width: "70%",
    borderRadius: 50,
    marginBottom: 5,
    marginTop: 10,
  },
  forgotButton: {
    alignItems: "center",
    backgroundColor: "#f7a399",
    textColor: "white",
    padding: 10,
    width: "60%",
    borderRadius: 50,
  },
  container: {
    marginTop: "30%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#ffe3e0",
    minHeight: "50%",
    marginLeft: "10%",
    marginRight: "10%",
    backgroundColor: "rgba(255, 227, 224, .3)",
  },
  txt: {
    color: "white",
    fontFamily: "InterBlack",
  },
  image: {
    flex: 1,
  },
});
