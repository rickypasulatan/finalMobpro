import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

const SplashScreen = ({navigation}) => {
    useEffect(() => {
        setTimeout(() => navigation.replace("SignIn"), 3000)
    }, [])

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/healthwell.png')} style={styles.logo}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {backgroundColor: '#F4511E', width: '100%', height: '100%', justifyContent: 'center'},
    logo: {transform: [{scale: 0.5}]},
})

export default SplashScreen
