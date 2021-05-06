import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Header } from '../../../components/molecules'
import { Card, Button } from '../../../components/atoms'

const History = ({navigation}) => {

    const hospital = "RS Unklab"
    const address = "Airmadidi, North Sulawesi, 95695";
    const doctor = "Dr. Anodaly Thesaurus";
    const complaint = "I feel headache after eating a fo..."

    const date = "7 April 2021"

    return (
        <View>
            <Header navigation={navigation} title="History"/>
                <View>
                    <View style={{width: '100%', height: '100%'}}>
                        <View style={{marginBottom: 20}}>
                            <View style={styles.cardCA}>
                                <Card>
                                    <View>
                                        <View style={styles.headerCard}>
                                            <Text style={styles.headerTextCard}>Current Appointment</Text>
                                        </View>
                                        <View style={styles.bodyCard}>
                                            <View>
                                                <Text style={styles.headText}> {hospital}</Text>
                                                <View style={styles.bodyText}> 
                                                    <Text>{address}</Text>
                                                    <Text>Doctor : {doctor}</Text>
                                                </View>
                                                
                                            </View>
                                            <View>
                                                <Text style={styles.headText}> Complaint:</Text>
                                                <View style={styles.bodyText}>
                                                    <Text>{complaint}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Card>
                            </View>
                        </View>
                        
                        <ScrollView>
                            <View>
                                <View style={styles.cardPA}>
                                    <Card>
                                        <View >
                                            <View style={styles.headerCardHistory}>
                                                <Text style={styles.headerTextCard}>Past Appointment</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={styles.cardWrapper}>
                                                <Card>
                                                    <View style={styles.backgroundCardWrapper}>
                                                        <View style={styles.contentCard}>
                                                            <Card> 
                                                                <View style={styles.historyCard}>
                                                                    <Text style={styles.headText}>{hospital}</Text>
                                                                    <Text>{doctor}</Text>
                                                                    <Text>{date}</Text>
                                                                </View>
                                                            </Card>
                                                        </View> 
                                                    </View>                   
                                                </Card>
                                            </View>
                                        </View>
                                    </Card>
                                </View>
                            </View>    
                        </ScrollView>
                    </View>
                </View>
        </View>
    )
}

export default History

const styles = StyleSheet.create({
    cardCA : { //Current Appointment
        height: 220, 
        paddingHorizontal: 15, 
        paddingTop: 25,
    },
    cardPA:{ //Past Appointment
        height: '100%', 
        paddingHorizontal: 15, 
        paddingTop: 10,
    },
    cardWrapper:{
        height: 500, 
        paddingHorizontal: 20, 
        paddingTop: 20,  
    },
    backgroundCardWrapper: {
        backgroundColor: '#E0E0E0', 
        height: '100%',
    },
    contentCard:{
        height: 120, 
        paddingHorizontal:15, 
        paddingTop:20,
    },
    historyCard:{
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
        color: 'black',
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
