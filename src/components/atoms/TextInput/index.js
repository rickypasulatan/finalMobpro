import React, { useState } from 'react'
import { TextInput as Input, View, Text, StyleSheet } from 'react-native'

const TextInput = ({placeholder, value, setValue, validation, filter, isPassword}) => {
    const [isValid, setIsValid] = useState('')
    const [borderStyle, setBorderStyle] = useState({borderWidth: 0})

    const onChangeHandler = ({nativeEvent: {text: e}}) => {
        if(validation == undefined) validation = e => ''
        if(filter == undefined) filter = e => e
        
        let error = validation(e)
        setIsValid(error)
        error ? setBorderStyle({borderWidth: 1, borderColor: 'red'}) : setBorderStyle({borderWidth: 0})
        const filteredText = filter(e)
        setValue(filteredText)
    }

    return (
        <Input  style={[styles.inputField, borderStyle]}
                placeholder={placeholder}
                value={value}
                onChange={onChangeHandler}
                secureTextEntry={isPassword}
                onFocus={e => isValid ? setBorderStyle({borderWidth: 1, borderColor: 'red'}) : setBorderStyle({borderWidth: 0})}
                onBlur={e => isValid ? setBorderStyle({borderWidth: 1, borderColor: 'red'}) : setBorderStyle({borderWidth: 0})}
        />
    )
}

const styles = StyleSheet.create({
    inputField: {
        backgroundColor: '#F3F3F3',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    }
})

export default TextInput
