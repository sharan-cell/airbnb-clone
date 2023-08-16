

import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './components/IndexPage.jsx';

import Layout from './Layout';
import Login from './components/Login';
import Register from './components/Register';
import axios from 'axios';
import { UserContextProvider } from './useContext';
import Account from './components/Account';


axios.defaults.baseURL = 'http://127.0.0.1:4000/';
axios.defaults.withCredentials = true;

function App() {
  

  return (
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Layout/>}>

      <Route index element={<IndexPage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/account/:subpages?' element={<Account/>}/>
      <Route path='/account/:subpages/:action' element={<Account/>}/>

      </Route>
      
      
    </Routes>
      </UserContextProvider>
   
  )
}

export default App
