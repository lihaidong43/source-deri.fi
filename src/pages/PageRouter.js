import React from 'react';
import { Routes, Route } from 'react-router-dom'
import LoadableComponent from '../utils/LoadableComponent';
import { inject, observer } from 'mobx-react';


// const Home = LoadableComponent(() => import('./Home/Home'))
const BetIt = LoadableComponent(() => import('./BetIt'))

function PageRouter({intl}){
  const getLang = (page,key,params,options) => {
    return intl.eval(page,key,params,options)
  }
  const { dict } = intl
  return (
    <Routes>
      <Route exact path='/betit' element={<BetIt lang={dict['betit']} />}></Route>
      {/* <Route exact path='/' render={() => <Route to='/betit'/>} /> */}
    </Routes>
  )
}
export default inject('intl')(observer(PageRouter))