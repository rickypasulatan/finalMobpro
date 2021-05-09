import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import {Button, Card} from '../../components/atoms'
import TextInput from '../../components/atoms/TextInput'
import firebase from '../../config/firebase'
import {showMessage, hideMessage} from 'react-native-flash-message'
import { launchImageLibrary } from 'react-native-image-picker'

const validEmail = e => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e) ? '' : 'invalid email'
const notEmpty = (e, src = '') => e.length > 0 ? '' : 'please input your ' + src

const SignUpPatient = ({navigation}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNum, setPhoneNum] = useState('')
    const [profilePicB64, setProfilePicB64] = useState('')

    const submitHandler = () => {
        let error, i, inputs

        //kumpul jadi satu supaya tinggal mo pake fungsi 'map' for mo eksekusi
        inputs = [
            () => notEmpty(name, "name"),
            () => validEmail(email),
            () => notEmpty(phoneNum, "phone number"),
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
                    
                    //simpan data user yang teregistrasi ke Realtime Database
                    firebase.database().ref('pengguna/' + userCredential.user.uid).set({
                            name: name,
                            email: email,
                            phoneNum: phoneNum,
                            password: password,
                            profilePic: profilePicB64,
                            type: 'patient'
                        })
                        .then(() => {
                            showMessage({
                                message: "Account registered successfully",
                                type: 'success',
                                hideOnPress: true
                            })
                            
                            //se bersih samua input kong pindah ke page 'SignIn'
                            setName('')
                            setEmail('')
                            setPassword('')
                            setPhoneNum('')
                            setProfilePicB64('')
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
                //handle error pas mo registrasi akun
                .catch(error => {
                    showMessage({
                        message: error.message,
                        type: 'danger',
                        hideOnPress: true
                    })
                })
    }

    const addPhotoHandler = () => {
        launchImageLibrary({
            mediaType: 'photo',
            maxHeight: 128,
            maxWidth: 128,
            includeBase64: true
        }, ({didCancel, errorMessage, base64}) => {
            if(didCancel) {
                showMessage({
                    message: "Cancelled profile picture picking",
                    type: 'warning',
                    autoHide: true
                })
                return
            }

            if(errorMessage) {
                showMessage({
                    message: errorMessage,
                    type: 'warning',
                    autoHide: true
                })
                return
            }

            setProfilePicB64(base64)
        })
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
            <Image source={require('../../assets/healthwell.png')} style={styles.healthWellLogo}/>
            <View style={styles.cardContainer}>
                <Card>
                    <View style={styles.innerCardContainer}>
                        <Text style={styles.registerPatientText}> Register Patient </Text>
                        
                        <TouchableOpacity onPress={addPhotoHandler}>
                            <View style={styles.profilePictureContainer}>
                                {profilePicB64 ? <Image source={{uri: `data:image/jpeg;base64,${profilePicB64}`}} style={styles.profilePicture}/> : <Text>Add photo</Text>}
                            </View>
                        </TouchableOpacity>

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

                        <View style={styles.registerButton}>
                            <Button bgColor='#6200EE' text="Register" textColor='white' onPress={submitHandler}/>
                        </View>
                    </View>
                </Card>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F4511E', 
        width: '100%'
    },
    contentContainerStyle: {
        alignItems: 'center',
    },
    healthWellLogo: {
        transform: [{scale: 0.5}],
    },
    cardContainer: {
        height: 480, 
        width: 350, 
        marginBottom: 50,
    },
    innerCardContainer: {
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 25,
    },
    registerPatientText: {
        fontWeight: 'bold',
         marginBottom: 5,
    },
    profilePictureContainer: {
        backgroundColor: '#F0F0F0', 
        width: 70, 
        height: 70, 
        borderRadius: 999, 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
    },
    profilePicture: {
        width: 70, 
        height: 70,
    },
    registerButton: {
        width: 150, 
        marginTop: 5,
    },
    labelText: {
        fontWeight: 'bold',
    },
    textInputGroup: {
        paddingVertical: 9,
        alignSelf: 'stretch',
    }
})

export default SignUpPatient
