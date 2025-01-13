import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/layout/layout';
import Loading from '../../components/loading/loading';
import { loginUser } from '../../redux/actions';
import AuthForm from './components/authForm/authForm';

import './auth.scss';

const Auth = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.authReducer);

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleInputUser = ({ target }) => {
    setUser(target.value)
  }

  const handleInputPassword = ({ target }) => {
    setPass(target.value)
  }

  const handleSubmit = () => {
    dispatch(loginUser(user, pass))
  }

  return (
    <Layout hideHeader >
      <Loading display-if={isLoading}/>
      <p>Auth</p>
      <AuthForm 
        user={user}
        onChangeUser={handleInputUser}
        pass={pass}
        onChangePass={handleInputPassword}
        onSubmit={handleSubmit}
      />
    </Layout>
  )
};

export default Auth;