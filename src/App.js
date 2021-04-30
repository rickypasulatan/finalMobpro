import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { View, Text, StatusBar } from 'react-native'
import { Button, Card } from './components/atoms'
import PatientRouter from './router/PatientRouter'
import Router from './router/PatientRouter'

const App = () => {
    StatusBar.setBarStyle('dark-content')

    return (
        <>
            <StatusBar translucent backgroundColor='transparent'/>
            <NavigationContainer>
                <PatientRouter/>
            </NavigationContainer>
        </>
    )
}

export default App
