import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Header } from '../../../components/molecules'
import { Card, Button } from '../../../components/atoms'
import BackendDataContext from '../../../contexts/backendDataContext'

const History = ({navigation}) => {
    const backendData = useContext(BackendDataContext)
    const [appointments, setAppointments] = useState([])
    console.log(backendData.getAppointments())

    return (
        <ScrollView>
            <Header navigation={navigation} title="History"/>
            <View style={{width: '100%', height: '100%'}}>
                <View style={{marginBottom: 20}}>
                    {
                        backendData.getAppointments() != undefined && backendData.getAppointments().length > 0 && backendData.getAppointments()[0].status != 'completed' ?
                        <View style={styles.cardCA}>
                            <Card>
                                <View>
                                    <View style={styles.headerCard}>
                                        <Text style={styles.headerTextCard}>Current Appointment</Text>
                                    </View>
                                    <View style={styles.bodyCard}>
                                        <View>
                                            <Text style={styles.headText}> {backendData.getAppointments()[0].hospitalName}</Text>
                                            <View style={styles.bodyText}> 
                                                <Text>{backendData.getAppointments()[0].address}</Text>
                                                <Text>Doctor : {backendData.getAppointments()[0].doctorName}</Text>
                                            </View>
                                            
                                        </View>
                                        <View>
                                            <Text style={styles.headText}> Complaint:</Text>
                                            <View style={styles.bodyText}>
                                                <Text>{backendData.getAppointments()[0].complaint}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </View>
                        :
                        <View></View>
                    }
                </View>
                
                <View style={styles.cardPA}>
                    <Card>
                        <View style={styles.headerCardHistory}>
                            <Text style={styles.headerTextCard}>Past Appointment</Text>
                        </View>
                        <ScrollView style={{flex: 1, backgroundColor: '#E0E0E0', margin: 15, padding: 5, borderRadius: 25}}>
                            {
                                backendData.getAppointments().map((el, idx) =>
                                    <View style={{overflow: 'hidden', borderRadius: 25, marginBottom: 10}}>
                                        <Card>
                                            <View style={{padding: 15}}>
                                                <Text>{el.hospitalName}</Text>
                                                <Text>Doctor - {el.doctorName}</Text>
                                                <Text>{el.date}</Text>
                                            </View>
                                        </Card>
                                    </View>
                                )
                            }
                        </ScrollView>
                    </Card>
                </View>
            </View>
        </ScrollView>
    )
}

export default History

const styles = StyleSheet.create({
    cardCA : { //Current Appointment
        height: 240, 
        paddingHorizontal: 15, 
        paddingTop: 25,
    },
    cardPA:{ //Past Appointment
        height: 400, 
        paddingHorizontal: 15, 
        paddingTop: 10,
        marginBottom: 45,
    },
    cardWrapper:{
        flex: 1, 
        paddingHorizontal: 20, 
        paddingTop: 20,  
    },
    contentCard:{
        height: 120, 
        paddingHorizontal:15, 
        paddingTop:20,
    },
    historyCard:{
        backgroundColor: '#E0E0E0',
        paddingTop:10, 
        paddingHorizontal: 10,
    },
    headerCard: {
        backgroundColor: '#F4511E', 
        height: 50, 
        justifyContent: 'center', 
        paddingLeft: 15,
    },
    headerCardHistory: {
        backgroundColor: '#6200EE',
        height: 50, 
        justifyContent: 'center', 
        paddingLeft: 15,
    },
    headerTextCard: {
        fontSize: 18, 
        fontWeight: 'bold', 
        color: 'white',
    },
    bodyCard: {
        padding: 15,
    },
    headText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bodyText: {
        fontSize: 15,
        paddingLeft: 5,
    },
})
