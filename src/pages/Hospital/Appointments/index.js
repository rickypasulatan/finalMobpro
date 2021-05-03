import React from 'react'
import { View, Text } from 'react-native'
import { Header } from '../../../components/molecules'

const Appointments = ({navigation}) => {
    return (
        <View>
            <Header navigation={navigation} title="Appointments" />
            <Text>Ini adalah halaman appointments</Text>
        </View>
    )
}

export default Appointments
