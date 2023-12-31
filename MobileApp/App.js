import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";
import { PaperProvider } from "react-native-paper";
import { DarkTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AccountCodeLogin from "./components/AccountCode";
import Welcome from "./components/Welcome";
import SubmitImage from "./components/SubmitImage";
import Confirmation from "./components/Confirmation";
import NavbarLogo from "./assets/NavbarLogo";

import { AuthContext } from "./context/AuthContext";
import { ImageContext } from "./context/ImageContext";
import { IDContext } from "./context/IDContext";
import { ReadContext } from "./context/ReadContext";

export default function App() {

  const Stack = createNativeStackNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ID, setID] = useState(false);
  const [readData, setReadData] = useState([]);
  const [Images, setImages] = useState([]);

  //=== Init stack, this changes based on if the user is logged in or not ===
  let stack;

  //========= isLoggedIn = true when Firebase user successfully logs in  ===========

  if (isLoggedIn) {
    stack = (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#fff" },
            headerTitle: () => <NavbarLogo style={{ height: 5 }} />,
            headerTitleAlign: "center",
            headerBackVisible: false,
          }}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen
            name="SubmitImage"
            component={SubmitImage}
            options={{ headerBackVisible: false }}
          />
          <Stack.Screen name="Confirmation" component={Confirmation} />
        </Stack.Navigator>
      </NavigationContainer>
    );
    //====== If user is not Logged in the only page in the stack is where the Login page that contacts the node server with the firebase admin sdk ======
  } else {
    stack = (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#fff" },
            headerTitle: () => <NavbarLogo style={{ height: 5 }} />,
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen name="AccountCode" component={AccountCodeLogin} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // ========= Stack returned with context ============

  return (
    <>
      <IDContext.Provider value={{ ID, setID }}>
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          <ReadContext.Provider value={{ readData, setReadData }}>
            <ImageContext.Provider value={{ Images, setImages }}>
              <PaperProvider theme={DarkTheme}>{stack}</PaperProvider>
            </ImageContext.Provider>
          </ReadContext.Provider>
        </AuthContext.Provider>
      </IDContext.Provider>
    </>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});
