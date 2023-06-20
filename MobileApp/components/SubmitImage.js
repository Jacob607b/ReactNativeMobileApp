import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import ModalInstructions from "./partials/ModalInstructions";
import SuccessModal from "./partials/SuccessModal";
import { IconButton, Button } from "react-native-paper";
import { ReadContext } from "../context/ReadContext";
import { ImageContext } from "../context/ImageContext";
import { IDContext } from "../context/IDContext";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { getAuth } from "firebase/auth";
import { Icon } from "react-native-elements";
import { PinchGestureHandler } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { el } from "date-fns/locale";

export default function SubmitImage({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const { ID, setID } = useContext(IDContext);
  const windowWidth = Dimensions.get("window").width;
  const { readData, setReadData } = useContext(ReadContext);
  const { Images, setImages } = useContext(ImageContext);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [isDisabled, setDisabled] = useState(true);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [zoom, setZoom] = useState(0);

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === "granted");

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log(imagePermission.status);

    setGalleryPermission(imagePermission.status === "granted");

    if (
      imagePermission.status !== "granted" &&
      cameraPermission.status !== "granted"
    ) {
      alert("Permission for media access needed.");
    }
  };
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });
  useEffect(() => {
    permisionFunction();
  }, []);

  const [image, setImage] = useState([]);
  const [fireURI, setURI] = useState([]);
  const [flash, setFlash] = useState(false);
  //Uploading hook for if image is submitted
  const [uploading, setUploading] = useState(false);
  const [uploadingToFirebase, setUploadingToFirebase] = useState(false);

  //Function runs when the submit button is pressed and an image is selected
  const pickImage = async () => {
    //Here the photo is saved to firebase when first selected and the download URL is sent to the server ...
    //if no there is no error.
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
        quality: 1,
      });
      //URI of the image picked is selected
      const source = result.assets[0].uri;
      //Sets Image to be displayed to the URI
      setImage([...image, source]);
      //Sets Is uploading is true
      setUploading(true);
    } catch (error) {
      alert("Please try again, no image selected");
      return;
    }
  };
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const openCamera = async () => {
    setIsCameraOpen(true);
  };
  const closeCamera = async () => {
    setIsCameraOpen(false);
  };
  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      const source = await data.uri;

      setImage([...image, source]);
      //Renders photo after
      setUploading(true);
      //Closes camera
      setIsCameraOpen(false);
      setZoom(0);
    }
  };

  const handleFirebaseURI = async () => {
    const ImageURL = [];
    if (ImageURL === []) {
      alert("no image to upload");
    }
    image.map(async (images) => {
      var metadata = {
        contentType: "image/jpeg",
      };

      const response = await fetch(images);
      const blob = await response.blob();
      const filename = await images.substring(images.lastIndexOf("/") + 1);
      //Reference to Firebase storage, folder created for each user email
      const imageRef = ref(storage, `${ID}/${filename}`);
      try {
        //Uploads Image to Firebase Storage
        const uploadTask = await uploadBytes(imageRef, blob, metadata);

        // Get the download URL and wait for its resolution
        const url = await getDownloadURL(uploadTask.ref);

        setURI([...fireURI, url]);
        setDisabled(false);
        ImageURL.push(url);
        setImages({ ImageURL });
        setUploadingToFirebase(true);
      } catch (error) {
        alert(error);
      }
    });
  };
  const deleteImage = (value) => {
    setImage((selected) => {
      return selected.filter((image) => image !== value);
    });
  };
  const handleFlash = () => {
    if (flash === false) {
      setFlash(true);
    } else {
      setFlash(false);
    }
  };

  const changeZoom = (event) => {
    if (event.nativeEvent.scale > 1 && zoom < 1) {
      setZoom(zoom + 0.001);
    }
    if (event.nativeEvent.scale < 1 && zoom > 0) {
      setZoom(zoom - 0.001);
    }
  };
  const goBack = () => {
    navigation.navigate("Welcome");
  };

  const [wantsPreview, setWantsPreview] = useState(false);

  const handleImgPreview = () => {
    if (wantsPreview === true) {
      setWantsPreview(false);
    } else {
      setWantsPreview(true);
    }
  };

  return (
    <>
      <View>
        <ModalInstructions />
        <ScrollView>
          {isCameraOpen ? (
            <View style={styles.container}>
              <View style={styles.cameraContainer}>
                <PinchGestureHandler
                  onGestureEvent={(event) => changeZoom(event)}
                >
                  <Camera
                    ref={(ref) => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={"1:1"}
                    flashMode={flash}
                    zoom={zoom}
                  >
                    {/* FLASH ICON TOGGLES FLASH WHEN PRESSED */}
                    <TouchableOpacity
                      onPress={handleFlash}
                      style={{ marginTop: 10 }}
                    >
                      <Text>
                        {flash ? (
                          <Icon name="flash-on" size={40} color="#fff" />
                        ) : (
                          <Icon name="flash-off" size={40} />
                        )}
                      </Text>
                    </TouchableOpacity>
                  </Camera>
                </PinchGestureHandler>
              </View>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <Text>
                  <Icon name="camera" size={40} />
                </Text>
              </TouchableOpacity>

              <Text>
                <Button onPress={closeCamera} mode="contained">
                  Close
                </Button>
              </Text>
            </View>
          ) : (
            <View style={styles.container}>
              <Text>{readData.address}</Text>
              {uploadingToFirebase ? (
                <SuccessModal />
              ) : (
                <Text style={styles.textInput}>
                  Please select or take all necessary photos before you press
                  "Submit Photos"{" "}
                </Text>
              )}

              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.txt}>
                  {" "}
                  <IconButton icon="image" size={100} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openCamera}>
                <Text style={styles.txt}>
                  {" "}
                  <IconButton icon="camera" size={100} />
                </Text>
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                {uploading
                  ? image.map((images) => {
                      return (
                        <View key={uuid.v4()} style={{ flexDirection: "row" }}>
                          {!uploadingToFirebase ? (
                            <Pressable
                              key={uuid.v4()}
                              onPress={() => deleteImage(images)}
                            >
                              <Icon key={uuid.v4()} name="cancel" />
                            </Pressable>
                          ) : null}
                          {!wantsPreview ? (
                            <Pressable onPress={handleImgPreview}>
                              <Image
                                key={uuid.v4()}
                                source={{ uri: images }}
                                style={{ width: 100, height: 100 }}
                              />
                            </Pressable>
                          ) : null}

                          {wantsPreview ? (
                            <Pressable onPress={handleImgPreview}>
                              <View
                                style={{
                                  flex: 1,
                                  alignContent: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Image
                                  source={{ uri: images }}
                                  style={{
                                    aspectRatio: 1,
                                    height: 400,
                                    width: 400,
                                  }}
                                />
                              </View>
                            </Pressable>
                          ) : null}
                          {uploadingToFirebase ? (
                            <Icon key={uuid.v4()} name="check" />
                          ) : null}
                        </View>
                      );
                    })
                  : null}
              </ScrollView>

              <Text style={styles.txt}>
                <Button mode="contained" onPress={handleFirebaseURI}>
                  Submit Photos
                </Button>
              </Text>

              <TouchableOpacity>
                <Text style={styles.txt}>
                  <Button mode="contained" onPress={goBack}>
                    Go Back
                  </Button>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
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
    textAlign: "center",
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
  captureButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: "center",
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

    marginBottom: 10,
  },

  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
