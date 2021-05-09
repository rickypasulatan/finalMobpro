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
        if(email.length < 1) return     //cek kalo email kosong
        if(password.length < 1) return  //cek kalo password kosong

        console.log("Logging user in")

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                //ambe tu data yang ta simpan di Realtime Database brdasarkan uid
                firebase.database().ref().child("pengguna").child(userCredential.user.uid).get()
                        .then(snapshot => {
                            if(snapshot.exists()) {
                                //ambe dpe data
                                const data = snapshot.val()

                                //simpan tu data yang da dapa ke global context
                                backendData.setUserDetail({
                                    ...data,
                                    uid: userCredential.user.uid,
                                })
                                
                                /*  Kalo misal yang da ta login itu pasien,
                                    masuk ke panel router pasien.
                                    
                                    Mar kalo itu bukang pasien (hospital),
                                    masuk ke panel router hospital */
                                navigation.replace(data.type == "patient" ? "MainPatient" : "MainHospital")
                            } else {
                                console.log("No Data Available when getting user info after sign in")
                            }
                        })
                        .catch(error =>
                            console.log("USER SIGN IN ERROR", error)
                        )
            })
            //handle error pas ba sign in
            .catch(error => {
                showMessage({
                    message: error.message,
                    type: 'danger',
                    autoHide: true
                })
            })
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/healthwell.png')} style={styles.healthWellLogo}/>
            <View style={styles.cardContainer}>
                <Card>
                    <View style={styles.innerCardContainer}>
                        <Text style={styles.loginText}> Login </Text>
                        
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

                        <View style={styles.loginButton}>
                            <Button bgColor='#6200EE' text="Login" textColor='white' onPress={submitHandler}/>
                        </View>
                        <TouchableOpacity style={styles.signUpTextContainer} onPress={() => navigation.navigate("SignUp")}>
                            <Text style={styles.signUpText}>Don't have an account?</Text>
                        </TouchableOpacity> 
                    </View>
                </Card>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  healthWellLogo: {
    transform: [{scale: 0.5}],
  },
  container: {
    backgroundColor: '#F4511E',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    height: 350,
    width: 350,
  },
  innerCardContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 37,
  },
  loginText: {
    fontWeight: 'bold',
    marginBottom: 25,
  },
  loginButton: {
    width: 150,
    marginTop: 45,
  },
  signUpTextContainer: {
    paddingTop: 15,
  },
  signUpText: {
    color: 'grey',
    fontSize: 12,
  },
  labelText: {
    fontWeight: 'bold',
  },
  textInputGroup: {
    paddingVertical: 9,
    alignSelf: 'stretch',
  },
});

export default SignIn
