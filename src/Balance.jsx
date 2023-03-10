import React from "react";
import { WalletContext } from "./context";

const takeComma = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function Balance({ token, unit, reload }) {
  const { account } = React.useContext(WalletContext);
  const [balance, setBalance] = React.useState(null);

  const getBalance = React.useCallback(
    async (token) => {
      if (!account) {
        return;
      }

      const _balance = await token.methods.balanceOf(account).call();

      setBalance(_balance / 10 ** 18);
    },
    [account]
  );

  React.useEffect(() => {
    if (!token) {
      return;
    }

    getBalance(token);
  }, [token, getBalance, reload]);

  return (
    <div>
      {takeComma(balance || "")} {unit}
    </div>
  );
}

export default Balance;
