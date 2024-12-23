import { Provider } from "react-redux";
import { MenuConfigurationPage } from "./components/pages/MenuConfigurationPage";
import menuData from "./sample.json";
import { store } from "./store/store";

export default function App() {
  return (
    <Provider store={store}>
      <MenuConfigurationPage data={menuData} />
    </Provider>
  );
}