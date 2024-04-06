import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Router, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Routes, Navigate} from 'react-router-dom'
import { redirect } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import { v4 as uuidV4} from 'uuid'



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={`/documents/${uuidV4()}`}/>}/>
        <Route path='/documents/:id' element={<App/>} />
      </Routes>
  </BrowserRouter>,
)
