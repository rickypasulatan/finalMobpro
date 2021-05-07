import React, { useContext, useEffect, useState } from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput as NativeTextInput} from 'react-native';
import {Button, Card, TextInput} from '../../../components/atoms';
import {Header} from '../../../components/molecules';
import Modal from 'react-native-modal'
import firebase from '../../../config/firebase'
import uuid from 'react-native-uuid'
import BackendDataContext from '../../../contexts/backendDataContext';
import moment from 'moment'
import {showMessage, hideMessage} from 'react-native-flash-message'
import GetLocation from 'react-native-get-location'

const Dashboard = ({navigation}) => {
  const [availableHospital, setAvailableHospital] = useState([])
  const [selectedAvailableHospital, setSelectedAvailableHospital] = useState({})
  const [isCreateAppointmentModalVisible, setIsCreateAppointmentModalVisible] = useState(false)
  const [currentAppointments, setCurrentAppointments] = useState([])
  const [currentModalPage, setCurrentModalPage] = useState(0)
  const [complaint, setComplaint] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const backendData = useContext(BackendDataContext)

  const fetchCurrentAppointments = () => {
    firebase.database()
      .ref('appointments')
      .orderByChild('patientUid')
      .equalTo(backendData.getUserDetail().uid).get()
      .then(snapshot => {
        if(snapshot.exists()) {
          let data = []
          let retrievedData = snapshot.val()
          let keys = Object.keys(retrievedData)
          
          for(let i=0; i<keys.length; i++) {
            data.push(retrievedData[keys[i]])
          }

          data.sort((firstEl, secondEl) => {
            if(moment(firstEl.date, 'DD-MM-YYYY HH:mm:ss').isBefore(moment(secondEl.date, 'DD-MM-YYYY HH:mm:ss')))
              return 1
            
            if(moment(firstEl.date, 'DD-MM-YYYY HH:mm:ss').isAfter(moment(secondEl.date, 'DD-MM-YYYY HH:mm:ss')))
              return -1
            
            return 0
          })

          console.log(data)

          firebase.database()
            .ref('pengguna')
            .child(data[0].hospitalUid)
            .get()
            .then(snapshot => {
              if(snapshot.exists()) {
                const {latitude, longitude, name: hospName} = snapshot.val()

                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                  .then(resp => resp.json())
                  .then(datajson => {
                    data[0] = {
                      ...data[0], 
                      address: datajson.display_name,
                      hospitalName: hospName,
                    }

                    console.log(data)

                    setCurrentAppointments(data)
                    backendData.setAppointments(data)
                  })
                  .catch(error => {
                    console.log("couldn't get location info of hospital in current appointment")
                  })
              } else {
                console.log("error getting hospital data of current appointment")
              }
            })
            .catch(error => {
              console.log("Failed getting hospital data from uid,", error)
            })
        } else {
          setCurrentAppointments([])
          backendData.setAppointments([])
        }
      })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchCurrentAppointments)
    fetchCurrentAppointments()

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
      const {latitude, longitude} = location

      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        .then(resp => resp.json())
        .then(datajson => {
          setCurrentLocation(datajson.display_name)
        })
        .catch(error => {
          console.log("couldn't get current location")
        })
    })

    return unsubscribe
  }, [navigation])

  const getAvailableHospitalListHandler = () => {
    firebase.database().ref().child('pengguna').get()
      .then(snapshot => {
        if(snapshot.exists()) {
          const data = snapshot.val()
          const userIdList = Object.keys(data)

          let hospitals = []

          for(let i=0; i<userIdList.length; i++) {
            if(data[userIdList[i]].type === "hospital" && 
                data[userIdList[i]].roomCapacity > 0) {
              hospitals.push(data[userIdList[i]])
            }
          }
          
          console.log(hospitals)
          setAvailableHospital(hospitals);
        } else {
          console.log("No data available for pengguna")
        }
      })
      .catch(error => {
        console.log("error ", error)
      })
  }

  const sendAppointmentRequestHandler = () => {
    firebase.database().ref(`appointments/${uuid.v4()}`).set({
      patientUid: backendData.getUserDetail().uid,
      hospitalUid: selectedAvailableHospital.uid,
      patientName: backendData.getUserDetail().name,
      complaint: complaint,
      date: moment().format('DD-MM-YYYY HH:mm:ss'),
      status: 'awaiting',
    })
    .then(() => {
      setIsCreateAppointmentModalVisible(false)

      showMessage({
        message: "Appointment Request sent succesfully",
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
  }

  return (
    <View>
      <Header navigation={navigation} title="Dashboard" />
      <ScrollView>
        <View style={{height: 200, paddingHorizontal: 15, paddingTop: 25}}>
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
                  User Info
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{padding: 10}}>
                  <Image
                    source={{uri : 'data:image/jpeg;base64,' + backendData.getUserDetail().profilePic}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 150,
                    }}
                  />
                </View>
                <View
                  style={{padding: 5, alignContent: 'center', paddingTop: 35}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    {backendData.getUserDetail().name}
                  </Text>

                  <Text style={{fontSize: 16, width: 200}}>{currentLocation}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
        {
          currentAppointments.length > 0 && currentAppointments[0].status != 'completed' ?
          <View style={{height: 270, paddingHorizontal: 15, paddingTop: 25, marginBottom: 100}}>
            <Card>
              <View>
                <View
                  style={{
                    backgroundColor: '#F5411E',
                    height: 50,
                    justifyContent: 'center',
                    paddingLeft: 15,
                  }}>
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
                    Current Appointment
                  </Text>
                </View>

                <View style={{padding: 15}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>{currentAppointments[0].hospitalName}</Text>
                  <Text style={{fontSize: 16}}>{currentAppointments[0].address}</Text>
                  {
                    currentAppointments[0].doctorName ?
                    <Text style={{fontSize: 16}}>{currentAppointments[0].doctorName}</Text>
                    :
                    <Text style={{fontSize: 16}}>Waiting for hospital to approve</Text>
                  }

                  <Text style={{fontWeight: 'bold', marginTop: 25, fontSize: 16}}>Complaint : </Text>
                  <Text style={{fontSize: 16}}>{currentAppointments[0].complaint}</Text>
                </View>
              </View>
            </Card>
          </View>
          :
          <View style={{height: 400, paddingHorizontal: 15, paddingTop: 25, marginBottom: 150}}>
            <Card>
              <View>
                <View
                  style={{
                    backgroundColor: '#838383',
                    height: 50,
                    justifyContent: 'center',
                    paddingLeft: 15,
                  }}>
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
                    Current Appointment
                  </Text>
                </View>

                <View style={{flexDirection:'column'}}>
                  <View style={{padding:30, paddingTop: 80, paddingHorizontal: 80,alignItems:'center'}}>
                    <Text style={{fontSize: 18, color: '#838383', textAlign:'center'}}>
                      There are currently no appointment
                    </Text>
                  </View>
                  <View style={{padding:70, paddingHorizontal:60}}>
                    <Button
                      bgColor="#F4511E"
                      text="Create Appointment"
                      textColor="white"
                      onPress={() => setIsCreateAppointmentModalVisible(true)}
                    />
                  </View>
                </View>
              </View>
            </Card>
          </View>
        }
      </ScrollView>

      <Modal isVisible={isCreateAppointmentModalVisible}>
        <View style={{flex: 1}}>
          <Card>
            <View style={{padding: 20}}>
              {
                currentModalPage === 0 &&
                <View>
                  <Text style={{alignSelf: 'center', fontWeight: 'bold', marginBottom: 25}}> Create new appointment </Text>
                  
                  <ScrollView style={{
                    height: 400, 
                    backgroundColor: '#E5E5E5', 
                    borderRadius: 25, 
                    overflow: 'hidden',
                    padding: 5
                  }}>
                    {
                      availableHospital.map((el, idx) => 
                        <View key={idx} style={{overflow: 'hidden', borderRadius: 25}}>
                          <TouchableOpacity
                            style={{
                              height:90
                            }}
                            activeOpacity={0.9}
                            onPress={() => {
                              setSelectedAvailableHospital(el)
                              setCurrentModalPage(prevState => prevState + 1)
                            }}
                          >
                            <Card>
                              <View style={{padding: 25, flexDirection: 'row'}}>
                                <View style={{flex: 1}}>
                                  <Text style={{fontWeight: '700'}}>{el.name}</Text>
                                  <Text style={{color: 'grey'}}>{el.email}</Text>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                  <Text>Capacity - {el.roomCapacity}</Text>
                                </View>
                              </View>
                            </Card>
                          </TouchableOpacity>
                        </View>
                      )
                    }
                  </ScrollView>
                  <View style={{height: 15}}/>
                  <Button text="Refresh List" bgColor='#6200EE' textColor='white' onPress={getAvailableHospitalListHandler}/>
                </View>
              }
              {
                currentModalPage === 1 &&
                <View>
                  <Text style={{alignSelf: 'center', fontWeight: 'bold', marginBottom: 25}}> Create new appointment </Text>

                  <Text>Enter your complaint</Text>
                  <NativeTextInput
                    style={{
                      backgroundColor: '#E5E5E5',
                      borderRadius: 25,
                      marginTop: 25,
                      textAlignVertical: 'top',
                      padding: 25,
                      marginBottom: 25,
                    }}
                    multiline
                    numberOfLines={10}
                    value={complaint}
                    onChange={({nativeEvent: {text: e}}) => {setComplaint(e)}}
                  />
                  <Button text="Send Appointment Request" bgColor="#F4511E" onPress={sendAppointmentRequestHandler}/>
                </View>
              }
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;
