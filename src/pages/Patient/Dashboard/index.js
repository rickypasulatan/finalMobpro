import React, { useContext, useState } from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput as NativeTextInput} from 'react-native';
import {Button, Card, TextInput} from '../../../components/atoms';
import {Header} from '../../../components/molecules';
import Modal from 'react-native-modal'
import firebase from '../../../config/firebase'
import uuid from 'react-native-uuid'
import BackendDataContext from '../../../contexts/backendDataContext';
import moment from 'moment'
import {showMessage, hideMessage} from 'react-native-flash-message'

const Dashboard = ({navigation}) => {
  const [availableHospital, setAvailableHospital] = useState([])
  const [selectedAvailableHospital, setSelectedAvailableHospital] = useState({})
  const [isCreateAppointmentModalVisible, setIsCreateAppointmentModalVisible] = useState(false)
  const [currentModalPage, setCurrentModalPage] = useState(0)
  const [complaint, setComplaint] = useState('')
  const backendData = useContext(BackendDataContext)

  const patientName = 'Ben Dover';
  const patientAddress = 'Airmadidi, North Sulawesi';
  const hospitalName = 'RS Unklab';
  const hospitalAddress = 'Airmadidi, North Sulawesi, 95695';
  const doctor = 'Dr. Anodaly Thesaurus';
  const pfp = '../../../assets/Ben.png';
  //const complainttex = 'I feel headache after eating a food fr...';

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
                    source={require(pfp)}
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
                    {patientName}
                  </Text>

                  <Text style={{fontSize: 16}}>{patientAddress}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>


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
        {/* <View style={{height: 270, paddingHorizontal: 15, paddingTop: 25, marginBottom: 100}}>
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

              <View
                style={{
                  flexDirection: 'column',
                  paddingHorizontal: 15,
                  paddingTop: 25,
                }}>
                <View style={{paddingBottom: 30}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    {hospitalName}
                  </Text>
                  <Text style={{fontSize: 16}}>{hospitalAddress}</Text>
                  <Text style={{fontSize: 16}}>Doctor - {doctor}</Text>
                </View>
                <View style={{paddingRight: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    Complaint:
                  </Text>
                  <Text style={{fontSize: 16}}>{complaint}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View> */}
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
