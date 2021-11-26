import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

/**
 * Komponen Header
 * 
 * @param {any} navigation - props yang React Navigator kase kalo ini komponen ada didalam navigation container
 * @param {string} title - judul dari ini halaman 
 * @returns 
 */
const Header = ({navigation, title}) => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity   style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} 
                                onPress={() => navigation.openDrawer()}
            >
                <Image  source={require('../../../assets/HAMBURGER.png')} 
                        style={styles.hamburgerIcon}
                />
                <Text style={styles.pageTitle}>{title}</Text>
            </TouchableOpacity>
            <Image  source={require('../../../assets/healthwell2.png')}
                    style={styles.healthWellLogo}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {height: 90, backgroundColor: 'white', paddingTop: 25, flexDirection: 'row', elevation: 25},
    hamburgerIcon: {
        transform: [{scale: 0.375}],
    },
    pageTitle: {fontSize: 24, fontWeight: 'bold'},
    healthWellLogo: {
        transform: [{scale: 0.375}, {translateX: 50}, {translateY: -77}],
    },
})

export default Header
