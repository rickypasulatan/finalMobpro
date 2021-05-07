import React, {useState} from 'react'
import { View, Text } from 'react-native'
import { Header } from '../../../components/molecules'
import {Card, Button} from '../../../components/atoms'
import {TextInput} from '../../../components/atoms'
import { version } from '@babel/core'
import { color } from 'react-native-reanimated'

const Settings = ({navigation}) => {
    const [name, setName] = useState('');
    return (
        <View>
            <Header navigation={navigation} title="Settings"/>
            <View style={{width: '100%', height: '100%'}}>
                <View style={{height: 200, paddingHorizontal: 15, paddingTop: 25}}>
                    <Card>
                        <View>
                            <View style={{backgroundColor: '#6200EE', height: 50, justifyContent: 'center', paddingLeft: 15}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>Profile Picture</Text>
                            </View>
                            
                            <View style={{padding: 15}}></View>
                            <View style={{marginTop: 20, paddingHorizontal: 80}}>
                                <Button bgColor= '#F4511E' text="Change" textColor="black" />
                            </View>
                        </View>
                    </Card>
                </View>

                <View style={{width: '100%', height: '100%'}}>
                    <View style={{height: 250, paddingHorizontal: 20, paddingTop: 30}}>
                        <Card>
                            <View style={{backgroundColor: '#F4511E', height: 50, justifyContent: 'center', paddingLeft: 15}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Name</Text>
                            </View>
                            <View style={{padding: 15}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Enter new name</Text>
                                <View style={{marginTop: 20}}>
                                    <TextInput
                                        value={name}
                                        setValue={setName}
                                        placeholder="Name" />
                                </View>
                                <View style={{paddingLeft: 15}}>
                                    <View style={{marginTop: 20, paddingHorizontal: 80}}>
                                        <Button bgColor= '#6200EE' text="change" textColor='white' />
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </View>
                    <View style={{width: '100%', height: '100%'}}>
                        <View style={{height: 250, paddingHorizontal: 20, paddingTop: 30}}>
                            <Card>
                                <View style={{backgroundColor: '#6200EE', height: 50, justifyContent: 'center', paddingLeft: 15}}>
                                    <Text style={{fontsize: 18, fontWeight:'bold', color: 'white'}}>Password</Text>
                                </View>
                                <View style={{padding: 15}}>
                                    <Text style={{fontsize: 18, fontWeight: 'bold'}}>Enter new password</Text>
                                    <View style={{marginTop: 20}}>
                                        <TextInput
                                            value={name}
                                            setValue={setName}
                                            placeholder="********" />
                                    </View>
                                    <View style={{paddingLeft: 15}}>
                                        <View style={{marginTop: 20, paddingHorizontal: 80}}>
                                            <Button bgColor= '#F4511E' text='change' />
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </View>
                    </View>

                </View>
            </View>
        </View>
        
       
        
        
    );
};




export default Settings
