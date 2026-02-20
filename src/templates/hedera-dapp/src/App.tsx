import { WalletConnect } from "./components/WalletConnect";
import { AccountInfo } from "./components/AccountInfo";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <h1>{{projectNamePascal}}</h1>
      <p>A Hedera dApp powered by HashConnect</p>
      <WalletConnect />
      <AccountInfo />
    </div>
  );
}
