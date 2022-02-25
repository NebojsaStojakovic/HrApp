import {combineReducers} from "redux"
import user from "./userReducer"
import companies from "./companiesReducer"

export default combineReducers({user, companies})