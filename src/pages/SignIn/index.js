import React, { useContext, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import {Button, Card} from '../../components/atoms'
import TextInput from '../../components/atoms/TextInput'
import BackendDataContext from '../../contexts/backendDataContext'
import firebase from '../../config/firebase'
import {showMessage, hideMessage} from 'react-native-flash-message'

const SignIn = ({navigation}) => {
    const backendData = useContext(BackendDataContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = () => {
        if(email.length < 1) return
        if(password.length < 1) return

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                firebase.database().ref().child("pengguna").child(userCredential.user.uid).get()
                        .then(snapshot => {
                            if(snapshot.exists()) {
                                const data = snapshot.val()

                                backendData.setUserDetail({
                                    ...data,
                                    uid: userCredential.user.uid,
                                })

                                navigation.replace(data.type == "patient" ? "MainPatient" : "MainHospital")
                            } else {
                                console.log("No Data Available when getting user info after sign in")
                            }
                        })
                        .catch(error =>
                            console.log("USER SIGN IN ERROR", error)
                        )
            })
            .catch(error => {
                showMessage({
                    message: error.message,
                    type: 'danger',
                    autoHide: true
                })
            })
    }

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
                            <Button bgColor='#6200EE' text="Login" textColor='white' onPress={submitHandler}/>
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
