import { useHashConnect } from "../hooks/useHashConnect";

export function AccountInfo() {
  const { isConnected, accountId } = useHashConnect();

  if (!isConnected) return null;

  return (
    <div style={{ margin: "1rem 0" }}>
      <p>Connected Account: <strong>{accountId}</strong></p>
    </div>
  );
}
