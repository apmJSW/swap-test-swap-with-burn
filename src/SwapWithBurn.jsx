import React from "react";
import styled from "styled-components";
import { Input, Button, Spin } from "antd";
import { WalletContext } from "./context";

const SWAP_WITH_BURN = `Swap With Burn`;

const takeComma = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function SwapWithBurn({ swapper, tokenST, reload, setReload }) {
  const { account, swapperAddr, tokenNTAddr, tokenSTAddr } =
    React.useContext(WalletContext);
  const [amount, setAmount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const handleCount = (e) => {
    let value = e.target.value.replace(/,/g, "");

    if (value === "") {
      return setAmount(0);
    }
    if (!/^[0-9]+$/.test(value)) {
      return;
    }
    if (value.charAt(0) === "0") {
      value = value.substring(1);
    }
    setAmount(+value);
  };

  const swapWithBurn = async () => {
    if (!amount || !/^[0-9]+$/.test(amount)) {
      return;
    }

    try {
      setLoading(true);

      await tokenST.methods
        .approve(swapperAddr, String(amount * 10 ** 18))
        .send({ from: account });

      await swapper.methods
        .swapWithBurn(tokenNTAddr, tokenSTAddr, String(amount * 10 ** 18))
        .send({ from: account });

      setReload((prev) => !prev);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FlexWrapper>
        <div>
          <Input
            style={{
              width: "200px",
              fontSize: "20px",
              textAlign: "right",
              paddingRight: "15px",
            }}
            name="swap"
            value={takeComma(amount)}
            onChange={handleCount}
          />
        </div>
        <div style={{ margin: "0 15px", fontSize: "17px" }}>
          <Button
            type="primary"
            disabled={loading}
            size="large"
            style={{ width: "150px" }}
            onClick={swapWithBurn}
          >
            {SWAP_WITH_BURN}
          </Button>
        </div>
      </FlexWrapper>
      {loading && (
        <FlexWrapper style={{ marginTop: "36px" }}>
          <Spin style={{ marginRight: "10px" }} />
          <span>wait a moment please...</span>
        </FlexWrapper>
      )}
    </Container>
  );
}

const Container = styled.div``;
const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default SwapWithBurn;
