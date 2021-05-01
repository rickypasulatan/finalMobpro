import { NavigationContainer } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { Button, Card } from './components/atoms'
import MainRouter from './router/MainRouter'
import PatientRouter from './router/PatientRouter'
import Router from './router/PatientRouter'
import FlashMessage from 'react-native-flash-message'
import { BackendDataProvider } from './contexts/backendDataContext'

const App = () => {
    const [backendData, setBackendData] = useState({})
    StatusBar.setBarStyle('dark-content')

    const setUserDetail = data => {
        setBackendData(prevState => ({...prevState, userData: data}))
    }

    return (
        <>
            <StatusBar translucent backgroundColor='transparent'/>
            <BackendDataProvider value={{
                data:backendData,
                setUserDetail: setUserDetail,
            }}>
                <NavigationContainer>
                    <MainRouter/>
                </NavigationContainer>
            </BackendDataProvider>
            <FlashMessage position="top"/>
        </>
    )
}

export default App
