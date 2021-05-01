import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import {Button, Card} from '../../components/atoms'
import TextInput from '../../components/atoms/TextInput'
import firebase from '../../config/firebase'
import {showMessage, hideMessage} from 'react-native-flash-message'

const validEmail = e => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e) ? '' : 'invalid email'
const notEmpty = (e, src = '') => e.length > 0 ? '' : 'please input your ' + src

const SignUpPatient = ({navigation}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNum, setPhoneNum] = useState('')

    const submitHandler = () => {
        let error, i, inputs

        inputs = [
            () => notEmpty(name, "name"),
            () => validEmail(email),
            () => notEmpty(phoneNum, "phone number"),
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
                    console.log(userCredential)
                })
                .catch(error => {
                    console.log(error)
                    showMessage({
                        message: error.message,
                        type: 'danger',
                        hideOnPress: true
                    })
                })
    }

    return (
        <View style={{backgroundColor: '#F4511E', width: '100%', height: '100%', alignItems: 'center'}}>
            <Image source={require('../../assets/healthwell.png')} style={{transform: [{scale: 0.5}]}}/>
            <View style={{height: 400, width: 350}}>
                <Card>
                    <View style={{alignItems: 'center', paddingHorizontal: 20, paddingTop: 25}}>
                        <Text style={{fontWeight: 'bold', marginBottom: 5}}> Register Patient </Text>
                        
                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Name </Text>
                            <TextInput
                                placeholder="Type your name address"
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
                                validation={validEmail}
                                setValue={setEmail}
                            />
                        </View>

                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Phone Number </Text>
                            <TextInput
                                placeholder="Type your phone number"
                                value={phoneNum}
                                validation={notEmpty}
                                filter={e => e.replace(/\D/g, '')}
                                setValue={setPhoneNum}
                            />
                        </View>
                        
                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Password </Text>
                            <TextInput
                                placeholder="Type your password"
                                value={password}
                                validation={notEmpty}
                                setValue={setPassword}
                                isPassword
                            />
                        </View>

                        <View style={{width: 150, marginTop: 5}}>
                            <Button bgColor='#6200EE' text="Login" textColor='white' onPress={submitHandler}/>
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

export default SignUpPatient
