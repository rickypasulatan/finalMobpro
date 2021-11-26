import React, { Children } from 'react'
import { View, Text, StyleSheet } from 'react-native'

/**
 * Komponen Card,
 * 
 * ini komponen bekerja sebagai pembungkus, mar so ada dpe styling yang 
 * bekeng dia dapa lia rupa card.
 * @param {JSX.Element} children - komponen yang mo isi di dalam ini card 
 * @returns {JSX.Element}
 */
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
