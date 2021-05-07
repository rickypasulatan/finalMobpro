import React, { useContext, useEffect, useState } from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import { Button, Card, TextInput } from '../../../components/atoms'
import { Header } from '../../../components/molecules'
import firebase from '../../../config/firebase'
import BackendDataContext from '../../../contexts/backendDataContext'
import Modal from 'react-native-modal'
import { showMessage } from 'react-native-flash-message'

const Dashboard = ({navigation}) => {
    const backendData = useContext(BackendDataContext)
    const [appointments, setAppointments] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentSelectedAppointment, setCurrentSelectedAppointment] = useState({})
    const [assignedDoctor, setAssignedDoctor] = useState('')

    const fetchCurrentAppointments = () => {
        firebase.database()
            .ref('appointments')
            .orderByChild('hospitalUid')
            .equalTo(backendData.getUserDetail().uid)
            .get()
            .then(snapshot => {
                if(snapshot.exists()) {
                    let data = []
                    let retrievedData = snapshot.val()
                    let keys = Object.keys(retrievedData)

                    for(let i=0; i<keys.length; i++) {
                        data.push({uid: keys[i], ...retrievedData[keys[i]]})
                    }

                    setAppointments(data)
                    console.log(data)
                } else {
                    console.log("error getting appointments data")
                }
            })
            .catch(error => {
                console.log("error getting appointments data", error)
            })
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchCurrentAppointments)

        return unsubscribe
    }, [navigation])

    return (
        <View style={{flex: 1}}>
            <Header navigation={navigation} title="Dashboard" />
            <View style={{flex: 1}}>
                <View style={{height: 190, padding: 15}}>
                    <Card>
                        <View>
                            <View style={{height: 50, backgroundColor: '#6200EE', justifyContent: 'center', paddingLeft: 15}}>
                                <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>Hospital Info</Text>
                            </View>
                            <View style={{flexDirection: 'row', padding: 10}}>
                                <Image source={{uri: 'data:image/jpeg;base64,' + backendData.getUserDetail().profilePic}}
                                        style={{
                                            width: 80, 
                                            height: 80,
                                            borderRadius: 999
                                        }}
                                />
                                <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 15}}>
                                    <Text style={{fontWeight: 'bold'}}>RS Unklab</Text>
                                    <Text>Address here</Text>
                                    <Text>Capacity : 50</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>


                <View style={{flex: 1, margin: 15}}>
                    <Card>
                        <View style={{flex: 1}}>
                            <View style={{backgroundColor: '#F4511E', height: 50, justifyContent: 'center', paddingHorizontal: 25}}>
                                <Text style={{fontWeight: 'bold', fontSize: 18}}>Current Appointments</Text>
                            </View>

                            <View style={{flex: 1, padding: 25}}>
                                <ScrollView style={{flex: 1, backgroundColor: '#EBEBEB', borderRadius: 25, padding: 15}}>
                                    {
                                        appointments.map((el, idx) =>
                                            el.status != "completed" && <View key={idx} style={{borderRadius: 25, overflow: 'hidden', marginBottom: 25}}>
                                                <Card>
                                                    <View style={{flexDirection: 'row', padding: 20}}>
                                                        <View style={{flex: 1}}>
                                                            <Text style={{fontWeight: 'bold'}}>Doctor</Text>
                                                            <Text>{el.doctorName ? el.doctorName : "Unassigned"}</Text>
                                                            <Text style={{fontWeight: 'bold', marginTop: 15}}>Patient</Text>
                                                            <Text>{el.patientName}</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{flex: 1}}>{el.date}</Text>
                                                            <Button     bgColor="#6200EE" 
                                                                        textColor="white" 
                                                                        text={el.status == "awaiting" ? "Approve" : "Done"}
                                                                        onPress={() => {
                                                                            if(el.status == "awaiting") {
                                                                                setCurrentSelectedAppointment(el)

                                                                                setIsModalVisible(true)
                                                                            } else if(el.status == "ongoing") {
                                                                                firebase.database()
                                                                                    .ref(`appointments/${el.uid}`)
                                                                                    .set({
                                                                                        ...el,
                                                                                        status: 'completed',
                                                                                    })
                                                                                    .then(() => {
                                                                                        backendData.setUserDetail({
                                                                                            ...backendData.getUserDetail(),
                                                                                            roomCapacity: backendData.getUserDetail().roomCapacity + 1
                                                                                        })

                                                                                        firebase.database()
                                                                                            .ref(`pengguna/${backendData.getUserDetail().uid}`)
                                                                                            .set(backendData.getUserDetail())
                                                                                            .then(() => {
                                                                                                

                                                                                                showMessage({
                                                                                                    message: "Appointment completed",
                                                                                                    type: 'success',
                                                                                                    hideOnPress: true
                                                                                                })
                                                                                                
                                                                                                fetchCurrentAppointments()
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
                                                                        }}
                                                            />
                                                        </View>
                                                    </View>
                                                </Card> 
                                            </View>
                                        )
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    </Card>
                </View>
            </View>


            <Modal isVisible={isModalVisible}>
                <View style={{flex: 1}}>
                    <Card>
                        <View style={{padding: 20, flex: 1}}>
                            <Text style={{fontWeight: 'bold', alignSelf: 'center', marginBottom: 25}}> Appointment Details </Text>
                            <Text style={{fontWeight: 'bold'}}> Patient Name </Text>
                            <Text style={{marginBottom: 25}}> {currentSelectedAppointment.patientName}</Text>
                            <Text style={{fontWeight: 'bold'}}> Complaint </Text>
                            <Text style={{flex: 1, backgroundColor: '#EBEBEB', borderRadius: 25, padding: 10}}> {currentSelectedAppointment.complaint} </Text>
                            <Text style={{marginTop: 16, fontWeight: 'bold'}}> Assign Doctor </Text>
                            <TextInput  placeholder="Enter doctor name here"
                                        value={assignedDoctor}
                                        setValue={setAssignedDoctor}
                                        validation={e => e.length > 0 ? '' : 'empty input'}
                            />
                            <View style={{height: 25}}/>
                            <Button text="Approve"
                                    bgColor="#6200EE"
                                    textColor="white"
                                    onPress={() => {
                                        

                                        firebase.database()
                                            .ref(`appointments/${currentSelectedAppointment.uid}`)
                                            .set({
                                                ...currentSelectedAppointment,
                                                doctorName: assignedDoctor,
                                                status: 'ongoing',
                                            })
                                            .then(() => {
                                                backendData.setUserDetail({
                                                    ...backendData.getUserDetail(),
                                                    roomCapacity: backendData.getUserDetail().roomCapacity - 1
                                                })
                                                
                                                firebase.database()
                                                    .ref(`pengguna/${backendData.getUserDetail().uid}`)
                                                    .set(backendData.getUserDetail())
                                                    .then(() => {
                                                        

                                                        showMessage({
                                                            message: "Appointment approved",
                                                            type: 'success',
                                                            hideOnPress: true
                                                        })

                                                        fetchCurrentAppointments()
                                                        setAssignedDoctor('')
                                                        setIsModalVisible(false)
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

                                    }}
                            />
                        </View>
                    </Card>
                </View>
            </Modal>
        </View>
    )
}

export default Dashboard
