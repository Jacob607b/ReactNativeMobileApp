import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";

export default function Home({ navigation }) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigateToLogin = () => {
    navigation.push("Login");
  };
  const navigateToSignUp = () => {
    navigation.push("AccountCode");
  };

  const navigateToWelcome = () => {
    navigation.push("Welcome");
  };
  //FONTS LOADED IS BREAKING UNIT TEST
  const fontsLoaded = Font.useFonts({
    InterBlack: require("../assets/fonts/Inter-Black.ttf"),
    Roboto: require("../assets/fonts/Roboto-Black.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  const URI = "../assets/mountainBackground.jpg";

  let screen = (
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
            <TouchableOpacity testID="signUpBtn" onPress={navigateToSignUp}>
              <Text style={styles.txt}>
                {" "}
                <Button mode="contained-tonal" icon="account">
                  Login
                </Button>
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ImageBackground>
  );

  if (isLoggedIn) {
    screen = (
      <ImageBackground source={require(URI)} style={{ height: "100%" }}>
        <Card style={styles.container}>
          <TouchableOpacity
            testID="SelectPropBtn"
            style={styles.button}
            onPress={navigateToWelcome}
          >
            <Text style={styles.txt}>Data Entry Page</Text>
          </TouchableOpacity>
        </Card>
      </ImageBackground>
    );
  }
  return <>{screen}</>;
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#f38375",
    padding: 10,
    width: "70%",
    borderRadius: 50,
    marginBottom: 5,
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
  txt: {
    color: "white",
    fontFamily: "InterBlack",
  },
  image: {
    flex: 1,
  },
});
// Color Palette, dark -> light
// ef6351, f38375, f7a399, fbc3bc, ffe3e0
