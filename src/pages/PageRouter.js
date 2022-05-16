import React from 'react';
import { Routes, Route,Navigate } from 'react-router-dom'
import LoadableComponent from '../utils/LoadableComponent';
import { inject, observer } from 'mobx-react';


// const Home = LoadableComponent(() => import('./Home/Home'))
const BetIt = LoadableComponent(() => import('./BetIt'))
const Test = LoadableComponent(() => import('./Test'))

function PageRouter({intl}){
  const getLang = (page,key,params,options) => {
    return intl.eval(page,key,params,options)
  }
  const { dict } = intl
  return (
    <Routes>
      <Route exact path='/betit' element={<BetIt lang={dict['betit']} getLang={(key,params,options) => getLang('betit',key,params,options)} />}></Route>
      {/* <Route exact path='/test' element={<Test />} /> */}
      <Route exact path='/' element={<Navigate to='/betit'/>}></Route>
    </Routes>
  )
}
export default inject('intl')(observer(PageRouter))