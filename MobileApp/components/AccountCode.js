import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useState, useContext } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { IDContext } from "../context/IDContext";
import { Button, Card, Text, TextInput } from "react-native-paper";


const AccountCode = ({ navigation }) => {
  const auth = getAuth();
  const [id, setId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [key, setKey] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { ID, setID } = useContext(IDContext);

  const handleAccountId = async (e) => {
    setId(e);
  };

  const handleKey = (e) => {
    setKey(e);
  };

  const contactServer = async () => {
    if (id === "") {
      alert("Please enter an account #");
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Id: id, Key: key }),
    };
    await fetch("http://10.0.2.2:5000/compareAccount", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.message === "Match Found") {
          signInAnonymously(auth)
            .then(() => {
              setErrorMsg("");
              alert("Successfully authenticated");
              setIsLoggedIn(true);
              setID(id);
              navigation.navigate("Welcome");
            })
            .catch((error) => {
              setErrorMsg("Entered Wrong Info");
              alert("Try again");
            });
        } else {
          alert("try Again");
        }
      });
  };

  const URI = "../assets/mountainBackground.jpg";

  return (
    <ImageBackground source={require(URI)} style={{ height: "100%" }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Card style={styles.card}>
          <View
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              label="Enter your Account ID"
              testID="Account"
              accessibilityLabel="Account-ID"
              style={styles.textInput}
              onChangeText={handleAccountId}
            />

            <TextInput
              label="Enter your Key"
              testID="key"
              style={styles.textInput}
              onChangeText={handleKey}
            />
            <TouchableOpacity testID="Submit" onPress={contactServer}>
              <Text style={styles.txt}>
                <Button icon="account" mode="contained-tonal">
                  Login
                </Button>
              </Text>
            </TouchableOpacity>
            <Text>{errorMsg}</Text>
          </View>
        </Card>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#f38375",
    padding: 10,
    width: "70%",
    borderRadius: 50,
    marginBottom: 5,
  },
  loginButton: {
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
    height: "50%",
    marginLeft: "10%",
    marginRight: "10%",
    backgroundColor: "rgba(255, 227, 224, .3)",
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    height: "50%",
    opacity: 0.8,
    justifyContent: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  txt: {
    color: "white",
  },
  image: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    marginRight: 8,
    padding: 3,
  },
});
// Color Palette, dark -> light
// ef6351, f38375, f7a399, fbc3bc, ffe3e0

export default AccountCode;
