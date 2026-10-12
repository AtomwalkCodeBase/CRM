import { View, Text, ScrollView, Image, StatusBar } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { colors } from '../Styles/appStyle'
import { getProfileInfo } from '../services/authServices';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  padding: 20px;
`;

const ProfileHeader = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 10px;
  border: 5px solid  #007bff;
`;

const EditIcon = styled.View`
  position: absolute;
  top: 80px;
  right: 115px;
  background-color: #007bff;
  padding: 5px;
  border-radius: 50px;
`;

const UserName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const Designation = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const EditProfileButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px 30px;
  border-radius: 25px;
`;

const EditProfileButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const ProfileOptions = styled.View`
  width: 100%;
  margin-top: 10px;
`;

const Option = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  width: 100%;
`;

const OptionText = styled.Text`
  flex: 1;
  font-size: 16px;
  color: #333;
  margin-left: 15px;
`;

const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const LogoutButtonText = styled.Text`
  color: #ff6347;
  font-size: 16px;
  margin-left: 10px;
`;
const ProfileScreen = ({ navigation }) => {
  const { logout, userToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([])
  const [isManager, setIsManager] = useState(false)
  const [userPin, setUserPin] = useState(null);
  // console.log("data--->",profile)

  useEffect(() => {
    setLoading(true)
    getProfileInfo()
      .then((res) => {
        // console.log(res.data)
        setProfile(res.data);
        setIsManager(res.data.user_group.is_manager);
        setLoading(false);
      })
      .catch((error) => {
        // console.log('error', error);
        setLoading(false);
        setIsManager(false);
      });
  }, []);
  useEffect(() => {
    const fetchUserPin = async () => {
      const storedPin = await AsyncStorage.getItem('userPin');
      setUserPin(storedPin); // storedPin will be `null` if no value is found
    };
    fetchUserPin();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Loader visible={loading} />
        <Header
          label='My Profile'
          image=''
          icon=''
          color={colors.blue}
          onPress={() => { }}
        />
        <ScrollView contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 10 }}>
          <Container>
            <ProfileHeader>
              <ProfileImage source={{ uri: profile.image }} />
              <UserName>{profile.user_name}</UserName>
              <Designation>Total task : {profile.total_task || "NA"}</Designation>
              <EditProfileButton onPress={() => navigation.navigate("ChangePassword")} >
                <EditProfileButtonText>{userPin ? "Update Your PIN" : "Set Your PIN"}</EditProfileButtonText>
              </EditProfileButton>
            </ProfileHeader>
            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
              <Text style={{ color: "#333", fontSize: 20, fontWeight: 'bold', flex: 1, paddingVertical: 0, alignSelf: 'flex-start' }}>Is Manager : </Text>
              {isManager ? <MaterialIcons name='check-box' size={30} color={"#007bff"} /> :
                <MaterialIcons name='cancel' size={30} color={colors.red} />}
            </View>
            <ProfileOptions>
              <Option>
                <Ionicons name="person-outline" size={20} color="#666" />
                <OptionText>Employee ID : {profile?.emp_data?.emp_id}</OptionText>
              </Option>
              <Option>
                <MaterialCommunityIcons name="office-building" size={20} color="#666" />
                <OptionText>Department : {profile?.emp_data?.department_name}</OptionText>
              </Option>
              {profile.mobile_number && <Option>
                <Octicons name="device-mobile" size={20} color="#666" />
                <OptionText>Mobile Number : {profile.mobile_number}</OptionText>
              </Option>}
            </ProfileOptions>
            <LogoutButton onPress={() => { logout() }}>
              <Ionicons name="log-out-outline" size={20} color="#ff6347" />
              <LogoutButtonText>Log out</LogoutButtonText>
            </LogoutButton>
          </Container>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen;