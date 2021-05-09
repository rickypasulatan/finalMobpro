import React from 'react'
import { View, Text } from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import SplashScreen from '../../pages/SplashScreen'
import SignUp from '../../pages/SignUp'
import SignIn from '../../pages/SignIn'
import PatientRouter from '../PatientRouter'
import SignUpHospital from '../../pages/SignUpHospital'
import SignUpPatient from '../../pages/SignUpPatient'
import HospitalRouter from '../HospitalRouter'
const Stack = createStackNavigator()

const MainRouter = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="SignUpHospital"
                component={SignUpHospital}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="SignUpPatient"
                component={SignUpPatient}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="MainPatient"
                component={PatientRouter}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="MainHospital"
                component={HospitalRouter}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}

export default MainRouter
