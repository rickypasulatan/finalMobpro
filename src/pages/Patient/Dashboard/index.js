import React from 'react'
import { View, Text } from 'react-native'
import { Header } from '../../../components/molecules'

const Dashboard = ({navigation}) => {
    return (
        <View>
            <Header navigation={navigation} title="Dashboard"/>
            <Text>Ini adalah halaman dashboard</Text>
        </View>
    )
}

export default Dashboard
