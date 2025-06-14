import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';

import Login from './pages/login page';
import Signup from './pages/signup';
import Index from './components/index'
import ResetPassword from './pages/email';
import ResetPasswordPage from './pages/reset';
import Account from './pages/account';
import Advance from './pages/advance page';
import Microcontroller1 from './pages/microcontroller_1';
import Microcontroller2 from './pages/microcontroller_2';
import Microcontroller3 from './pages/microcontroller_3';
import Microcontroller4 from './pages/microcontroller_4';
import System1 from './pages/controller_1system';
import System2 from './pages/controller_2sytem';
import System3 from './pages/controller_3system';
import System4 from './pages/controller_4system';
import Sensors1 from './pages/controller_1sensors';
import Sensors2 from './pages/controller_2sensors';
import Sensors3 from './pages/controller_3sensors';
import Sensors4 from './pages/controller_4sensors';
import Irrigation4 from './pages/controller_4irrigation';
import Irrigation3 from './pages/controller_3irrigation';
import Irrigation2 from './pages/controller_2irrigation';
import Irrigation1 from './pages/controller_1irrigation';
import Motion from './pages/motion';
function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path='/forgot-password' element={<ResetPassword />} />
          <Route path='/reset-password/:token' element={<ResetPasswordPage />} />  
          <Route path="/signup" element={<Signup />} />        
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Index />}>
            <Route path='' element={<Navigate to='login' />} />
            <Route path='advance' element={<Advance />} />
            <Route path='motion_detection' element={<Motion/>} />
            <Route path='microcontroller/1' element={<Microcontroller1 />} />
            <Route path='microcontroller/1/system' element={<System1 />} />
            <Route path='microcontroller/1/sensors' element={<Sensors1 />} />
            <Route path='microcontroller/1/irrigation' element={<Irrigation1 />} />
            <Route path='microcontroller/2' element={<Microcontroller2 />} />
            <Route path='microcontroller/2/system' element={<System2 />} />
            <Route path='microcontroller/2/sensors' element={<Sensors2 />} />
            <Route path='microcontroller/2/irrigation' element={<Irrigation2 />} />
            <Route path='microcontroller/3' element={<Microcontroller3 />} />
            <Route path='microcontroller/3/system' element={<System3 />} />
            <Route path='microcontroller/3/sensors' element={<Sensors3 />} />
            <Route path='microcontroller/3/irrigation' element={<Irrigation3 />} />
            <Route path='microcontroller/4' element={<Microcontroller4 />} />
            <Route path='microcontroller/4/system' element={<System4 />} />
            <Route path='microcontroller/4/sensors' element={<Sensors4 />} />
            <Route path='microcontroller/4/irrigation' element={<Irrigation4 />} />
            <Route path='account' element={<Account />} />
          </Route>
          </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
