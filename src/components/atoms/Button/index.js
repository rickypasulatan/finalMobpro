import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const Button = ({text, bgColor, textColor, onPress}) => {
    const buttonBgColor = {
        backgroundColor: bgColor
    }

    return (
        <TouchableOpacity style={[styles.buttonContainer, buttonBgColor]} onPress={onPress}>
            <Text style={{color: textColor, paddingVertical: 5}}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Button
