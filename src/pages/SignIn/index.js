import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import {Button, Card} from '../../components/atoms'
import TextInput from '../../components/atoms/TextInput'

const SignIn = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={{backgroundColor: '#F4511E', width: '100%', height: '100%', alignItems: 'center'}}>
            <Image source={require('../../assets/healthwell.png')} style={{transform: [{scale: 0.5}]}}/>
            <View style={{height: 350, width: 350}}>
                <Card>
                    <View style={{alignItems: 'center', paddingHorizontal: 20, paddingTop: 37}}>
                        <Text style={{fontWeight: 'bold', marginBottom: 25}}> Login </Text>
                        
                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Email </Text>
                            <TextInput
                                placeholder="Type your email address"
                                value={email}
                                setValue={setEmail}
                            />
                        </View>
                        
                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Password </Text>
                            <TextInput
                                placeholder="Type your password"
                                value={password}
                                setValue={setPassword}
                                isPassword
                            />
                        </View>

                        <View style={{width: 150, marginTop: 45}}>
                            <Button bgColor='#6200EE' text="Login" textColor='white' onPress={() => navigation.replace("MainPatient")}/>
                        </View>
                        <TouchableOpacity style={{paddingTop: 15}} onPress={() => navigation.navigate("SignUp")}>
                            <Text style={{color: 'grey', fontSize: 12}}>Don't have an account?</Text>
                        </TouchableOpacity> 
                    </View>
                </Card>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    labelText: {
        fontWeight: 'bold'
    },
    textInputGroup: {
        paddingVertical: 9,
        alignSelf: 'stretch'
    }
})

export default SignIn
