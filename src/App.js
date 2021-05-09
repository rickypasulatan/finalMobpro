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
    const [backendData, setBackendData] = useState({})  /*  global context for mo simpang data dari backend
                                                            pas tu user so login di aplikasi */
    StatusBar.setBarStyle('dark-content')

    const setUserDetail = data => {
        setBackendData(prevState => ({...prevState, userData: data}))
    }

    const getUserDetail = () => {
        return backendData.userData
    }

    const setAppointments = data => {
        setBackendData(prevState => ({...prevState, appointments: data}))
    }

    const getAppointments = () => {
        return backendData.appointments
    }

    return (
        <>
            <StatusBar translucent backgroundColor='transparent'/>
            <BackendDataProvider value={{
                data:backendData,
                setUserDetail: setUserDetail,
                getUserDetail: getUserDetail,
                setAppointments: setAppointments,
                getAppointments: getAppointments,
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
