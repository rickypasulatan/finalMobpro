import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import {Button, Card} from '../../components/atoms'
import TextInput from '../../components/atoms/TextInput'
import {Picker} from '@react-native-picker/picker'

const SignUp = ({navigation}) => {
    const [selectedValue, setSelectedValue] = useState('patient')

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/healthwell.png')} style={styles.healthWellLogo}/>
            <View style={styles.cardContainer}>
                <Card>
                    <View style={styles.innerCardContainer}>
                        <Text style={styles.userTypeText}> User Type </Text>
                        
                        <View style={styles.textInputGroup}>
                            <Text style={styles.labelText}> Register As </Text>
                            <View style={styles.pickerSection}>
                                <Picker selectedValue={selectedValue}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setSelectedValue(itemValue)
                                        }}
                                >
                                    <Picker.Item label="Patient" value="patient"/>
                                    <Picker.Item label="Hospital" value="hospital"/>
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.nextButton}>
                            <Button     bgColor='#6200EE' 
                                        text="Next" 
                                        textColor='white'
                                        onPress={() => 
                                            selectedValue === 'patient' ?
                                            navigation.navigate("SignUpPatient")
                                            :
                                            navigation.navigate("SignUpHospital")
                                        }
                            />
                        </View>
                    </View>
                </Card>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  healthWellLogo: {
    transform: [{scale: 0.5}]
  },
  container: {
    backgroundColor: '#F4511E',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    height: 230,
    width: 350,
  },
  innerCardContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 37,
  },
  userTypeText: {
    fontWeight: 'bold',
    marginBottom: 25,
  },
  pickerSection: {
    backgroundColor: '#F3F3F3',
    borderRadius: 15,
  },
  nextButton: {
    width: 150,
  },
  labelText: {
    fontWeight: 'bold',
  },
  textInputGroup: {
    paddingVertical: 9,
    alignSelf: 'stretch',
  },
});

export default SignUp
