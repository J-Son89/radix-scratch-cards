import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import {
  RadixDappToolkit,
  DataRequestBuilder,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
import { InstantiatePage } from "./pages/InstantiatePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AppStateProvider } from "./appState"

// ************ Connect to the Radix network ************
// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/dapp-metadata
// then use that account for your dAppDefinitionAddress
const dAppDefinitionAddress =
  "account_tdx_2_129veu2mmz00sea702ku0vgttd52x34m39dz0ldvs5h0lksask44t6t";
// Instantiate DappToolkit to connect to the Radix network and wallet
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppDefinitionAddress,
  networkId: RadixNetwork.Stokenet,
  applicationName: "RadixScratchDevDemo",
  applicationVersion: "1.1.0",
});

// "ET failed to generate TX review: Failed to retrive TX receipt from gateway:
// SystemError(AuthTemplateDoesNotExist(CanonicalBlueprintId
// { address: PackageAddress(0d9e38e82e662fe83e1449cbbda14d60f974332839b78518915097ca05f2), 
// blueprint: "GumballMachine", version: BlueprintVersion 
// { major: 1, minor: 0, patch: 0 } }))"

const xrdAddress =
  "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc"; //Stokenet XRD resource address





// ************ Fetch and update displayed component state ************
// async function fetchAndShowGumballMachineState() {
//   // Use Gateway API to fetch component details
//   if (componentAddress) {
//     const componentDetails =
//       await rdt.gatewayApi.state.getEntityDetailsVaultAggregated(
//         componentAddress
//       );
//     console.log("Component Details:", componentDetails);

//     // Get the price, number of gumballs, and earnings from the component state
//     const price = componentDetails.details.state.fields.find(
//       (field) => field.field_name === "price"
//     )?.value;
//     const numOfGumballs = componentDetails.fungible_resources.items.find(
//       (item) => item.resource_address === gumballResourceAddress
//     )?.vaults.items[0].amount;
//     const earnings = componentDetails.fungible_resources.items.find(
//       (item) => item.resource_address === xrdAddress
//     )?.vaults.items[0].amount;

//     // Show the values on the page
//     document.getElementById("numOfGumballs").innerText = numOfGumballs;
//     document.getElementById("price").innerText = price;
//     document.getElementById("earnings").innerText = earnings + " XRD";
//   }
// }

const componentAddressGlobal = "resource_tdx_2_1ntlevdappphsx3du34tg65mpglgzgl76xkpcgnaeg7ylr5k59e0pyw"
const ownerBadgeAddressGlobal = "consensusmanager_tdx_2_1scxxxxxxxxxxcnsmgrxxxxxxxxx000999665565xxxxxxxxxv6cg29"
const adminResourceAddressGlobal = "account_tdx_2_129veu2mmz00sea702ku0vgttd52x34m39dz0ldvs5h0lksask44t6t"

function App() {
  const [state, setState] = useState({
    componentAddress: componentAddressGlobal,
    ownerBadgeAddress: ownerBadgeAddressGlobal,
    adminResourceAddress: adminResourceAddressGlobal // TO persist from DB

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
        account: walletData.accounts[0],
        rdt,
        setState
      }))
    })
  },
    [])

  return (
    <AppStateProvider value={state}>
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route path="instantiatePage" element={<InstantiatePage />} />

          </Routes>
          <Footer />
        </Router>



      </div>
    </AppStateProvider>
  );
}

export default App;
