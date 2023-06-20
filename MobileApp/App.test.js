jest.useFakeTimers();
//useFakeTimers must be called to kill date/time error in react-native
import React from "react";
import SubmitImage from "./components/SubmitImage";
import Confirmation from "./components/Confirmation";
import Welcome from "./components/Welcome";
import AccountCode from "./components/AccountCode";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ReadContext } from "./context/ReadContext";
import { ImageContext } from "./context/ImageContext";
import { Provider } from "react-native-paper";

describe("Login Page", () => {
  test("Does the account code form work", async () => {
    global.alert = jest.fn();
    const requestOptions = jest.fn();

    render(<AccountCode value={{ requestOptions }} />);

    const acccountCodeInput = screen.getByTestId("Account");
    const keyCodeInput = screen.getByTestId("key");
    const submitBtn = screen.getByTestId("Submit");

    fireEvent.changeText(acccountCodeInput, "0000022");
    fireEvent.changeText(keyCodeInput, "123");
    fireEvent.press(submitBtn);

    expect(global.fetch).toHaveBeenCalled();
  });

  test("Account # Null Alert", () => {
    global.alert = jest.fn();
    const id = "";
    render(<AccountCode value={{ id }} />);
    const submitBtn = screen.getByTestId("Submit");
    fireEvent.press(submitBtn);
    //Alert asking user to enter an account # is called
    expect(global.alert).toHaveBeenCalled();
  });
});

describe("Data Entry Page", () => {
  test("Welcome Page Inputs", async () => {
    const navigate = jest.fn();
    let setReadData = jest.fn();
    const neededInput = [];
    const read = [];
    const readData = [
      { neededInput: ["Electric"], addedField: [...neededInput], read },
    ];

    let screen;
    render(
      <ReadContext.Provider value={{ readData, setReadData }}>
        <Welcome navigation={{ navigate }} value={{ screen }} />
      </ReadContext.Provider>
    );
  });
});

describe("Image Submission Page", () => {
  test("Submit Image", () => {
    const navigate = jest.fn();
    const readData = {
      address: "Unit 1",
      addedField: [{ field: "Electric", read: "100" }],
    };
    const requestOptions = jest.fn();
    const Images = { ImageURL: ["image.source"] };
    const ImagePicker = jest.fn();
    const pickImage = jest.fn();
    render(
      <ReadContext.Provider value={{ readData, requestOptions }}>
        <ImageContext.Provider value={{ Images }}>
          <Provider>
            <SubmitImage
              navigation={{ navigate }}
              value={{ ImagePicker, pickImage }}
            />
          </Provider>
        </ImageContext.Provider>
      </ReadContext.Provider>
    );
  });
});

describe("Submission Confirmation Page", () => {
  test("Confirm page renders readData & Image context", async () => {
    jest.mock("@react-native-async-storage/async-storage", () =>
      require("@react-native-async-storage/async-storage/jest/async-storage-mock")
    );

    const readData = {
      address: "Unit 1",
      addedField: [{ field: "Electric", read: "100" }],
    };
    const Images = { ImageURL: ["image.source"] };

    const navigate = jest.fn();

    const requestOptions = jest.fn();
    render(
      <ReadContext.Provider value={{ readData, requestOptions }}>
        <ImageContext.Provider value={{ Images }}>
          <Confirmation navigation={{ navigate }} />
        </ImageContext.Provider>
      </ReadContext.Provider>
    );
  });
});
