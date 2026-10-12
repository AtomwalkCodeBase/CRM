
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import PinPopup from '../components/PinPopup';
import { getProfileInfo } from '../services/authServices';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const { companyInfo } = useContext(AuthContext);
  const [isManagers, setIsManagers] = useState(false);

  useEffect(() => {
    getProfileInfo()
      .then((res) => {
        setIsManagers(res?.data.user_group.is_manager);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const onSelect = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={
              companyInfo && typeof companyInfo?.image === 'string'
                ? { uri: companyInfo.image }
                : require('../../assets/images/Atom_walk_logo.jpg')
            }
            style={styles.profileImage}
          />
          <Text style={styles.title}>{companyInfo ? companyInfo.name : ''}</Text>
          <Text style={styles.welcomeText}>Welcome to Atomwalk Office</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.listContainer}>
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: '#e1e5fc' }]}
              onPress={() => navigation.navigate('CustomerScreen')}
            >
              <View style={styles.iconBackground}>
                <Icon name="people-outline" size={30} color="#fff" />
              </View>
              <Text style={styles.listText}>My Customers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: '#e1e5fc' }]}
              onPress={() => navigation.navigate('OrderList', { cust_id: '', cust_name: '' })}
            >
              <View style={styles.iconBackground}>
                <Icon name="file-tray-full-outline" size={30} color="#fff" />
              </View>
              <Text style={styles.listText}>Invoice Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: '#e1e5fc' }]}
              onPress={() => navigation.navigate('LeadScreen')}
            >
              <View style={styles.iconBackground}>
                <FontAwesome6 name="people-group" size={25} color="#fff" />
              </View>
              <Text style={styles.listText}>My Leads</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: '#e1e5fc' }]}
              onPress={() => navigation.navigate('AddNewLead', { task: null, scan: true })}
            >
              <View style={styles.iconBackground}>
                <AntDesign name="scan" size={24} color="#fff" />
              </View>
              <Text style={styles.listText}>Scan Lead</Text>
            </TouchableOpacity>
            {isManagers && (
              <TouchableOpacity
                style={[styles.listItem, { backgroundColor: '#e1e5fc' }]}
                onPress={() => navigation.navigate('Status')}
              >
                <View style={styles.iconBackground}>
                  <Entypo name="bar-graph" size={24} color="#fff" />
                </View>
                <Text style={styles.listText}>Product Interest</Text>
              </TouchableOpacity>
            )}
            {isManagers && (
              <TouchableOpacity
                style={[styles.listItem, { backgroundColor: '#e1e5fc' }]}
                onPress={() => navigation.navigate('ProductCatalog')}
              >
                <View style={styles.iconBackground}>
                  <Entypo name="shop" size={30} color="#fff" />
                </View>
                <Text style={styles.listText}>Product Catalogue</Text>
              </TouchableOpacity>)}
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: '#e1e5fc' }]}
              onPress={() => navigation.navigate('Company')}
            >
              <View style={styles.iconBackground}>
                <Icon name="business-outline" size={30} color="#fff" />
              </View>
              <Text style={styles.listText}>Company Info</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <PinPopup navigation={onSelect} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',

  },
  header: {
    backgroundColor: '#4285f4',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 105,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10,
    resizeMode: 'stretch',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  listItem: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: (screenWidth - 60) / 2, // Dynamic width calculation
    marginBottom: 20,
    elevation: 3,
  },
  listText: {
    fontSize: 16,
    color: '#454545',
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  iconBackground: {
    width: 60,
    height: 60,
    backgroundColor: '#4285f4',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
