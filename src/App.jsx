import React from "react";
import styled from "styled-components";
import { Button, Tag } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { WalletContext } from "./context";
import Swapper from "./artifacts/Swapper.json";
import NantoToken from "./artifacts/NantoToken.json";
import SwapTestToken from "./artifacts/SwapTestToken.json";
import Balance from "./Balance";
import SwapWithBurn from "./SwapWithBurn";

function App() {
  const {
    web3,
    login,
    logout,
    account,
    swapperAddr,
    tokenNTAddr,
    tokenSTAddr,
  } = React.useContext(WalletContext);
  const [swapper, setSwapper] = React.useState(null);
  const [tokenNT, setTokenNT] = React.useState(null);
  const [tokenST, setTokenST] = React.useState(null);
  const [reload, setReload] = React.useState(false);

  const aaa = React.useCallback(async () => {
    const _swapper = new web3.eth.Contract(Swapper.abi, swapperAddr);
    const _tokenNT = new web3.eth.Contract(NantoToken.abi, tokenNTAddr);
    const _tokenST = new web3.eth.Contract(SwapTestToken.abi, tokenSTAddr);
    setSwapper(_swapper);
    setTokenNT(_tokenNT);
    setTokenST(_tokenST);
  }, [web3, swapperAddr, tokenNTAddr, tokenSTAddr]);

  React.useEffect(() => {
    if (!web3) {
      return;
    }
    aaa();
  }, [web3, aaa]);

  return (
    <Container style={{ marginTop: "100px" }}>
      <Header>
        {!web3 ? (
          <div>
            <Button type="primary" onClick={login}>
              지갑 연결
            </Button>
          </div>
        ) : (
          <AccountWrapper>
            <FlexWrapper>
              <Account>{account}</Account>
              <Logout>
                <Button onClick={logout}>지갑 연결 해제</Button>
              </Logout>
            </FlexWrapper>
          </AccountWrapper>
        )}
      </Header>
      {web3 && (
        <Body>
          <FlexWrapper
            style={{ justifyContent: "center", marginBottom: "16px" }}
          >
            <TagDiv color="green">
              <Balance token={tokenST} unit="ST" reload={reload} />
            </TagDiv>
            <div style={{ margin: "0 5px" }}>
              <ArrowRightOutlined />
            </div>
            <TagDiv color="red">
              <Balance token={tokenNT} unit="NT" reload={reload} />
            </TagDiv>
          </FlexWrapper>
          <SwapWithBurn
            swapper={swapper}
            tokenST={tokenST}
            reload={reload}
            setReload={setReload}
          />
        </Body>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const AccountWrapper = styled.div`
  padding: 20px 0;
  width: 540px;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
`;
const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
const Header = styled.div``;
const Body = styled.div`
  margin-top: 36px;
  width: 720px;
`;
const Account = styled.div`
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;

  font-size: 15px;
  font-weight: 700;
`;
const Logout = styled.div``;
const TagDiv = styled(Tag)`
  margin: 0 5px;
  padding: 5px 12px;
  font-size: 16px;
`;

export default App;
