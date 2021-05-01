import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { View, Text, StatusBar } from 'react-native'
import { Button, Card } from './components/atoms'
import MainRouter from './router/MainRouter'
import PatientRouter from './router/PatientRouter'
import Router from './router/PatientRouter'
import FlashMessage from 'react-native-flash-message'

const App = () => {
    StatusBar.setBarStyle('dark-content')

    return (
        <>
            <StatusBar translucent backgroundColor='transparent'/>
            <NavigationContainer>
                <MainRouter/>
            </NavigationContainer>
            <FlashMessage position="top"/>
        </>
    )
}

export default App
