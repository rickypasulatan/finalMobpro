import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const Button = ({text, bgColor, textColor, onPress}) => {
    const buttonBgColor = {
        backgroundColor: bgColor
    }

    return (
        <TouchableOpacity style={[styles.buttonContainer, buttonBgColor]} onPress={onPress}>
            <Text style={[styles.buttonText, {color: textColor}]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        paddingVertical: 5
    }
})

export default Button
