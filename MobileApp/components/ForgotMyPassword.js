// This Script allows a user to reset their firebase user password, an email is sent and handled through firebase
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ForgotMyPassword() {
  const [email, setEmail] = useState("");
  const auth = getAuth();
  const forgotPassword = async () => {
    await sendPasswordResetEmail(auth, email)
      .then(function (email) {
        alert("Please check your email...");
      })
      .catch(function (e) {
        alert(e.message);
      });
  };
  const emailtoSend = (emailEntered) => {
    setEmail(emailEntered);
  };

  const URI = "../assets/mountainBackground.jpg";

  return (
    <ImageBackground source={require(URI)} style={{ height: "100%" }}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={emailtoSend}
          placeholder="Email"
        />
        <TouchableOpacity onPress={forgotPassword} style={styles.button}>
          <Text style={styles.txt}>Send Email</Text>
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
