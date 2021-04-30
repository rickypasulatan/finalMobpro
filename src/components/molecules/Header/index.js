import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

const Header = ({navigation, title}) => {
    return (
        <View style={{height: 90, backgroundColor: 'white', paddingTop: 25, flexDirection: 'row', elevation: 25}}>
            <TouchableOpacity   style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} 
                                onPress={() => navigation.openDrawer()}
            >
                <Image  source={require('../../../assets/HAMBURGER.png')} 
                        style={{
                            transform: [{scale: 0.375}],
                        }}
                />
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>{title}</Text>
            </TouchableOpacity>
            <Image  source={require('../../../assets/healthwell2.png')}
                    style={{
                        transform: [{scale: 0.375}, {translateX: 50}, {translateY: -77}],
                    }}
            />
        </View>
    )
}

export default Header
