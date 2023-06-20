import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import * as Location from "expo-location";
import uuid from "react-native-uuid";
import { AuthContext } from "../context/AuthContext";
import { ReadContext } from "../context/ReadContext";
import { IDContext } from "../context/IDContext";
import SelectDropdown from "react-native-select-dropdown";
import { Motion } from "framer-motion";
import { Icon } from "react-native-elements";

export default function Welcome({ navigation }) {
  const { readData, setReadData } = useContext(ReadContext);
  const { ID, setID } = useContext(IDContext);
  // initialize mapStartingPlace
  let mapStartingPlace;
  // Hook to set location, error message if found, and isLoaded to lazy load map comonent if needed
  const [local, setLocation] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    //Device location is set if User allows it
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        alert(errorMsg);
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setIsLoaded(true);
      mapStartingPlace = {
        lat: location.coords.latitude,
        long: location.coords.longitude,
      };
    };
    getLocation();
    setReadData([]);
  }, []);

  //AUTH Firebase User
  const auth = getAuth();
  const user = auth.currentUser;
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [address, setAddress] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");

  //User Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth, user);

      setIsLoggedIn(false);
      setID(null);
      navigation.navigate("AccountCode");
    } catch (error) {
      alert(error.message);
      console.log("This is the error:", error);
    }
  };
  //Button at bottom of page just to test if Server has no issues using Axios (This will be deleted)...
  // shows info from database in the server's terminal if all is good.

  const nagivateToSelectImage = async () => {
    await getLocation();
    await setReadData({
      ...readData,
      propertyAddress,
      address,
      addedField,
      local,
    });
    await navigation.navigate("SubmitImage");
    setNeededInput([]);
    setAddedField([]);
    setAddress();
  };
  //Device location is set if User allows it
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      alert(errorMsg);
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setIsLoaded(true);
    mapStartingPlace = {
      lat: location.coords.latitude,
      long: location.coords.longitude,
    };
  };
  //Needed inputs create TextInput with selected value; Add form fields if needed
  const [needsAnotherInput, setNeedsAnotherInput] = useState(false);
  //Sets the input type
  const [neededInput, setNeededInput] = useState([]);
  const types = ["Electric", "Gas", "Water"];
  //sets the addedField object to be sent to the Server
  const [addedField, setAddedField] = useState([]);
  //Creates needed input, and sets base value of addedField object
  const handleSelect = (type) => {
    setNeedsAnotherInput(true);
    // add ...neededInput, if you need mulitple fields
    setNeededInput([...neededInput, type]);
    setAddedField([...addedField, { field: type, read: null }]);
  };

  //Here is where the read gets added to the object addedField
  const handleAddedFields = (read, index) => {
    setAddedField((prev) =>
      prev.map((field, i) => {
        if (index === i) {
          return { ...field, read: read };
        }
        return field;
      })
    );
  };

  const resetForm = () => {
    setAddedField([]);
    setNeededInput([]);
    setPropertyAddress();
    setAddress();
  };

  //Ininalize screen, the UI of the Page
  let screen;

  //the location is stringifieds
  const StringLocal = JSON.stringify(local);
  screen = (
    <>
      <Card>
        <ScrollView style={{ width: "100%" }}>
          {errorMsg ? <Text>{errorMsg}</Text> : null}
          {/* <Text>{StringLocal}</Text> */}

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* When another input field is needed, the user selects a value from the dropdown menu 
      and the selected value becomes a TextInput with the placeholder being the selected value */}
            <TextInput
              testID="Property-Address"
              label="Property Address"
              value={propertyAddress}
              style={styles.textInput}
              onChangeText={(e) => setPropertyAddress(e)}
            />
            <TextInput
              testID="Street-Address"
              label="Street Address / Unit"
              value={address}
              style={styles.textInput}
              onChangeText={(e) => setAddress(e)}
            />
            {needsAnotherInput
              ? neededInput.map((needed, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Card.Title title={needed} style={styles.type} />
                      <TextInput
                        key={i}
                        name={needed}
                        onChangeText={(val) => handleAddedFields(val, i)}
                        style={styles.textInput}
                        keyboardType="numeric"
                        label={`${needed} Read`}
                      />
                    </React.Fragment>
                  );
                })
              : null}

            {/* Select Dropdown creates a new field for read entry types object is defiend above... */}
            <SelectDropdown
              data={types}
              onSelect={handleSelect}
              defaultButtonText="Select Utility"
              buttonTextAfterSelection={() => {
                return "Select Utility";
              }}
              style={styles.txt}
            />
            {needsAnotherInput ? (
              <Text style={styles.txt}>
                <Button
                  icon="refresh"
                  mode="contained-tonal"
                  onPress={resetForm}
                  compact={true}
                >
                  Reset
                </Button>
              </Text>
            ) : null}

            {/* Bottom of page */}

            <Text style={styles.txt}>
              <Button
                icon="account"
                mode="contained-tonal"
                onPress={handleSignOut}
                compact={true}
              >
                Sign Out
              </Button>
            </Text>

            <Text>
              <Button
                icon="arrow-right-bold"
                onPress={nagivateToSelectImage}
                mode="contained-tonal"
                compact={true}
              >
                Next
              </Button>
            </Text>
          </View>
        </ScrollView>
      </Card>
    </>
  );

  // UI (screen) is displayed
  return <>{screen}</>;
}
// Style-sheet object
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
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
  type: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    marginRight: 8,
    padding: 3,
    marginTop: 5,
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
  nextBtn: {
    alignItems: "center",
    backgroundColor: "#ef6351",
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

    marginBottom: 5,
  },
});

//IMPORTS FOR FIREBASE STORAGE FUNCTIONS, IMAGE PICKER AND MAPVIEW,
//NO LONGER NEEDED BUT KEPT HERE FOR A RAINY DAY
//CUSTOM ICON IS STORED HERE AS WELL
// import {storage} from '../firebase'
// import { async } from '@firebase/util';
// import { Icon } from 'react-native-elements'
// import MapView from 'react-native-maps';
// import { Marker }  from 'react-native-maps';
// import Svg, {Ellipse} from 'react-native-svg';
// import * as ImagePicker from 'expo-image-picker';
// import {
//   getDownloadURL,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";

//State for Mini-Map controlled by MAP Icon
// const [seeMap, setSeeMap] = useState(false);

{
  /* If the location is found isLoaded == true */
}
{
  /* A Mini-Map is shown with the devices current location as a Blue Dot on the map */
}
{
  /* { seeMap ? 
       <View>
          <MapView 
          style={styles.map} 
          mapPadding={{top:50,right:50,bottom:400,left:50}} 
          showsCompass={true} 
          initialRegion={{
            latitude: local.coords.latitude,
            longitude: local.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}> */
}
{
  /* <Marker 
              coordinate={{latitude: local.coords.latitude,
              longitude: local.coords.longitude}}
              title={"Current location"}
              description={"This is you!"} >
             
                <View>
                {(icon())}
                </View> 
            </Marker>  
          </MapView>
        </View> 
              : 
              
              null } */
}
// //Blue Current location icon created using react-native-svg
// const icon = () => {
//     return(
//       <Svg
//         height = {20}
//         width = {20}
//       >
//       <Ellipse
//         cx="10"
//         cy="10"
//         rx="10"
//         ry="10"
//         fill="blue"
//         stroke="#fff"
//         strokeWidth="2"
//       />
//       </Svg>
//       )
//   }

//---------EXAMPLE OF WHAT HEADERS TO SEND TO SEVER ON FETCH REQUEST FOR AUTH-----------
// const fetchAPI = async () =>{
//   const token = user && (await user.getIdToken());
//   Axios.get('http://10.0.2.2:5000/test',{
//     method:'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     }
//   }).then((res)=>{
//     console.log(res);
//   })
// }
