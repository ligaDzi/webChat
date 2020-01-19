import { combineReducers } from 'redux'
import { reducer as formReducer} from 'redux-form'
import authReducer, { moduleName as authModule } from '../ducks/auth'
import roomReducer, { moduleName as roomModuleName } from '../ducks/rooms'


const createRootReducer = () => combineReducers({
    form: formReducer,
    [authModule]: authReducer,
    [roomModuleName]: roomReducer
})

export default createRootReducer