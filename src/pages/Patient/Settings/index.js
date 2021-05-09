import React, {useContext, useState} from 'react'
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native'
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
        //update data di backend firebase
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

            //update data di backend lokal
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

            //update data di backend firebase
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
    
                //update data di backend lokal
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
            <ScrollView>
                <View style={[styles.cardContainer, {height: 200}]}>
                    <Card>
                        <View style={styles.innerPPcardContainer}>
                            <View style={styles.purpleCardHeader}>
                                <Text style={[styles.boldText, {color: 'white'}]}>Profile Picture</Text>
                            </View>
                            
                            <View style={styles.profilePicContainer}>
                                <Image  source={{uri: 'data:image/jpeg;base64,' + backendData.getUserDetail().profilePic}}
                                        style={styles.profilePic}
                                />
                                <View style={styles.profilePicChangeButton}>
                                    <Button bgColor= '#F4511E' text="Change" textColor="black" onPress={setNewProfilePicHandler}/>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                <View style={[styles.cardContainer, {height: 250}]}>
                    <Card>
                        <View style={styles.orangeCardHeader}>
                            <Text style={styles.boldText}>Name</Text>
                        </View>
                        <View style={styles.innerCardContainer}>
                            <Text style={styles.boldText}>Enter new name</Text>
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    value={name}
                                    setValue={setName}
                                    placeholder="Enter your new name" />
                            </View>
                            <View style={styles.changeButtonContainer}>
                                <View style={styles.changeButton}>
                                    <Button bgColor= '#6200EE' text="change" textColor='white' onPress={setNewNameHandler}/>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                <View style={[styles.cardContainer, {height: 250, marginBottom: 100}]}>
                    <Card>
                        <View style={styles.purpleCardHeader}>
                            <Text style={[styles.boldText, {color: 'white'}]}>Password</Text>
                        </View>
                        <View style={styles.innerCardContainer}>
                            <Text style={styles.boldText}>Enter new password</Text>
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    value={password}
                                    setValue={setPassword}
                                    placeholder="Enter your new password"
                                    isPassword />
                            </View>
                            <View style={styles.changeButtonContainer}>
                                <View style={styles.changeButton}>
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

const styles = StyleSheet.create({
    cardContainer: {
      paddingHorizontal: 15, 
      paddingTop: 25
    },
    innerPPcardContainer: {
      flex: 1
    },
    purpleCardHeader: {
      backgroundColor: '#6200EE', 
      height: 50, 
      justifyContent: 'center', 
      paddingLeft: 15
    },
    orangeCardHeader: {
      backgroundColor: '#F4511E', 
      height: 50, 
      justifyContent: 'center', 
      paddingLeft: 15
    },
    boldText: {
      fontSize: 18, 
      fontWeight: 'bold'
    },
    profilePicContainer: {
      flexDirection: 'row', 
      flex: 1, 
      alignItems: 'center', 
      paddingHorizontal: 15
    },
    profilePic: {
        width: 70,
        height: 70,
        borderRadius: 999,
    },
    profilePicChangeButton: {
      flex: 1, 
      paddingHorizontal: 15
    },
    innerCardContainer: {
      padding: 15
    },
    textInputContainer: {
      marginTop: 20
    },
    changeButtonContainer: {
      paddingLeft: 15
    },
    changeButton: {
      marginTop: 20, 
      paddingHorizontal: 80
    },
})
export default Settings
