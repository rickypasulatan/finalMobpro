import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useContext, useEffect } from 'react'
import { View, Text, TouchableNativeFeedback, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '../../atoms';
import firebase from '../../../config/firebase'
import BackendDataContext from '../../../contexts/backendDataContext';

/**
 * Komponen Drawer
 * @param {DrawerContentComponentProps<DrawerContentOptions>} props - props yang Drawer.Navigator mo passing
 * @returns {JSX.Element}
 */
const Drawer = (props) => {
    const routes = props.routes;
    const backendData = useContext(BackendDataContext)

    const signOutHandler = () => {
        firebase.auth().signOut()
        .then(() => {
            props.navigation.replace("SignIn")
        })
    }
    
    return (
        <View {...props} style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.hamburgerSection}>
                    <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                        <Image  source={require('../../../assets/HAMBURGER.png')} 
                                style={styles.hamburgerIcon}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.profilePicSection}>
                    <View style={styles.profilePicContainer}>
                        <Image  source={{uri: 'data:image/jpeg;base64,'+backendData.getUserDetail().profilePic}}
                                style={styles.profilePicImage}
                        />
                    </View>
                    <Text style={styles.profileText}>Profile</Text>
                    <Text style={styles.profileNameText}>{backendData.getUserDetail().name}</Text>
                </View>
                <View style={styles.menuItemsSection}>
                    {
                        routes.map((el, idx) => 
                            <TouchableOpacity   key={idx} 
                                                onPress={() => props.navigation.navigate(el)}
                                                style={styles.menuItems}
                            >
                                <View>
                                    <Text>{el}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>
                <View style={styles.signOutButton}>
                    <Button text="Sign Out" bgColor="#F4511E" onPress={signOutHandler}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1},
    innerContainer: {flexDirection: 'column', flex: 1},
    hamburgerSection: {height: 110, justifyContent: 'center', alignItems: 'flex-end'},
    hamburgerIcon: {
        transform: [{scale: 0.5}],
    },
    profilePicSection: {height: 180, paddingTop: 15, alignItems: 'center'},
    profilePicContainer: {width: 100, height: 100, borderRadius: 999, overflow: 'hidden', backgroundColor: 'white'},
    profilePicImage: {width: 100, height: 100},
    profileText: {color: 'grey'},
    profileNameText: {fontSize: 20},
    menuItemsSection: {flex: 1, alignItems: 'center'},
    menuItems: {paddingVertical: 15},
    signOutButton: {height: 80, paddingHorizontal: 50, justifyContent: 'center'},
})

export default Drawer
