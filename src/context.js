import { createContext, useState, useCallback } from "react";
import Web3 from "web3";
// import { v4 } from "uuid";

export const WalletContext = createContext({
  web3: null,
  account: "",
  swapperAddr: "",
  tokenNTAddr: "",
  tokenSTAddr: "",
  login: () => {},
  logout: () => {},
});

export const WalletContextProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [swapperAddr] = useState("0xdb01b5f4D70d58EA00DD66a8F6d532E2b45852F7");
  const [tokenNTAddr] = useState("0x1781EFc998AFE084c8277dE9914372d57b767830");
  const [tokenSTAddr] = useState("0xE3eB905a952b1A3Bd845604b8F5e7c424be9bdC2");

  const login = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      return console.log("web3 not installed");
    }

    const web3 = new Web3(window.ethereum);
    setWeb3(web3);

    const [account] = await web3.eth.requestAccounts();
    setAccount(account);
  }, []);

  const logout = () => {
    if (!web3) {
      return console.log(`there isn't login info`);
    }

    setWeb3(null);
  };

  return (
    <WalletContext.Provider
      value={{
        web3,
        account,
        login,
        logout,
        swapperAddr,
        tokenNTAddr,
        tokenSTAddr,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
