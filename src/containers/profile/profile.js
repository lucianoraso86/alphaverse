import React from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '../../components/layout/layout';

import './profile.scss';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <Layout hideFooter>
      Profile
      <button onClick={() => navigate('/')}>Home</button>
    </Layout>
  )
};

export default Profile;