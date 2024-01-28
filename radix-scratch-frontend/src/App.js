import './App.css';
import { useEffect, useState } from 'react';
import {
  RadixDappToolkit,
  DataRequestBuilder,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
import { AdminPage } from "./pages/AdminPage";
import { SellerPage } from './pages/SellerPage';
import { Customer } from './pages/Customer';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AppStateProvider } from "./appState"
import Modal from 'react-modal';
Modal.setAppElement('#root');

// ************ Connect to the Radix network ************
// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/dapp-metadata
// then use that account for your dAppDefinitionAddress
const dAppDefinitionAddress = process.env.REACT_APP_DAPP_DEFINITION_ADDRESS;
const xrdAddress = process.env.REACT_APP_XRD_ADDRESS


const componentAddressGlobal = process.env.REACT_APP_COMPONENT_ADDRESS
const ownerBadgeAddressGlobal = process.env.REACT_APP_OWNER_BADGE_ADDRESS
const adminResourceAddressGlobal = process.env.REACT_APP_ADMIN_RESOURCE_ADDRESS_GLOBAL

const applicationName = process.env.REACT_APP_APPLICATION_NAME;
const applicationVersion = process.env.REACT_APP_APPLICATION_VERSION;
const nftAddress = process.env.REACT_APP_NFT_ADDRESS;
const packageAddress = process.env.REACT_APP_PACKAGE_ADDRESS;

const sellerId = process.env.REACT_APP_SELLER_ID;

// Instantiate DappToolkit to connect to the Radix network and wallet
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppDefinitionAddress,
  networkId: process.env.REACT_APP_MAINNET === "1" ? RadixNetwork.Mainnet : RadixNetwork.Stokenet,
  applicationName: applicationName,
  applicationVersion: applicationVersion,
});

function App() {
  const [state, setState] = useState({
    componentAddress: componentAddressGlobal,
    ownerBadgeAddress: ownerBadgeAddressGlobal,
    adminResourceAddress: adminResourceAddressGlobal, // TO persist from DB
  })

  useEffect(() => {
    // ************ Connect to wallet and display details ************
    rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
    // Subscribe to updates to the user's shared wallet data, then display the account name and address.
    rdt.walletApi.walletData$.subscribe((walletData) => {
      console.log("connected wallet data: ", walletData);
      // Set the account variable to the first and only connected account from the wallet

      setState((prev) => ({
        ...prev,
        walletData,
        account: walletData.accounts[0],
        rdt,
        nftAddress: nftAddress,
        packageAddress: packageAddress,
        xrdResource: xrdAddress,
        sellerId,
        usersCards: {}
      }))
    })
  }, [])

  return (
    <AppStateProvider value={[state, setState]}>
      <div className="App">
        <Router>
          <Header />
          <div className="pageContainer">

            <Routes>
              <Route path="" element={<Customer />} />
              <Route path="adminPage" element={<AdminPage />} />
              <Route path="sellerPage" element={<SellerPage />} />
            </Routes>
          </div>
          <Footer />
        </Router>



      </div>
    </AppStateProvider>
  );
}

export default App;
