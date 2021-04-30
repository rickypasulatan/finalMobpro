import React, { Children } from 'react'
import { View, Text } from 'react-native'

const Card = ({children}) => {
    return (
        <View style={{flex: 1, elevation: 24, borderRadius: 25, backgroundColor: 'white', overflow: 'hidden'}}>
            {children}
        </View>
    )
}

export default Card
