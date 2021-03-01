import commonReducer from "./reducers/reducer"
import cardManagmentReducer from "./SmartFleet/SFCardManagement/CardManagementReducer"
import { combineReducers } from "redux"
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key:"root",
  storage,
  // whitelist: ["ASSIGN_PASSWORD","USER_TOKEN", "SERVER_TOKEN"]
}
const combinedReducers = combineReducers({
    commonReducer, cardManagmentReducer
})

export default persistReducer(persistConfig,commonReducer);