import { View, Text, ScrollView, Linking, StatusBar } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { colors } from '../../Styles/appStyle';
import Loader from '../../components/Loader';
import DetailCard from "../../components/DetailCard";
import Header from '../../components/Header';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { UpdateGeoLocations } from '../../services/productServices';
import { AuthContext } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
const MapContainer = styled.View`
  /* margin-top: 20px; */
  height: 100%;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
`;


const ButtonSection = styled.View`
  flex-direction: row;
  z-index: 1;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 40px;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 10px;
  padding-left: 19px;
  margin-bottom: 10px;
  border: 1px solid #0548E4;
  border-radius: 15px;
  width: 48%;
  elevation: 3; /* Add shadow for Android */
  shadow-color: #000; /* Add shadow for iOS */
  /* shadow-offset: { width: 0, height: 2 }; */
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;
const ActionButton2 = styled.TouchableOpacity`
  align-items: center;
  background-color: ${(props) => props.backgroundColor || 'transparent'};
  padding: 10px;
  padding-left: 19px;
  margin-bottom: 10px;
  border: 1px solid #454545;
  border-radius: 15px;
  width: 100%;
  elevation: 3; /* Add shadow for Android */
  shadow-color: #000; /* Add shadow for iOS */
  /* shadow-offset: { width: 0, height: 2 }; */
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;
const ActionButton1 = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${(props) => props.backgroundColor || 'rgb(50 205 51)'};
  align-items: center;
  padding: 10px;
  padding-left: 19px;
  margin-bottom: 10px;
  border: 1px solid #454545;
  border-radius: 15px;
  width: 46%;
  elevation: 3; /* Add shadow for Android */
  shadow-color: #000; /* Add shadow for iOS */
  /* shadow-offset: { width: 0, height: 2 }; */
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.color || '#0548E4'};
  margin-left: 5px;
  text-align: center;
  font-weight: 500;
`;
const ButtonText1 = styled.Text`
  font-size: 14px;
  color: #fff;
  margin-left: 5px;
  text-align: center;
`;

const TaskDetailScreen = ({ route, navigation }) => {

  // console.log('PARAMS', route.params)
  // const[lcType,setLctype]=useState("n");
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [showalert, setShowalert] = useState(false);
  const { setRefs, refs } = useContext(AuthContext);
  const { companyInfo, dbName, userToken } = useContext(AuthContext);
  // console.log(refs,"value")
  // console.log(companyInfo,"companydata--->1")
  useEffect(() => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}:${seconds}`);
  }, []);
  const [showMap, setShowMap] = useState(false); // State to control map visibility
  const [data, setData] = useState(route.params.data);
  const [location, setLocation] = useState({
    latitude: data && data.geo_data[data.geo_status == "I" ? 0 : 1]?.latitude_id ? parseFloat(data.geo_data[data.geo_status == "I" ? 0 : 1].latitude_id) : 0,
    longitude: data && data.geo_data[data.geo_status == "I" ? 0 : 1]?.longitude_id ? parseFloat(data.geo_data[data.geo_status == "I" ? 0 : 1].longitude_id) : 0
  });
  const screen = route.params.screen
  const openMap = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      Linking.openURL(url);
    } else {
      alert('No Location Set', 'Please use "Start In" to set your current location first.');
    }
  };
  const handleCheckIn = () => {
    if (location.latitude && location.latitude) {
      setShowMap(true);
    } else {
      alert('No Location Set', 'Please use "Start In" to set your current location first.');
    }
  };
  const getLocation = async (data, messages) => {
    setLoading(true);
    setMessage(messages)
    const servicesEnabled = await Location.hasServicesEnabledAsync();

    if (!servicesEnabled) {
      setErrorMsg('Location services are not available on this device.');
      setLoading(false);
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setLoading(false);
      return;
    }
    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation(coords);
    setTimeout(() => {
      updateLocation(data, coords)
    }, 1000);
  };

  const onBackPressed = () => {
    navigation.pop();
  }


  const handleUpadteTask = () => {
    if (screen == 'TaskDetail') {
      navigation.navigate('UpdateTask',
        {
          id: data.id, name: data.name, task_type: data.task_type, task_date: data.task_date,
          start_time: data.start_time, remarks: data.remarks, screen: screen, callMode: 'Update'
        });
    }
    else if (screen == 'CustTaskDetail' || screen == 'LeadTaskDetail') {
      navigation.navigate('CustUpdateTask',
        {
          id: data.id, name: data.name, task_type: data.task_type, task_date: data.task_date,
          start_time: data.start_time, remarks: data.remarks, screen: screen, callMode: 'Update'
        });
    }
    else {
      console.log('NOT VALID Screen');
    }

  }
  // console.log('Screenname', data);
  const handleAssignUser = () => {

    if (screen == 'TaskDetail') {
      navigation.navigate('UpdateTask',
        {
          id: data.id, name: data.name, task_type: data.task_type, task_date: data.task_date,
          curr_user: data.curr_user ? data.curr_user.id : '', remarks: data.remarks,
          screen: screen, callMode: 'AssignUser'
        });
    }
    else if (screen == 'CustTaskDetail' || screen == 'LeadTaskDetail') {
      navigation.navigate('CustUpdateTask',
        {
          id: data.id, name: data.name, task_type: data.task_type, task_date: data.task_date,
          curr_user: data.curr_user ? data.curr_user.id : '', remarks: data.remarks,
          screen: screen, callMode: 'AssignUser'
        });
    }
    else {
      console.log('NOT VALID Screen');
    }

  }

  const handleMarkComplete = () => {
    // console.log('handleMarkComplete', screen);
    if (screen == 'TaskDetail') {
      navigation.navigate('UpdateTask',
        {
          id: data.id, name: data.name, task_type: data.task_type, task_date: data.task_date,
          start_time: data.start_time, remarks: data.remarks, screen: screen, callMode: 'MarkCompleted'
        });
    } else if (screen == 'CustTaskDetail' || screen == 'LeadTaskDetail') {
      navigation.navigate('CustUpdateTask',
        {
          id: data.id, name: data.name, task_type: data.task_type, task_date: data.task_date,
          start_time: data.start_time, remarks: data.remarks, screen: screen, callMode: 'MarkCompleted'
        });
    }
    else {
      console.log('NOT VALID Screen');
    }

  }
  const updateLocation = async (lcType, location) => {
    await UpdateGeoLocations({
      id: data.id,
      geo_type: lcType,
      latitude_id: `${location && location.latitude}`,
      longitude_id: `${location && location.longitude}`,
      time: currentTime
    }).then((res) => {
      setLoading(false);
      setShowalert(true);
    })
      .catch((error) => {
        alert('Something went wrong');

      });

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header
          label='Task Details'
          image=''
          icon='arrow-left'
          onPress={onBackPressed}
        // subTitle={data.name}

        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>

          {!showMap && <View style={{ marginHorizontal: 10 }}>
            <DetailCard colour={colors.grey}
              title={data.customer ? 'Customer : ' + data.customer.name : data.lead ? 'Lead :' + data.lead.name : data.name}
              subTitle={data.start_time ? 'Task :' + data.task_type_display + ' [ START : ' + data.start_time + ' ]' : 'Task :' + data.task_type_display}
              date={data.task_date}
              dateTitle='Task Date'
              imageUrl={data.curr_user ? data.curr_user.image : data.owner.image}
              imageLabel={data.curr_user ? data.curr_user.user_name : data.owner.user_name}
              subInfo={data.remarks}
              status={data.task_status}
              statusColour={(data.task_status == 'Completed') ? colors.green : colors.secondary}
              name={data.name}
            />
            <ButtonSection>
              {companyInfo.is_geo_start_location && <ActionButton onPress={() => getLocation("S", "You have successfully start in your location!")}>
                <MaterialIcons name="timer" size={24} color="#0548E4" />
                <ButtonText>Start In</ButtonText>
              </ActionButton>}
              {(data.geo_status == "I" || data.geo_status == "O") && (companyInfo.is_geo_location_enabled == "B" || companyInfo.is_geo_location_enabled == "C") ?
                <ActionButton1 onPress={() => handleCheckIn()}>
                  <MaterialIcons name="location-on" size={24} color="#fff" />
                  <ButtonText1>Checked In at {data && data.geo_data[data.geo_data.some(item => item.geo_type == 'S') ? 1 : 0]?.time.slice(0, 5)}</ButtonText1>
                  {/* <ButtonText1>time:{data && data.geo_data[data.geo_status=="I"?0:1]?.time}</ButtonText1> */}
                </ActionButton1> :
                (companyInfo.is_geo_location_enabled == "B" || companyInfo.is_geo_location_enabled == "C") && <ActionButton onPress={() => getLocation("I", "You have successfully checked in your location!")}>
                  <MaterialIcons name="location-on" size={24} color="#0548E4" />
                  <ButtonText>Check In</ButtonText>
                </ActionButton>}
              {data.geo_status == "I" && (companyInfo.is_geo_location_enabled == "B" || companyInfo.is_geo_location_enabled == "C") ? <ActionButton onPress={() => getLocation("O", "You have successfully checked out your location!")}>
                <MaterialIcons name="logout" size={24} color="#0548E4" />
                <ButtonText>Check Out</ButtonText>
              </ActionButton> : data.geo_status == "O" && (companyInfo.is_geo_location_enabled == "B" || companyInfo.is_geo_location_enabled == "C") && <ActionButton1 backgroundColor="tomato" onPress={() => alert("You have already checked out your location!")}>
                <MaterialIcons name="logout" size={24} color="#fff" />
                <ButtonText1>Checked out at {data && data.geo_data[data.geo_data.length - 1]?.time.slice(0, 5)}</ButtonText1></ActionButton1>}
            </ButtonSection>
            <View style={{ alignItems: "center", marginTop: "5%" }}>
              <ActionButton2 backgroundColor="#ffa500" onPress={handleUpadteTask}>
                {/* <MaterialIcons name="edit" size={24} color="#0548E4" /> */}
                <ButtonText color="#454545">Update Task</ButtonText>
              </ActionButton2>
              <ActionButton2 backgroundColor="rgb(50 205 51)" onPress={handleMarkComplete}>
                {/* <MaterialIcons name="check-circle" size={24} color="#0548E4" /> */}
                <ButtonText color="#fff">Mark Completed</ButtonText>
              </ActionButton2>
              <ActionButton2 backgroundColor="red" onPress={handleAssignUser}>
                {/* <MaterialIcons name="person-add" size={24} color="#0548E4" /> */}
                <ButtonText color="#fff">Assign To User</ButtonText>
              </ActionButton2>
            </View>
          </View>}
          {showMap && location && (
            <MapContainer>
              <MapView
                style={{ height: '100%', width: '100%' }}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Check In Location"
                />
              </MapView>
            </MapContainer>
          )}
          {showalert && <CustomAlert data={data} screen={screen} message={message} route={route} navigation={navigation} showalert={showalert} name={data.name}></CustomAlert>}
          <Loader visible={loading} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TaskDetailScreen