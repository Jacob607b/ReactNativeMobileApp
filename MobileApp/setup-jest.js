//Jest mock setup file
import fetchMock from 'jest-fetch-mock'


jest.mock('expo-font');
jest.mock('expo-asset');
fetchMock.enableMocks()
global.fetch = require('jest-fetch-mock');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
