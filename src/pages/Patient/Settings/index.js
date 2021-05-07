import React, {useContext, useState} from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import { Header } from '../../../components/molecules'
import {Card, Button} from '../../../components/atoms'
import {TextInput} from '../../../components/atoms'
import BackendDataContext from '../../../contexts/backendDataContext'
import firebase from '../../../config/firebase'
import { showMessage } from 'react-native-flash-message'
import { launchImageLibrary } from 'react-native-image-picker'

const Settings = ({navigation}) => {
    const backendData = useContext(BackendDataContext)

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const setNewNameHandler = () => {
        firebase.database().ref(`pengguna/${backendData.getUserDetail().uid}`).set({
            ...backendData.getUserDetail(),
            name: name,
        })
        .then(() => {
            showMessage({
            message: "Name successfully changed",
            type: 'success',
            hideOnPress: true
            })

            //update the local data
            backendData.setUserDetail({
            ...backendData.getUserDetail(),
            name: name
            })
        })
        .catch((error) => {
            console.log(error)
            showMessage({
                message: error,
                type: 'success',
                hideOnPress: true
            })
        })
    }

    const setNewProfilePicHandler = () => {
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

            firebase.database().ref(`pengguna/${backendData.getUserDetail().uid}`).set({
                ...backendData.getUserDetail(),
                profilePic: base64,
            })
            .then(() => {
                showMessage({
                message: "Profile picture successfully changed",
                type: 'success',
                hideOnPress: true
                })
    
                //update the local data
                backendData.setUserDetail({
                ...backendData.getUserDetail(),
                profilePic: base64
                })
            })
            .catch((error) => {
                console.log(error)
                showMessage({
                    message: error,
                    type: 'success',
                    hideOnPress: true
                })
            })
        })
    }

    
    const setNewPasswordHandler = () => {
        firebase.auth().currentUser.updatePassword(password)
            .then(() => {
                showMessage({
                    message: "Password successfully changed",
                    type: 'success',
                    hideOnPress: true
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <View>
            <Header navigation={navigation} title="Settings"/>
            <ScrollView style={{width: '100%'}}>
                <View style={{height: 200, paddingHorizontal: 15, paddingTop: 25}}>
                    <Card>
                        <View style={{flex: 1}}>
                            <View style={{backgroundColor: '#6200EE', height: 50, justifyContent: 'center', paddingLeft: 15}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>Profile Picture</Text>
                            </View>
                            
                            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingHorizontal: 15}}>
                                <Image  source={{uri: 'data:image/jpeg;base64,' + backendData.getUserDetail().profilePic}}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 999,
                                        }}
                                />
                                <View style={{flex: 1, paddingHorizontal: 15}}>
                                    <Button bgColor= '#F4511E' text="Change" textColor="black" onPress={setNewProfilePicHandler}/>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                <View style={{height: 250, paddingHorizontal: 20, paddingTop: 30}}>
                    <Card>
                        <View style={{backgroundColor: '#F4511E', height: 50, justifyContent: 'center', paddingLeft: 15}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Name</Text>
                        </View>
                        <View style={{padding: 15}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Enter new name</Text>
                            <View style={{marginTop: 20}}>
                                <TextInput
                                    value={name}
                                    setValue={setName}
                                    placeholder="Enter your new name" />
                            </View>
                            <View style={{paddingLeft: 15}}>
                                <View style={{marginTop: 20, paddingHorizontal: 80}}>
                                    <Button bgColor= '#6200EE' text="change" textColor='white' onPress={setNewNameHandler}/>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                <View style={{height: 250, paddingHorizontal: 20, paddingTop: 30, marginBottom: 100}}>
                    <Card>
                        <View style={{backgroundColor: '#6200EE', height: 50, justifyContent: 'center', paddingLeft: 15}}>
                            <Text style={{fontsize: 18, fontWeight:'bold', color: 'white'}}>Password</Text>
                        </View>
                        <View style={{padding: 15}}>
                            <Text style={{fontsize: 18, fontWeight: 'bold'}}>Enter new password</Text>
                            <View style={{marginTop: 20}}>
                                <TextInput
                                    value={password}
                                    setValue={setPassword}
                                    placeholder="Enter your new password"
                                    isPassword />
                            </View>
                            <View style={{paddingLeft: 15}}>
                                <View style={{marginTop: 20, paddingHorizontal: 80}}>
                                    <Button bgColor= '#F4511E' text='change' onPress={setNewPasswordHandler}/>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </View>
    )
};




export default Settings
