import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useContext } from "react";
import { ReadContext } from "../context/ReadContext";
import { IDContext } from "../context/IDContext";
import { ImageContext } from "../context/ImageContext";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { DataTable, Button } from "react-native-paper";
import uuid from "react-native-uuid";
import getUnixTime from "date-fns/getUnixTime";

export default function Confirmation({ navigation }) {
  const { readData, setReadData } = useContext(ReadContext);
  const { ID, setID } = useContext(IDContext);
  const { Images, setImages } = useContext(ImageContext);
  // const string = JSON.stringify(readData);

  // alert(string);
  const auth = getAuth();
  const user = auth.currentUser;
  const handleSubmit = async () => {
    const date = new Date();
    // const ISODate = serverTimestamp(date);
    const ISODate = date.toLocaleDateString();
    const UnixTime = getUnixTime(date);
    const FireStoreData = {
      Data: readData,
      Images,
      Date: ISODate,
      ID: ID,
      UnixTime,
    };

    const docRef = collection(db, "Reads");
    await addDoc(docRef, FireStoreData);
    await navigation.navigate("Welcome");
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>UNIT: {readData.address}</Text>
        <>
          {readData.addedField.map((added) => {
            return (
              <DataTable key={uuid.v4()}>
                <DataTable.Header style={styles.container} key={uuid.v4()}>
                  <View style={styles.inputContainer} key={uuid.v4()}>
                    <DataTable.Title key={uuid.v4()}>
                      Type: {added.field}
                    </DataTable.Title>
                    <Text key={uuid.v4()}>Read: {added.read}</Text>
                  </View>
                </DataTable.Header>
              </DataTable>
            );
          })}
        </>

        <View style={{ flexDirection: "row" }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            {Images.ImageURL.map((url) => {
              return (
                <Image
                  key={url}
                  source={{ uri: url }}
                  style={{ width: 100, height: 100, margin: 5 }}
                />
              );
            })}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={handleSubmit} testID="Confirm-Submission">
          <Text style={styles.txt}>
            <Button mode="contained">Submit</Button>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
// Style-sheet object
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "column",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    marginRight: 8,
    padding: 3,
    textAlign: "center",
    flexDirection: "row",
  },
  goal: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pages: {
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: "black",
    width: "100%",
    height: "200%",
  },
  map: {
    flex: 1,
    height: 200,
    width: "100%",
    marginBottom: 10,
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
  disabledButton: {
    alignItems: "center",
    backgroundColor: "#ef6351",
    padding: 10,
    width: "70%",
    borderRadius: 50,
    marginBottom: 5,
    marginTop: 5,
    opacity: 0.5,
  },
  txt: {
    color: "white",
  },
});
