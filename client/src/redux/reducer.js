import { combineReducers } from 'redux'
import { reducer as formReducer} from 'redux-form'
import authReducer, {  moduleName as authModule } from '../ducks/auth'


const createRootReducer = () => combineReducers({
    form: formReducer,
    [authModule]: authReducer
})

export default createRootReducer