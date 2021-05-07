import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Header} from '../../../components/molecules';
import {Card, Button} from '../../../components/atoms';
import {TextInput} from '../../../components/atoms';

const Settings = ({navigation}) => {
  const [name, setName] = useState('');
  return (
    <View>
      <Header navigation={navigation} title="Settings" />
      <View style={{width: '100%', height: '100%'}}>
        <View style={{height: 250, paddingHorizontal: 25, paddingTop: 30}}>
          <Card>
            <View>
              <View
                style={{
                  backgroundColor: '#F4511E',
                  height: 50,
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Name</Text>
              </View>
              <View style={{padding: 15}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Enter new name
                </Text>
                <View style={{marginTop: 20}}>
                  <TextInput
                    value={name}
                    setValue={setName}
                    placeholder="RS Unklab"
                  />
                </View>
                <View style={{marginTop: 20, paddingHorizontal: 80}}>
                  <Button bgColor="#6200EE" text="Change"/>
                </View>
              </View>
            </View>
          </Card>
        </View>
        <View style={{height: 250, paddingHorizontal: 25, paddingTop: 30}}>
          <Card>
            <View>
              <View
                style={{
                  backgroundColor: '#6200EE',
                  height: 50,
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
                  Password
                </Text>
              </View>
              <View style={{padding: 15}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Enter new password
                </Text>
                <View style={{marginTop: 20}}>
                  <TextInput
                    value={name}
                    setValue={setName}
                    placeholder="**********"
                  />
                </View>
                <View style={{marginTop: 20, paddingHorizontal: 80}}>
                  <Button bgColor="#F4511E" text="Change" textColor="black" />
                </View>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </View>
  );
};

export default Settings;
