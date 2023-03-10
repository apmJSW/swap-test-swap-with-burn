import React from "react";
import styled from "styled-components";
import { Input, Button, Select } from "antd";
import { WalletContext } from "./context";

const SWAP_WITH_BURN = `swap with burn`;
const APPROVE = "approve";

const takeComma = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function Swapper({ swapper, tokenST, reload, setReload }) {
  const { account, swapperAddr, tokenNTAddr, tokenSTAddr } =
    React.useContext(WalletContext);
  const [amount, setAmount] = React.useState(0);
  const [allowance, setAllowance] = React.useState(0);
  const [type, setType] = React.useState(SWAP_WITH_BURN);
  const [loading, setLoading] = React.useState(false);

  const checkApprove = React.useCallback(async () => {
    if (!account) {
      return;
    }

    const _allowance = await tokenST.methods
      .allowance(account, swapperAddr)
      .call();

    setAllowance(+_allowance / 10 ** 18);
  }, [tokenST, account, swapperAddr]);

  React.useEffect(() => {
    if (!swapper || !tokenST) {
      return;
    }

    checkApprove();
  }, [swapper, tokenST, checkApprove, reload]);

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

  const handleChange = (value) => setType(value);

  const approve = async () => {
    if (!amount || !/^[0-9]+$/.test(amount)) {
      return;
    }

    try {
      setLoading(true);

      await tokenST.methods
        .approve(swapperAddr, String(amount * 10 ** 18))
        .send({ from: account });

      await checkApprove();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const swapWithBurn = async () => {
    if (!amount || !/^[0-9]+$/.test(amount)) {
      return;
    }

    try {
      setLoading(true);

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
        <Select
          size="large"
          style={{ width: "170px", marginRight: "10px", textAlign: "center" }}
          defaultValue={type}
          onChange={handleChange}
        >
          <Select.Option style={{ textAlign: "center" }} value={SWAP_WITH_BURN}>
            {SWAP_WITH_BURN}
          </Select.Option>
          <Select.Option style={{ textAlign: "center" }} value={APPROVE}>
            {APPROVE}
          </Select.Option>
        </Select>
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
          <div style={{ textAlign: "right", color: "grey", marginTop: "5px" }}>
            allowance: {takeComma(allowance)}
          </div>
        </div>
        <div style={{ margin: "0 15px", fontSize: "17px" }}>
          {!loading ? (
            <Button
              type="primary"
              size="large"
              style={{ width: "150px" }}
              onClick={type === APPROVE ? approve : swapWithBurn}
            >
              {type}
            </Button>
          ) : (
            "wait a moment please..."
          )}
        </div>
      </FlexWrapper>
    </Container>
  );
}

const Container = styled.div``;
const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export default Swapper;
