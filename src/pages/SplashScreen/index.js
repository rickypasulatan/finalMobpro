import React, { useEffect } from 'react'
import { View, Text, Image } from 'react-native'

const SplashScreen = ({navigation}) => {
    useEffect(() => {
        setTimeout(() => navigation.replace("SignIn"), 3000)
    }, [])

    return (
        <View style={{backgroundColor: '#F4511E', width: '100%', height: '100%', justifyContent: 'center'}}>
            <Image source={require('../../assets/healthwell.png')} style={{transform: [{scale: 0.5}]}}/>
        </View>
    )
}

export default SplashScreen
