import React, {useContext, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Header} from '../../../components/molecules';
import {Card, Button} from '../../../components/atoms';
import {TextInput} from '../../../components/atoms';
import firebase from '../../../config/firebase'
import BackendDataContext from '../../../contexts/backendDataContext';
import {showMessage, hideMessage} from 'react-native-flash-message'

const Settings = ({navigation}) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [roomCapacity, setRoomCapacity] = useState('')
  const backendData = useContext(BackendDataContext)
  
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
    .catch(() => {
      console.log(error)
      showMessage({
          message: error,
          type: 'success',
          hideOnPress: true
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
      .catch(() => {
        console.log(error)
        showMessage({
            message: error,
            type: 'success',
            hideOnPress: true
        })
      })
  }

  const setNewRoomCapacityHandler = () => {
    firebase.database().ref(`pengguna/${backendData.getUserDetail().uid}`).set({
      ...backendData.getUserDetail(),
      roomCapacity: parseInt(roomCapacity)
    })
    .then(() => {
      showMessage({
        message: "Room capacity successfully changed",
        type: 'success',
        hideOnPress: true
      })

      //update the local data
      backendData.setUserDetail({
        ...backendData.getUserDetail(),
        roomCapacity: parseInt(roomCapacity)
      })
    })
    .catch(() => {
      console.log(error)
      showMessage({
          message: error,
          type: 'success',
          hideOnPress: true
      })
    })
  }


  return (
    <View>
      <Header navigation={navigation} title="Settings" />
      <ScrollView style={{width: '100%'}}>

        
        <View style={{height: 250, paddingHorizontal: 25, paddingTop: 30}}>
          <Card>
            <View>
              <View
                style={{
                  backgroundColor: '#F4511E',
                  height: 50,
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Name</Text>
              </View>
              <View style={{padding: 15}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Enter new name
                </Text>
                <View style={{marginTop: 20}}>
                  <TextInput
                    value={name}
                    setValue={setName}
                    placeholder="Enter your hospital name"
                  />
                </View>
                <View style={{marginTop: 20, paddingHorizontal: 80}}>
                  <Button bgColor="#6200EE" text="Change" textColor="white" onPress={setNewNameHandler}/>
                </View>
              </View>
            </View>
          </Card>
        </View>


        <View style={{height: 250, paddingHorizontal: 25, paddingTop: 30}}>
          <Card>
            <View>
              <View
                style={{
                  backgroundColor: '#6200EE',
                  height: 50,
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
                  Password
                </Text>
              </View>
              <View style={{padding: 15}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Enter new password
                </Text>
                <View style={{marginTop: 20}}>
                  <TextInput
                    value={password}
                    setValue={setPassword}
                    placeholder="Enter your password"
                    isPassword
                  />
                </View>
                <View style={{marginVertical: 20, paddingHorizontal: 80}}>
                  <Button bgColor="#F4511E" text="Change" textColor="black" onPress={setNewPasswordHandler}/>
                </View>
              </View>
            </View>
          </Card>
        </View>


        <View style={{height: 250, paddingHorizontal: 25, paddingTop: 30, marginBottom: 150}}>
          <Card>
            <View>
              <View
                style={{
                  backgroundColor: '#F4511E',
                  height: 50,
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
                  Room Capacity
                </Text>
              </View>
              <View style={{padding: 15}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Enter new room capacity
                </Text>
                <View style={{marginTop: 20}}>
                  <TextInput
                    value={roomCapacity}
                    setValue={setRoomCapacity}
                    placeholder="Enter your hospital's room capacity"
                  />
                </View>
                <View style={{marginVertical: 20, paddingHorizontal: 80}}>
                  <Button bgColor="#F4511E" text="Change" textColor="black" onPress={setNewRoomCapacityHandler}/>
                </View>
              </View>
            </View>
          </Card>
        </View>


      </ScrollView>
    </View>
  );
};

export default Settings;
