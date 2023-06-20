import React, { useState, useContext } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { IDContext } from "../context/IDContext";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
export default function Signup({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  //bool-lean value for ID context
  const { ID, setID } = useContext(IDContext);
  //id state of value to be sent to server
  const [id, set_id] = useState("");

  //Sets value of Email After correct account ID is validated
  const handleEmail = (emailEntered) => {
    setEmail(emailEntered);
  };
  //Sets value of password after correct account ID is validated
  const handlePassword = (passEntered) => {
    setPassword(passEntered);
  };

  //Sign up button handler
  const handlePress = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const postOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account_ID: ID, email }),
      };
      fetch("http://10.0.2.2:5000/updateAccount", postOptions).then((res) => {
        alert("account added");
      });
      setIsLoggedIn(true);
      navigation.navigate("SelectProp");
    } catch (error) {
      setIsLoggedIn(false);
      alert(error.message);
    }
  };
  //Sets the account ID value as the value entered on the page
  const handleID = (idEntered) => {
    set_id(idEntered);
  };
  //Handle submit to validate the ID entered against the Hased values stored in MongoDB
  const handleIDSubmit = () => {
    //Sends AccountID entered to enpoint /Account_ID on the server as a post, body contains the account code
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account_ID: id }),
    };
    fetch("http://10.0.2.2:5000/Acccount_ID", fetchOptions).then(
      async (res) => {
        //If the status of the fetch response is OK, UI is updated with Registration form
        if (res.status == 200) {
          const test = await res.json();
          setID(test.id);
          alert("Success!");
        } else {
          setID(null);
          alert("Issue with entered Account ID");
        }
      }
    );
  };
  const URI = "../assets/mountainBackground.jpg";
  //Initalize Screen variable, to define UI of this page based on state of ID context
  let Screen;
  //If ID context == true
  if (ID) {
    Screen = (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={email}
          placeholder="Email"
          onChangeText={handleEmail}
        />
        <TextInput
          style={styles.textInput}
          value={password}
          placeholder="Password"
          onChangeText={handlePassword}
        />
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.txt}>Sign up</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    Screen = (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={id}
          onChangeText={handleID}
          placeholder="Enter Account ID"
        />
        <TouchableOpacity style={styles.button} onPress={handleIDSubmit}>
          <Text style={styles.txt}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ImageBackground source={require(URI)} style={{ height: "100%" }}>
        {Screen}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    marginRight: 8,
    padding: 3,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#f38375",
    padding: 10,
    width: "70%",
    borderRadius: 50,
    marginBottom: 5,
    marginTop: 5,
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
