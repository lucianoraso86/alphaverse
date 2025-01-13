import React from 'react';

import './authForm.scss';

const AuthForm = ({ user, onChangeUser, pass, onChangePass, onSubmit }) => {

  return (
    <div>
      <input
        placeholder='user'
        value={user}
        onChange={onChangeUser}
        type='text'
      />
      <br />
      <input
        placeholder='pass'
        value={pass}
        onChange={onChangePass}
        type='password'
      />
      <button onClick={onSubmit}>Submit</button>
    </div>
  )
};

export default AuthForm;