import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import { signUp, signIn, moduleName } from '../../ducks/auth'

import SignInForm from '../auth/SignInForm'
import SignUpForm from '../auth/SignUpForm'


const AuthPage = ({ user, error, signUp, signIn }) => {


    const handleSignIn = ({ email, password }) => signIn(email, password)
    const handleSignUp = ({ name, email, password }) => signUp(name, email, password)
    
    if (error) {
        console.error(`Error: ${error}`)
    }

    return (
        <div className='container'>           
            <Route  path='/auth/login' exact>
                <SignInForm onSubmit={ handleSignIn } />
            </Route>            
            <Route  path='/auth/register' exact>
                <SignUpForm onSubmit={ handleSignUp } />
            </Route>
        </div>
    )

}

AuthPage.propTypes = {
    //from store
    user: PropTypes.object,
    error: PropTypes.string,
    signUp: PropTypes.func.isRequired,
    signIn: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        user: state[moduleName].user,
        error: state[moduleName].error
    }
}

const mapToDispatch = {
    signUp,
    signIn
}

const decorator = connect(mapStateToProps, mapToDispatch);

export default decorator(AuthPage)
