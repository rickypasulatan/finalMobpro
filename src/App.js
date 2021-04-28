import React from 'react'
import { View, Text, StatusBar } from 'react-native'

const App = () => {
    StatusBar.setBarStyle('dark-content')

    return (
        <View>
            <StatusBar translucent backgroundColor='transparent'/>
            <Text>Za warudo</Text>
        </View>
    )
}

export default App
