import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import { View, Text } from 'react-native'
import { Drawer as CustomDrawer } from '../../components/molecules'
import { Appointments, Dashboard, Settings } from '../../pages/Hospital'

const Drawer = createDrawerNavigator()

const HospitalRouter = () => {
    const routes = [
        "Dashboard",
        "Appointments",
        "Settings",
    ]

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} routes={routes}/>}>
            <Drawer.Screen
                name="Dashboard"
                component={Dashboard}
            />
            <Drawer.Screen
                name="Appointments"
                component={Appointments}
            />
            <Drawer.Screen
                name="Settings"
                component={Settings}
            />
        </Drawer.Navigator>
    )
}

export default HospitalRouter
