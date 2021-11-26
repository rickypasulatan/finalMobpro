import React, { useContext, useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native'
import { Button, Card, TextInput } from '../../../components/atoms'
import { Header } from '../../../components/molecules'
import firebase from '../../../config/firebase'
import BackendDataContext from '../../../contexts/backendDataContext'
import Modal from 'react-native-modal'  //ini tu modal
import { showMessage } from 'react-native-flash-message'

const Dashboard = ({navigation}) => {
    const backendData = useContext(BackendDataContext)
    const [appointments, setAppointments] = useState([])    // state yang berisi daftar appointment skarang
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentSelectedAppointment, setCurrentSelectedAppointment] = useState({})    // mo ta pake di modal ini
    const [assignedDoctor, setAssignedDoctor] = useState('')                            // mo ta pake di modal ini
    const [hospitalLocation, setHospitalLocation] = useState('')

    const fetchCurrentAppointments = () => {
        firebase.database()
            .ref('appointments')
            .orderByChild('hospitalUid')
            .equalTo(backendData.getUserDetail().uid)   /*  filter berdasarkan
                                                            appointment yang
                                                            ada hospitalUid
                                                            sama deng ini akun
                                                            yg sementara ta login
                                                            pe uid */
            .get()
            .then(async (snapshot) => {
                if(snapshot.exists()) {
                    let data = []
                    let retrievedData = snapshot.val()
                    let keys = Object.keys(retrievedData)   /*  Karna di database
                                                                dia ta simpan jadi
                                                                dictionary, bukang
                                                                array, jadi torang
                                                                msti rubah dia jadi
                                                                array dengan cara
                                                                ambe tiap dictionary
                                                                keys */

                    /*  kong ambe data dari tiap keys kong taru di list
                        'data' */
                    for(let i=0; i<keys.length; i++) {
                        let patientPhoneNumber = (await firebase.database().ref(`pengguna/${retrievedData[keys[i]].patientUid}`).get()).val().phoneNum
                        
                        data.push({uid: keys[i], ...retrievedData[keys[i]], phoneNum: patientPhoneNumber})
                    }

                    setAppointments(data)
                    //console.log(data)
                } else {
                    console.log("error getting appointments data")
                }
            })
            .catch(error => {
                console.log("error getting appointments data", error)
            })
    }

    const approveAppointment = () => {
        firebase.database()
            .ref(`appointments/${currentSelectedAppointment.uid}`)
            /*  Update tu data appointment di backend dengan menambahkan
                nama dokter yang torang da assign, deng ganti dpe status
                jadi 'ongoing' */
            .set({
                ...currentSelectedAppointment,
                doctorName: assignedDoctor,
                status: 'ongoing',
            })
            .then(() => {
                /*  update tu backendData pe roomCapacity, se kurang 1,
                    gegara tu appointment tadi torang so approve */
                backendData.setUserDetail({
                    ...backendData.getUserDetail(),
                    roomCapacity: backendData.getUserDetail().roomCapacity - 1
                })
                
                /*  Karna tadi baru da ta update tu data backend di lokal,
                    skarang torang update juga tu data backend di firebase */
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

    const appointmentApprovalButtonHandler = el => {
        /*  Kalo depe status dari tu appointment yang torang da select
            itu 'awaiting', berarti belum ta approve.
            
            Maka kalo torang tekan tu tombol di itu card appointment,
            dia mo se muncul tu modal for mo approve itu appointment. */
        if(el.status == "awaiting") {
            setCurrentSelectedAppointment(el)

            setIsModalVisible(true)
        /*  Kalo dpe status so 'ongoing' berarti depe appointment so
            ta approve kong tinggal tunggu tu dokter yang mo konfirmasi
            kalo itu appointment so kelar ato belum.
            
            Dimana kalo tu appointment so kelar, tu tombol mo berfungsi
            for mo rubah status appointment dari 'ongoing' jadi
            'completed'. */
        } else if(el.status == "ongoing") {
            firebase.database()
                .ref(`appointments/${el.uid}`)
                //rubah status appointment yang da select jadi 'completed'
                .set({
                    ...el,
                    status: 'completed',
                })
                .then(() => {
                    /*  Update ulang tu roomCapacity di backend, se tambah
                        satu gegara satu appointment so kelar. */
                    backendData.setUserDetail({
                        ...backendData.getUserDetail(),
                        roomCapacity: backendData.getUserDetail().roomCapacity + 1
                    })

                    //update juga di backend firebase
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

    const getHospitalLocation = () => {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${backendData.getUserDetail().latitude}&lon=${backendData.getUserDetail().longitude}&format=json`)
            .then(resp => resp.json())
            .then(datajson => {
                setHospitalLocation(datajson.display_name)
            })
            .catch(error => {
                console.log("couldn't get location info of hospital in current appointment")
            })
    }

    useEffect(() => {
        /*  Bekeng supaya tiap kali ini screen muncul, fetchCurrentAppointment
            deng getHospitalLocation mo ta eksekusi */
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCurrentAppointments()
            getHospitalLocation()
        })

        /*  Khusus kalo ini screen baru pertama kali muncul, jalankan tu
            dua fungsi tadi */
        fetchCurrentAppointments()
        getHospitalLocation()

        return unsubscribe
    }, [navigation])

    return (
        <View style={styles.flex1}>
            <Header navigation={navigation} title="Dashboard" />
            {/* Card Hospital Info */}
            <View style={styles.flex1}>
                <View style={styles.hospitalInfoCardContainer}>
                    <Card>
                        <View>
                            <View style={styles.hospitalInfoHeader}>
                                <Text style={styles.hospitalInfoHeaderText}>Hospital Info</Text>
                            </View>
                            <View style={styles.profilePicContainer}>
                                <Image source={{uri: 'data:image/jpeg;base64,' + backendData.getUserDetail().profilePic}}
                                        style={styles.profilePic}
                                />
                                <View style={styles.hospitalInfoDetailContainer}>
                                    <Text style={styles.hospitalInfoDetailNameText}>{backendData.getUserDetail().name}</Text>
                                    <Text>{hospitalLocation.length > 32 ? hospitalLocation.substring(0, 31) + '...' : hospitalLocation}</Text>
                                    <Text>Capacity : {backendData.getUserDetail().roomCapacity}</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Card Current Appointment */}
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
                                                            <Text style={[styles.boldText, {marginTop: 15}]}>Phone Number</Text>
                                                            <Text>{el.phoneNum}</Text>
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
            </View>

            {/* Modal for mo ba approve appointment */}
            <Modal isVisible={isModalVisible} onBackButtonPress={() => setIsModalVisible(false)}>
                <View style={styles.flex1}>
                    <Card>
                        <View style={styles.innerModalCardContainer}>
                            <Text style={styles.modalTitleText}> Appointment Details </Text>
                            <Text style={styles.boldText}> Patient Name </Text>
                            <Text style={{marginBottom: 10}}> {currentSelectedAppointment.patientName}</Text>
                            <Text style={styles.boldText}> Phone Number </Text>
                            <Text style={{marginBottom: 20}}> {currentSelectedAppointment.phoneNum} </Text>
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
        fontWeight: 'bold'},
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
        fontWeight: 'bold'},
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

export default Dashboard
