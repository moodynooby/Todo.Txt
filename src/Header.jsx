import './App.scss';
import './Header.scss'
import React from 'react';
import { useEffect } from 'react'
import { themeChange } from 'theme-change'

const Header = () => {
  useEffect(() => {
    themeChange(false)
    // 👆 false parameter is required for react project
  }, [])
  return (
    <header>
      <h1>T0do.TxT</h1>
    </header>
  )
}

export default Header;