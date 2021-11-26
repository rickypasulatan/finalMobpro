import React, { useContext, useEffect, useState } from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput as NativeTextInput, StyleSheet} from 'react-native';
import {Button, Card, TextInput} from '../../../components/atoms';
import {Header} from '../../../components/molecules';
import Modal from 'react-native-modal'
import firebase from '../../../config/firebase'
import uuid from 'react-native-uuid'
import BackendDataContext from '../../../contexts/backendDataContext';
import moment from 'moment'
import {showMessage, hideMessage} from 'react-native-flash-message'
import GetLocation from 'react-native-get-location'

/*  Fungsi yang mo kalkulasi jarak antara dua koordinat di planet bumi
    
    sumber:
    https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula*/
const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
  const p = 0.017453292519943295, c = Math.cos
  const a = 0.5 - c((latitude2 - latitude1) * p) / 2 +
            c(latitude1 * p) * c(latitude2 * p) *
            (1 - c((longitude2 - longitude1) * p)) / 2
  
  return 12742 * Math.asin(Math.sqrt(a))
}

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
      .orderByChild('patientUid')                     //filter appointment
      .equalTo(backendData.getUserDetail().uid).get() //berdasarkan uid di akun pasien sekarang
      .then(snapshot => {
        if(snapshot.exists()) {
          let data = []
          let retrievedData = snapshot.val()
          //ini sama deng di Hospital/Dashboard/index.js
          let keys = Object.keys(retrievedData)
          
          //ini sama deng di Hospital/Dashboard/index.js
          for(let i=0; i<keys.length; i++) {
            data.push(retrievedData[keys[i]])
          }

          /*  Khusus untuk current appointment di patient,
              satu patient bisa saja bikin beberapa appointment,
              jadi depe data di backend so ta campur, ada yang
              masih 'awaiting', ada yang so 'ongoing', deng ada
              yg so 'completed'.
              
              Nah di card current appointment di patient, itu dia
              mo se muncul appointment yang paling baru yang belum
              berstatus 'completed'. Terus krna data appointment
              di backend itu nd terurut, torang msti urutkan depe
              data di client sini.
              
              Maka dari itu setelah torang dapa depe data appointment
              for ini patient, torang urutkan dari appointment yang
              paling baru.*/
          data.sort((firstEl, secondEl) => {
            if(moment(firstEl.date, 'DD-MM-YYYY HH:mm:ss').isBefore(moment(secondEl.date, 'DD-MM-YYYY HH:mm:ss')))
              return 1
            
            if(moment(firstEl.date, 'DD-MM-YYYY HH:mm:ss').isAfter(moment(secondEl.date, 'DD-MM-YYYY HH:mm:ss')))
              return -1
            
            return 0
          })

          /*  Khusus untuk data appointment paling baru, torang mo ambe
              depe address dari tu rumah sakit yang patient ini ada
              pilih for mo bekeng akang appointment. */
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

                    console.log("after fetch map data", data)
                    
                    backendData.setAppointments(data)
                    setCurrentAppointments(data)
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
          backendData.setAppointments([])
          setCurrentAppointments([])
        }
      })
  }

  useEffect(() => {
    /*  Bekeng supaya tiap kali ini screen muncul, torang mo pangge
        fetchCurrentAppointment deng mo simpan lokasi gps dari perangkat
        sekarang */
    const unsubscribe = navigation.addListener('focus', () => {
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
    })
    /*  Khusus kalo ini screen baru muncul untuk pertama kalinya, torang
        jalankan hal yang sama seperti di atas. */
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
    console.log('getAvailableHospitalListHander fired')
    firebase.database().ref().child('pengguna').get()
      .then(snapshot => {
        if(snapshot.exists()) {
          const data = snapshot.val()
          const userIdList = Object.keys(data)

          let hospitals = []

          console.log("retrieved data from firebase")          
          
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
          .then(location => {
            console.log("retrieved current location")
            const {latitude, longitude} = location

            for(let i=0; i<userIdList.length; i++) {
              if(data[userIdList[i]].type === "hospital" && 
                  data[userIdList[i]].roomCapacity > 0 &&
                  calculateDistance(data[userIdList[i]].latitude, data[userIdList[i]].longitude, latitude, longitude) <= 17) {
                console.log(data[userIdList[i]])
                hospitals.push({uid: userIdList[i], ...data[userIdList[i]]})
              }
            }

            hospitals.map(el => console.log(calculateDistance(el.latitude, el.longitude, latitude, longitude)))

            setAvailableHospital(hospitals);
          })
        } else {
          console.log("No data available for pengguna")
        }
      })
      .catch(error => {
        console.log("error ", error)
      })
  }

  const sendAppointmentRequestHandler = () => {
    //torang kirim appointment ke backend server
    firebase.database().ref(`appointments/${uuid.v4()}`).set({
      patientUid: backendData.getUserDetail().uid,
      hospitalUid: selectedAvailableHospital.uid,
      patientName: backendData.getUserDetail().name,
      hospitalName: selectedAvailableHospital.name,
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

      fetchCurrentAppointments()
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
        <View style={styles.userInfoCardContainer}>
          <Card>
            <View>
              <View
                style={styles.userInfoCardHeader}>
                <Text
                  style={[styles.boldText, {color: 'white'}]}>
                  User Info
                </Text>
              </View>
              <View style={styles.UICardContent}>
                <View style={styles.UIinnerContentContainer}>
                  <Image
                    source={{uri : 'data:image/jpeg;base64,' + backendData.getUserDetail().profilePic}}
                    style={styles.UIprofilePic}
                  />
                </View>
                <View style={styles.UIrightDetailContainer}>
                  <Text style={styles.boldText}>
                    {backendData.getUserDetail().name}
                  </Text>

                  <Text style={styles.UIcurrentLocationText}>{currentLocation != undefined && currentLocation.length > 25 ? currentLocation.substring(0, 24) + '...' : currentLocation}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
        {
          currentAppointments.length > 0 && currentAppointments[0].status != 'completed' ?
          <View style={styles.CAcardContainer}>
            <Card>
              <View>
                <View
                  style={styles.CAcardHeader}>
                  <Text
                    style={[styles.boldText, {color: 'black'}]}>
                    Current Appointment
                  </Text>
                </View>

                <View style={styles.CAcontentContainer}>
                  <Text style={styles.boldText}>{currentAppointments[0].hospitalName}</Text>
                  <Text style={styles.text}>{currentAppointments[0].address}</Text>
                  {
                    currentAppointments[0].doctorName ?
                    <Text style={styles.text}>{currentAppointments[0].doctorName}</Text>
                    :
                    <Text style={styles.text}>Waiting for hospital to approve</Text>
                  }

                  <Text style={[styles.boldText, {marginTop: 25}]}>Complaint : </Text>
                  <Text style={styles.text}>{currentAppointments[0].complaint.length > 85 ? currentAppointments[0].complaint.substring(0, 84) + '...' : currentAppointments[0].complaint}</Text>
                </View>
              </View>
            </Card>
          </View>
          :
          <View style={styles.CAgreyCardContainer}>
            <Card>
              <View>
                <View
                  style={styles.CAgreyCardHeader}>
                  <Text
                    style={[styles.boldText, {color: 'white'}]}>
                    Current Appointment
                  </Text>
                </View>

                <View>
                  <View style={styles.CAgreyCardContent}>
                    <Text style={styles.noAppointmentText}>
                      There are currently no appointment
                    </Text>
                  </View>
                  <View style={styles.createAppointmentButton}>
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

      <Modal isVisible={isCreateAppointmentModalVisible} onBackButtonPress={() => {
        setIsCreateAppointmentModalVisible(false)
        setCurrentModalPage(0)
      }}>
        <View style={styles.creAppModalContainer}>
          <Card>
            <View style={styles.creAppModalInnerContainer}>
              {
                currentModalPage === 0 &&
                <View>
                  <Text style={styles.modalTitle}> Create new appointment </Text>
                  
                  <ScrollView style={styles.availHospListContainer}>
                    {
                      availableHospital.map((el, idx) => 
                        <View key={idx} style={{overflow: 'hidden', borderRadius: 25}}>
                          <TouchableOpacity
                            style={styles.hospCardContainer}
                            activeOpacity={0.9}
                            onPress={() => {
                              console.log(el.uid)
                              setSelectedAvailableHospital(el)
                              setCurrentModalPage(prevState => prevState + 1)
                            }}
                          >
                            <Card>
                              <View style={styles.hospCardInnerContainer}>
                                <View style={styles.hospCardLeftTextContainer}>
                                  <Text style={{fontWeight: '700'}}>{el.name}</Text>
                                  <Text style={{color: 'grey'}}>{el.email}</Text>
                                </View>
                                <View style={styles.hospCardRightTextContainer}>
                                  <Text>Capacity - {el.roomCapacity}</Text>
                                </View>
                              </View>
                            </Card>
                          </TouchableOpacity>
                        </View>
                      )
                    }
                  </ScrollView>
                  <View style={styles.refreshListButton}/>
                  <Button text="Refresh List" bgColor='#6200EE' textColor='white' onPress={getAvailableHospitalListHandler}/>
                </View>
              }
              {
                currentModalPage === 1 &&
                <View>
                  <Text style={styles.modalTitle}> Create new appointment </Text>

                  <Text>Enter your complaint</Text>
                  <NativeTextInput
                    style={styles.complaintTextInput}
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

const styles = StyleSheet.create({
  userInfoCardContainer: {
    height: 200, 
    paddingHorizontal: 15, 
    paddingTop: 25
  },
  userInfoCardHeader: {
    backgroundColor: '#6200EE',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  boldText: {
    fontSize: 18, 
    fontWeight: 'bold'
  },
  UICardContent: {
    flexDirection: 'row'
  },
  UIinnerContentContainer: {
    padding: 10
  },
  UIprofilePic: {
    width: 100,
    height: 100,
    borderRadius: 150,
  },
  UIrightDetailContainer: {
    padding: 5, 
    alignContent: 'center', 
    paddingTop: 35
  },
  UIcurrentLocationText: {
    fontSize: 16, 
    width: 200
  },
  CAgreyCardContainer: {
    height: 400, 
    paddingHorizontal: 15, 
    paddingTop: 25, 
    marginBottom: 150
  },
  CAgreyCardHeader: {
    backgroundColor: '#838383',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  CAgreyCardContent: {
    padding:30, 
    paddingTop: 80, 
    paddingHorizontal: 80,
    alignItems:'center'
  },
  noAppointmentText: {
    fontSize: 18, 
    color: '#838383', 
    textAlign:'center'
  },
  createAppointmentButton: {
    padding:70, 
    paddingHorizontal:60
  },
  creAppModalContainer: {
    flex: 1
  },
  creAppModalInnerContainer: {
    padding: 20
  },
  modalTitle: {
    alignSelf: 'center', 
    fontWeight: 'bold', 
    marginBottom: 25
  },
  availHospListContainer: {
    height: 400, 
    backgroundColor: '#E5E5E5', 
    borderRadius: 25, 
    overflow: 'hidden',
    padding: 5
  },
  hospCardContainer: {
    height:90
  },
  hospCardInnerContainer: {
    padding: 25, 
    flexDirection: 'row'
  },
  hospCardLeftTextContainer: {
    flex: 1
  },
  hospCardRightTextContainer: {
    justifyContent: 'center'
  },
  refreshListButton: {
    height: 15
  },
  complaintTextInput: {
    backgroundColor: '#E5E5E5',
    borderRadius: 25,
    marginTop: 25,
    textAlignVertical: 'top',
    padding: 25,
    marginBottom: 25,
  },
  CAcardContainer: {
    height: 270, 
    paddingHorizontal: 15, 
    paddingTop: 25, 
    marginBottom: 100
  },
  CAcardHeader: {
    backgroundColor: '#F5411E',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  text: {
    fontSize: 16
  },
  CAcontentContainer: {
    padding: 15
  },

})

export default Dashboard;
