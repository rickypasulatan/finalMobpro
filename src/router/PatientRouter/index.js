import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import 'react-native-gesture-handler'
import {Dashboard, History, Settings} from '../../pages/Patient'
import {Drawer as CustomDrawer} from '../../components/molecules'
import { Text } from 'react-native'

const Drawer = createDrawerNavigator()

const PatientRouter = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>}>
            <Drawer.Screen
                name="Dashboard"
                component={Dashboard}
            />
            <Drawer.Screen
                name="History"
                component={History}
            />
            <Drawer.Screen
                name="Settings"
                component={Settings}
            />
        </Drawer.Navigator>
    )
}

export default PatientRouter
