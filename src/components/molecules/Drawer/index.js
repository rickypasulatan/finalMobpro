import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React from 'react'
import { View, Text, TouchableNativeFeedback, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '../../atoms';
import firebase from '../../../config/firebase'

const Drawer = (props) => {
    const routes = [
        "Dashboard",
        "History",
        "Settings",
    ]

    const signOutHandler = () => {
        firebase.auth().signOut()
        .then(() => {
            props.navigation.replace("SignIn")
        })
    }
    
    return (
        <View {...props} style={{flex: 1}}>
            <View style={{flexDirection: 'column', flex: 1}}>
                <View style={{height: 110, justifyContent: 'center', alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                        <Image  source={require('../../../assets/HAMBURGER.png')} 
                                style={{
                                    transform: [{scale: 0.5}],
                                }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{height: 180, paddingTop: 15, alignItems: 'center'}}>
                    <View style={{width: 100, height: 100, borderRadius: 999, overflow: 'hidden', backgroundColor: 'white'}}>
                        {/* Taru foto profil disini */}
                    </View>
                    <Text style={{color: 'grey'}}>Profile</Text>
                    <Text style={{fontSize: 20}}>Nama disini</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    {
                        routes.map((el, idx) => 
                            <TouchableOpacity   key={idx} 
                                                onPress={() => props.navigation.navigate(el)}
                                                style={{paddingVertical: 15}}
                            >
                                <View>
                                    <Text>{el}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>
                <View style={{height: 80, paddingHorizontal: 50, justifyContent: 'center'}}>
                    <Button text="Sign Out" bgColor="#F4511E" onPress={signOutHandler}/>
                </View>
            </View>
        </View>
    )
}

export default Drawer
