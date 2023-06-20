import { View, Text } from "react-native";
import React, { useState } from "react";
import { Modal, Portal, Button } from "react-native-paper";

const ModalInstructions = () => {
  const [visible, setVisible] = useState(true);

  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text style={{ fontWeight: "bold" }}>
            Please select or take all necessary photos before you press "Submit
            Image"
          </Text>
          <Text>Click anywhere outside this box to dismiss</Text>
        </Modal>
      </Portal>
    </View>
  );
};

export default ModalInstructions;
