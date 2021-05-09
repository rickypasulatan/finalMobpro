import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

/**
 * Komponen tombol
 * @param {string} text - tu teks yang mo se muncul
 * @param {string} bgColor - tu warna background di tombol
 * @param {string} textColor - tu warna teks di tombol
 * @param {string} onPress - fungsi callback yang mo ta pangge pas ini tombol ditekan
 * @returns {JSX.Element}
 */
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
