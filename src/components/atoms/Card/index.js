import React, { Children } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Card = ({children}) => {
    return (
        <View style={styles.cardContainer}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1, 
        elevation: 24, 
        borderRadius: 25, 
        backgroundColor: 'white', 
        overflow: 'hidden'
    }
})

export default Card
