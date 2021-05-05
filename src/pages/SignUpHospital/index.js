import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import {Button, Card} from '../../components/atoms'
import TextInput from '../../components/atoms/TextInput'
import {showMessage, hideMessage} from 'react-native-flash-message'
import firebase from '../../config/firebase'
import GetLocation from 'react-native-get-location'

const validEmail = e => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e) ? '' : 'invalid email'
const notEmpty = (e, src = '') => e.length > 0 ? '' : 'please input your ' + src

const SignUpHospital = ({navigation}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = () => {
        let error, i, inputs, latitude, longitude

        inputs = [
            () => notEmpty(name, "name"),
            () => validEmail(email),
            () => notEmpty(password, "password"),
        ]

        inputs = inputs.map(el => el())
        for(i = 0; i<inputs.length; i++)
            if(inputs[i].length > 0) {
                error = inputs[i]
                break
            }

        if(error) 
            showMessage({
                message: error,
                type: 'danger',
                hideOnPress: true
            })
        else
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(userCredential => {

                    GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 15000,
                    })
                    .then(location => {
                        firebase.database().ref('pengguna/' + userCredential.user.uid).set({
                            name: name,
                            email: email,
                            password: password,
                            roomCapacity: 0,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            type: 'hospital',
                        })
                        .then(() => {
                            showMessage({
                                message: "Account successfully registered!",
                                type: 'success',
                                hideOnPress: true
                            })
                        })
                        .catch(error => {
                            console.log(error)
                            showMessage({
                                message: error,
                                type: 'danger',
                                hideOnPress: true
                            })
                        })
                    })
                    .catch(error => {
                        console.log("error getting location ", error)
                    })

                })
                .catch(error => showMessage({
                    message: error.message,
                    type: 'danger',
                    hideOnPress: true
                }))
    }

    return (
        <View style={{backgroundColor: '#F4511E', width: '100%', height: '100%', alignItems: 'center'}}>
            <Image source={require('../../assets/healthwell.png')} style={{transform: [{scale: 0.5}]}}/>
            <View style={{height: 380, width: 350}}>
                <Card>
                    <View style={{alignItems: 'center', paddingHorizontal: 20, paddingTop: 37}}>
                        <Text style={{fontWeight: 'bold', marginBottom: 25}}> Register Hospital </Text>
                        
                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Name </Text>
                            <TextInput
                                placeholder="Type your name"
                                value={name}
                                setValue={setName}
                                validation={notEmpty}
                            />
                        </View>

                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Email </Text>
                            <TextInput
                                placeholder="Type your email address"
                                value={email}
                                setValue={setEmail}
                                validation={validEmail}
                            />
                        </View>
                        
                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Password </Text>
                            <TextInput
                                placeholder="Type your password"
                                value={password}
                                setValue={setPassword}
                                validation={notEmpty}
                                isPassword
                            />
                        </View>

                        <View style={{width: 150, marginTop: 20}}>
                            <Button bgColor='#6200EE' text="Register" textColor='white' onPress={submitHandler}/>
                        </View>
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

export default SignUpHospital
