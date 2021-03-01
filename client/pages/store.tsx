import { createStore } from "redux";
import reducer from "../src/redux";

import { persistStore } from "redux-persist";
export const store: any = createStore(reducer);
export const persistor: any = persistStore(store);
export default store;
