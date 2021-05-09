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
        let error, i, inputs

        //kumpul jadi satu supaya tinggal mo pake fungsi 'map' for mo eksekusi
        inputs = [
            () => notEmpty(name, "name"),
            () => validEmail(email),
            () => notEmpty(password, "password"),
        ]

        inputs = inputs.map(el => el())

        /*  Skarang tu array inputs so berisi hasil return dari tu
            fungsi-fungsi yang torang da kumpul tadi.
            
            Maka dari itu torang mo cek kalo misal dpe string itu
            nda kosong, berarti ada error. Torang taru tu error yang
            da dapa ke variabel 'error' */
        for(i = 0; i<inputs.length; i++)
            if(inputs[i].length > 0) {
                error = inputs[i]
                break
            }
        
        //cek kalo variabel 'error' itu berisi
        if(error) 
            //kalo io, se muncul dpe error
            showMessage({
                message: error,
                type: 'danger',
                hideOnPress: true
            })
        else
            //kalo nda, lanjutkan proses registrasi
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    /*  Skarang dpe akun so selesai bekeng.
                        Torang mo simpang skrng dpe informasi-
                        informasi tambahan ke Realtime Database */

                    //Ambe lokasi perangkat sekarang
                    GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 15000,
                    })
                    .then(location => {
                        /*  Kalo so dapa tu lokasi perangkat sekarang,
                            jalankan baris code disini */

                        //simpan data user yang teregistrasi ke Realtime Database
                        firebase.database().ref('pengguna/' + userCredential.user.uid).set({
                            name: name,
                            email: email,
                            password: password,
                            roomCapacity: 10,
                            //profile picture khusus rumah sakit nimbole ganti
                            profilePic: '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',
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
                            
                            //se bersih samua input kong pindah ke page 'SignIn'
                            setName('')
                            setEmail('')
                            setPassword('')
                            navigation.replace("SignIn")
                        })
                        .catch(error => {
                            //handle error pas b simpan ke Realtime Database
                            console.log(error)
                            showMessage({
                                message: error,
                                type: 'danger',
                                hideOnPress: true
                            })
                        })
                    })
                    .catch(error => {
                        //handle error pas mo ambe lokasi perangkat sekarang
                        console.log("error getting location ", error)
                    })

                })
                //handle error pas mo registrasi akun
                .catch(error => showMessage({
                    message: error.message,
                    type: 'danger',
                    hideOnPress: true
                }))
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/healthwell.png')} style={styles.healthWellLogo}/>
            <View style={styles.cardContainer}>
                <Card>
                    <View style={styles.innerCardContainer}>
                        <Text style={styles.registerHospitalText}> Register Hospital </Text>
                        
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

                        <Text style={styles.infoText}>The current device location will be set as the hospital's address</Text>

                        <View style={styles.registerButton}>
                            <Button bgColor='#6200EE' text="Register" textColor='white' onPress={submitHandler}/>
                        </View>
                    </View>
                </Card>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    infoText: {
        paddingVertical: 5,
        fontSize: 11,
        color: 'grey'
    },
    container: {
        backgroundColor: '#F4511E', 
        width: '100%', 
        height: '100%', 
        alignItems: 'center',
    },
    healthWellLogo: {
        transform: [{scale: 0.5}]
    },
    cardContainer: {
        height: 400, 
        width: 350,
    },
    innerCardContainer: {
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 37,
    },
    registerHospitalText: {
        fontWeight: 'bold', 
        marginBottom: 25,
    },
    registerButton: {
        width: 150, 
        marginTop: 20,
    },
    labelText: {
        fontWeight: 'bold',
    },
    textInputGroup: {
        paddingVertical: 9,
        alignSelf: 'stretch',
    }
})

export default SignUpHospital
