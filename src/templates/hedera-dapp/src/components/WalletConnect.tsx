import { useHashConnect } from "../hooks/useHashConnect";

export function WalletConnect() {
  const { isConnected, connect, disconnect } = useHashConnect();

  return (
    <div style={{ margin: "1rem 0" }}>
      {isConnected ? (
        <button onClick={disconnect}>Disconnect Wallet</button>
      ) : (
        <button onClick={connect}>Connect HashPack</button>
      )}
    </div>
  );
}
