import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {Button, Card} from '../../../components/atoms';
import {Header} from '../../../components/molecules';

const Dashboard = ({navigation}) => {
  const patientName = 'Ben Dover';
  const patientAddress = 'Airmadidi, North Sulawesi';
  const hospitalName = 'RS Unklab';
  const hospitalAddress = 'Airmadidi, North Sulawesi, 95695';
  const doctor = 'Dr. Anodaly Thesaurus';
  const pfp = '../../../assets/Ben.png';
  const complaint =
    'I feel headache after eating a food fr...';

  return (
    <View>
      <Header navigation={navigation} title="Dashboard" />
      <ScrollView>
        <View style={{height: 200, paddingHorizontal: 15, paddingTop: 25}}>
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
                  User Info
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{padding: 10}}>
                  <Image
                    source={require(pfp)}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 150,
                    }}
                  />
                </View>
                <View
                  style={{padding: 5, alignContent: 'center', paddingTop: 35}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    {patientName}
                  </Text>

                  <Text style={{fontSize: 16}}>{patientAddress}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
        {/* <View style={{height: 400, paddingHorizontal: 15, paddingTop: 25}}>
          <Card>
            <View>
              <View
                style={{
                  backgroundColor: '#838383',
                  height: 50,
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
                  Current Appointment
                </Text>
              </View>

              <View style={{flexDirection:'column'}}>
                <View style={{padding:30, paddingTop: 80, paddingHorizontal: 80,alignItems:'center'}}>
                  <Text style={{fontSize: 18, color: '#838383', textAlign:'center'}}>
                    There are currently no appointment
                  </Text>
                </View>
                <View style={{padding:70, paddingHorizontal:60}}>
                  <Button
                    bgColor="#F4511E"
                    text="Create Appointment"
                    textColor="white"
                  />
                </View>
              </View>
            </View>
          </Card>
        </View> */}
        <View style={{height: 270, paddingHorizontal: 15, paddingTop: 25, marginBottom: 100}}>
          <Card>
            <View>
              <View
                style={{
                  backgroundColor: '#F5411E',
                  height: 50,
                  justifyContent: 'center',
                  paddingLeft: 15,
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
                  Current Appointment
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  paddingHorizontal: 15,
                  paddingTop: 25,
                }}>
                <View style={{paddingBottom: 30}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    {hospitalName}
                  </Text>
                  <Text style={{fontSize: 16}}>{hospitalAddress}</Text>
                  <Text style={{fontSize: 16}}>Doctor - {doctor}</Text>
                </View>
                <View style={{paddingRight: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    Complaint:
                  </Text>
                  <Text style={{fontSize: 16}}>{complaint}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
