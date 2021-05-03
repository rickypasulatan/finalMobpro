import React from 'react'
import { View, Text } from 'react-native'
import { Header } from '../../../components/molecules'

const Settings = ({navigation}) => {
    return (
        <View>
            <Header navigation={navigation} title="" />
            <Text>Ini adalah halaman settings</Text>
        </View>
    )
}

export default Settings
