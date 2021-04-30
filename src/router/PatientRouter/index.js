import React from 'react'
import 'react-native-gesture-handler'
import {createStackNavigator} from '@react-navigation/stack'
import {Dashboard, History, Settings} from '../../pages/Patient'

const Stack = createStackNavigator()

const PatientRouter = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="History"
                component={History}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}

export default PatientRouter
