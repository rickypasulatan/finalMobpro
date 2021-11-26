import React, { useContext, useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Button, Card, TextInput } from '../../../components/atoms'
import { Header } from '../../../components/molecules'
import firebase from '../../../config/firebase'
import BackendDataContext from '../../../contexts/backendDataContext'
import Modal from 'react-native-modal'
import { showMessage } from 'react-native-flash-message'

const Appointments = ({navigation}) => {
    const backendData = useContext(BackendDataContext)
    const [appointments, setAppointments] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentSelectedAppointment, setCurrentSelectedAppointment] = useState({})
    const [assignedDoctor, setAssignedDoctor] = useState('')

    //penjelasan ini fungsi sama deng di Hospital/Dashboard/index.js
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

    //penjelasan ini fungsi sama deng di Hospital/Dashboard/index.js
    const approveAppointment = () => {
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
    }

    //penjelasan ini fungsi sama deng di Hospital/Dashboard/index.js
    const appointmentApprovalButtonHandler = el => {
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
    }

    useEffect(() => {
        //bekeng supaya tiap kali ini screen muncul, fetchCurrentAppointment mo ta eksekusi
        const unsubscribe = navigation.addListener('focus', fetchCurrentAppointments)

        return unsubscribe
    }, [navigation])

    return (
        <View style={{flex: 1}}>
            <Header navigation={navigation} title="Appointments" />
            
            <View style={styles.currentAppointmentsCardContainer}>
                <Card>
                    <View style={styles.innerCurrentAppointmentsCardContainer}>
                        <View style={styles.CAheader}>
                            <Text style={styles.CAheaderText}>Current Appointments</Text>
                        </View>

                        <View style={styles.CAcontentContainer}>
                            <ScrollView style={styles.CAscrollView}>
                                {
                                    appointments.map((el, idx) =>
                                        el.status != "completed" && 
                                        <View key={idx} style={styles.appointmentCardContainer}>
                                            <Card>
                                                <View style={styles.innerAppointmentCardContainer}>
                                                    <View style={styles.flex1}>
                                                        <Text style={styles.boldText}>Doctor</Text>
                                                        <Text>{el.doctorName ? el.doctorName : "Unassigned"}</Text>
                                                        <Text style={[styles.boldText, {marginTop: 15}]}>Patient</Text>
                                                        <Text>{el.patientName}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.flex1}>{el.date}</Text>
                                                        <Button     bgColor="#6200EE" 
                                                                    textColor="white" 
                                                                    text={el.status == "awaiting" ? "Approve" : "Done"}
                                                                    onPress={() => appointmentApprovalButtonHandler(el)}
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

            <Modal isVisible={isModalVisible} onBackButtonPress={() => setIsModalVisible(false)}>
                <View style={styles.flex1}>
                    <Card>
                        <View style={styles.innerModalCardContainer}>
                            <Text style={styles.modalTitleText}> Appointment Details </Text>
                            <Text style={styles.boldText}> Patient Name </Text>
                            <Text style={{marginBottom: 25}}> {currentSelectedAppointment.patientName}</Text>
                            <Text style={styles.boldText}> Complaint </Text>
                            <Text style={styles.complaintTextBox}> {currentSelectedAppointment.complaint} </Text>
                            <Text style={[{marginTop: 16}, styles.boldText]}> Assign Doctor </Text>
                            <TextInput  placeholder="Enter doctor name here"
                                        value={assignedDoctor}
                                        setValue={setAssignedDoctor}
                                        validation={e => e.length > 0 ? '' : 'empty input'}
                            />
                            <View style={{height: 25}}/>
                            <Button text="Approve"
                                    bgColor="#6200EE"
                                    textColor="white"
                                    onPress={approveAppointment}
                            />
                        </View>
                    </Card>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1
    },
    hospitalInfoCardContainer: {
        height: 190, 
        padding: 15
    },
    hospitalInfoHeader: {
        height: 50, 
        backgroundColor: '#6200EE', 
        justifyContent: 'center', 
        paddingLeft: 15
    },
    hospitalInfoHeaderText: {
        fontWeight: 'bold', 
        fontSize: 18, 
        color: 'white'
    },
    profilePicContainer: {
        flexDirection: 'row', 
        padding: 10
    },
    profilePic: {
        width: 80, 
        height: 80,
        borderRadius: 999
    },
    hospitalInfoDetailContainer: {
        flex: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 15
    },
    hospitalInfoDetailNameText: {
        fontWeight: 'bold'
    },
    currentAppointmentsCardContainer: {
        flex: 1, 
        margin: 15
    },
    innerCurrentAppointmentsCardContainer: {
        flex: 1
    },
    CAheader: {
        backgroundColor: '#F4511E', 
        height: 50, 
        justifyContent: 'center', 
        paddingHorizontal: 25
    },
    CAheaderText: {
        fontWeight: 'bold', 
        fontSize: 18
    },
    CAcontentContainer: {
        flex: 1, 
        padding: 25
    },
    CAscrollView: {
        flex: 1, 
        backgroundColor: '#EBEBEB', 
        borderRadius: 25, 
        padding: 15
    },
    appointmentCardContainer: {
        borderRadius: 25, 
        overflow: 'hidden', 
        marginBottom: 25
    },
    innerAppointmentCardContainer: {
        flexDirection: 'row', 
        padding: 20
    },
    boldText: {
        fontWeight: 'bold'
    },
    innerModalCardContainer: {
        padding: 20, 
        flex: 1
    },
    modalTitleText: {
        fontWeight: 'bold', 
        alignSelf: 'center', 
        marginBottom: 25
    },
    complaintTextBox: {
        flex: 1, 
        backgroundColor: '#EBEBEB', 
        borderRadius: 25, 
        padding: 10
    },

})

export default Appointments
