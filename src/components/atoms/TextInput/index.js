import React, { useState } from 'react'
import { TextInput as Input, View, Text, StyleSheet } from 'react-native'

/**
 * fungsi yang mo set tu variabel 'value' jadi apa yang ada di ini TextInput
 * 
 * @callback setValue
 * @param {string} inputDariUser
 */

/**
 * fungsi yang mo validasi tu input dari user
 * 
 * @callback validation
 * @param {string} teksYangMoValidasi
 * @returns {string} - mo return string yang berisi pesan error, kalo ada error. Kalo nda, dia mo return string kosong
 */

/**
 * fungsi yang mo lakukan proses filtering dari tu input user
 * 
 * @callback filter
 * @param {string} teksYangMoFilter 
 * @returns {string} - mo return string yang so ta filter
 */

/**
 * Komponen TextInput
 * @param {string} placeholder - teks yang muncul pas dpe TextInput kosong
 * @param {string} value - variabel yang tampung tu isi dari ini TextInput
 * @param {setValue} setValue - fungsi yang mo set tu variabel 'value' jadi apa yang ada di ini TextInput
 * @param {validation} validation - fungsi yang mo validasi tu input dari user
 * @param {filter} filter - fungsi yang mo lakukan proses filtering dari tu input user
 * @param {bool} isPassword - kalo ini props di definisikan, berarti ini TextInput mo berperilaku sebagai input for password
 * @returns {JSX.Element}
 */
const TextInput = ({placeholder, value, setValue, validation, filter, isPassword}) => {
    const [isValid, setIsValid] = useState('')
    const [borderStyle, setBorderStyle] = useState({borderWidth: 0})

    //fungsi yang mo dipanggil tiap kalo isi dari TextInput berubah
    const onChangeHandler = ({nativeEvent: {text: e}}) => {
        if(validation == undefined) validation = e => ''    /*  Kalo misal props 
                                                                validation nda ada,
                                                                bekeng fungsi dummy
                                                                jo yang langsung return
                                                                string kosong */
        if(filter == undefined) filter = e => e             /*  Kalo misal props
                                                                filter nda ada,
                                                                bekeng fungsi dummy
                                                                jo yang langsung return
                                                                ulang tu parameter */
        
        let error = validation(e)   // mo berisi string non-kosong kalo misal ada error
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
