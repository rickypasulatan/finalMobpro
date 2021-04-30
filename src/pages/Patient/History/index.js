import React from 'react'
import { View, Text } from 'react-native'
import { Header } from '../../../components/molecules'

const History = ({navigation}) => {
    return (
        <View>
            <Header navigation={navigation} title="History"/>
            <Text>Ini adalah halaman history</Text>
        </View>
    )
}

export default History
