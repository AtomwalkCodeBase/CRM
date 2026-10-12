import { View, FlatList, Text, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getUserTasks } from '../../services/productServices';
import CardItem from '../../components/CardItem';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { colors } from '../../Styles/appStyle';
import Loader from '../../components/Loader';
import SearchInput from '../../components/SearchInput';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomerTasks = ({ route, navigation }) => {

    // console.log('param', route.params);

    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customerId, setCustomerId] = useState(route.params.customer_id);
    const [leadId, setLeadId] = useState(route.params.lead_id);
    // console.log(data,data.length,"data---->")
    const customer_name = route.params.name
    const refresh = route.params
    const companyname = route.params?.Company_name
    useEffect(() => {
        setLoading(true);
        getUserTasks('ALL', customerId, leadId).then((res) => {
            setData(res.data);
            setFilterData(res.data);
            setLoading(false);
        })
            .catch((error) => {
                setLoading(false)
            });
    }, [refresh]);

    const handleNavigation = () => {
        if (customerId) {
            navigation.navigate("AddCustomerTask", { customer_id: customerId, selected_type: 'C', })
        } else {
            navigation.navigate("AddCustomerTask", { customer_id: leadId, selected_type: 'L', Company_name: companyname })
        }
    }

    const onBackPressed = () => {
        navigation.pop();
    }

    const handleIconPress = (data) => {
        navigation.navigate('CustUpdateTask',
            {
                id: data.id, name: data.name, task_type: data.task_type, task_date: data.task_date,
                curr_user: data.curr_user ? data.curr_user.id : '', remarks: data.remarks,
                screen: customerId ? 'CustTaskDetail' : 'LeadTaskDetail', callMode: 'AssignUser'
            });

    }


    const handleIconName1Press = (data) => {
        if (customerId) {
            navigation.navigate('CustTaskDetail', { data: data, screen: 'CustTaskDetail' });
        } else {
            navigation.navigate('CustTaskDetail', { data: data, screen: 'LeadTaskDetail' });
        }
    }

    const serchFilter = (text) => {
        // console.log(text)
        if (text) {
            const newData = data.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterData(newData);
        } else {
            setFilterData(data);
        }

    }

    // console.log(data)

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <Loader visible={loading} />
                <Header
                    label='Task Details'
                    image=''
                    icon='arrow-left'
                    onPress={onBackPressed}
                    subTitle={customer_name}

                />
                <SearchInput label='Search Task Name...'
                    serachFilter={serchFilter}
                />

                <View style={{ flex: 1 }}>
                    <View style={{ zIndex: 0 }}>
                        <FlatList
                            data={filterData}
                            renderItem={({ item }) => <CardItem data={item}
                                navigation={navigation}
                                colour={colors.yellow}
                                icon='assignment-ind'
                                handleIconPress={handleIconPress}
                                screen='ProductInterest'
                                buttonTittle='Product Interest'
                                handleDisplayPress={() => { }}
                                iconName1='preview'
                                handleIconName1Press={handleIconName1Press}

                            />}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            zIndex: -1,
                        }}
                    >
                        {filterData.length > 0 && (
                            <View style={{ height: 260, backgroundColor: '#f2f2f2 ' }} />
                        )}

                        {filterData.length == 0 && (
                            <>
                                <View style={{ height: '100%', backgroundColor: 'transparent', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, color: colors.red, }}> No records found  </Text>
                                </View>
                            </>
                        )}

                        <View style={{ flex: 1, backgroundColor: '#f2f2f2' }} />
                    </View>

                </View>
                <CustomButton
                    onPress={handleNavigation}
                    text={'Add Task'}
                    bgColor={colors.primary} />
            </View>
        </SafeAreaView>
    );

}

export default CustomerTasks