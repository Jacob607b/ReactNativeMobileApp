import { View, Text } from "react-native";
import { Modal, Portal, Button } from "react-native-paper";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function SuccessModal() {
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
  };
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();
  const navigateToConfirmation2 = () => {
    navigation.push("Confirmation");
    setVisible(false);
  };
  return (
    <View>
      <Portal>
        <Modal visible={visible} contentContainerStyle={containerStyle}>
          <Text>
            Success! Please go to the next page and confirm all the information
            you provided.
          </Text>
          <Text>
            {" "}
            <Button mode="contained" onPress={navigateToConfirmation2}>
              NEXT
            </Button>
          </Text>
        </Modal>
      </Portal>
    </View>
  );
}
