import React from 'react'
import { View, Text } from 'react-native'
import { Header } from '../../../components/molecules'

const Dashboard = ({navigation}) => {
    return (
        <View>
            <Header navigation={navigation} title="Dashboard"/>
            <View style={{width: '100%', height: '100%'}}>
                <View style={{height: 200, paddingHorizontal: 15, paddingTop: 25}}>
                    <Card>
                        <View>
                            <View style={{backgroundColor: '#6200EE', height: 50, justifyContent: 'center', paddingLeft: 15}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>Taru judul disini</Text>
                            </View>
                            <View style={{padding: 15}}>
                                <Text> konten Disini</Text>
                                <Button bgColor='#6200EE' text="testing" textColor="white"/>
                            </View>
                        </View>
                    </Card>
                </View>
            </View>
        </View>
    )
}

export default Dashboard
