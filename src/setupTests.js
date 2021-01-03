/** @format */

const localStorageMock = {
  getItem: (keyword) => {
    return keyword;
  },
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

global.window.require = function () {
  return {
    ipcRenderer: {
      send: jest.fn(),
      on: jest.fn(),
      removeAllListeners: jest.fn(),
    },
    remote: {
      dialog: jest.fn(),
    },
  };
};

global.window.alert = function () {};
