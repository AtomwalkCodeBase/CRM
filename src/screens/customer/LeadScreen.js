import { View, FlatList, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SmallCard from '../../components/SmallCard';
import SearchInput from '../../components/SearchInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import ToastMsg from '../../components/ToastMsg';
import Loader from '../../components/Loader';
import { getLeadDataList, getUserTasks } from '../../services/productServices';
import { colors } from '../../Styles/appStyle';
import { SafeAreaView } from 'react-native-safe-area-context';


const LeadScreen = ({ navigation, route }) => {
    const [customers, setCustomers] = useState([]);
    const [filterCustomers, setFilterCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const companydata = route.params?.Company_name ? route.params?.Company_name : '';
    useEffect(() => {
        if (companydata) {
            serchFilter(companydata);
        }
    }, [companydata]);

    // console.log(filterCustomers,"filterCustomers")
    useEffect(() => {
        setLoading(true)
        getLeadDataList('')
            .then((res) => {
                setCustomers(res.data);
                setFilterCustomers(res.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    }, [isStatusUpdated, companydata]);

    const onBackPressed = () => {
        navigation.pop();
    }

    const handleTaskPressed = (item) => {
        // console.log(item?.company_name,"item?.company_name")
        navigation.navigate("AddCustomerTask", { customer_id: item.id, selected_type: 'L', Company_name: item?.company_name, },)
    }

    const handleInterestPressed = (item) => {

        // console.log('handleInterestPresse', item)
        navigation.navigate('ProductInterest', {
            task_id: '', customer_id: '', lead_id: item.id,
            screen: 'ProductInterest', name: item.name, task_name: '',
            call_mode: 'L', Mobile: item.mobile_number,
            emails: item.email_id, Company_name: item?.company_name,
        });
    }

    const handleStatusPressed = (item) => {
        // console.log('handleStatusPressed', item)
        setIsStatusUpdated(true)
        navigation.navigate('LeadStatus', { data: item });

    }

    const serchFilter = (text) => {
        if (text.startsWith('S:')) {
            const newData = customers.filter((item) => {
                const itemData = item.status_display.toUpperCase();
                const textData = text.substr(2).toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterCustomers(newData);
        }
        else if (text) {
            const newData = customers.filter((item) => {
                const itemData = item.company_name ? item.company_name.toUpperCase() + item.name.toUpperCase() + ' ' + item.mobile_number
                    : item.name.toUpperCase() + ' ' + item.mobile_number;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterCustomers(newData);
        } else {
            setFilterCustomers(customers);
        }
    }
    // console.log(filterCustomers,"ujfejf")
    const counttsk = (customer_id, leadId) => {
        getUserTasks('ALL', customer_id, leadId).then((res) => {
            return res.data.length;
        }).catch((error) => {
            ToastMsg('Something went wrong', 'error');
        });
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <Loader visible={loading} />
                <Header
                    label={'My Leads' + ' (' + filterCustomers.length + ')'}
                    image=''
                    icon='arrow-left'
                    onPress={onBackPressed}
                />
                <SearchInput label='Search lead/company/mobile/S:status ...'
                    serachFilter={serchFilter}
                    data={companydata ? companydata : ''}
                />

                <View style={{ flex: 1 }}>
                    <View style={{ zIndex: 0 }}>
                        <FlatList
                            data={filterCustomers}
                            renderItem={({ item }) => <SmallCard
                                data={item}
                                navigation={navigation}
                                colour={"#fff9cc"}
                                Company_name={item.company_name}
                                title={item.company_name ? item.company_name + ' [' + item.name + ']' : item.name}
                                subTitle={item.mobile_number ? 'Mobile No: ' + item.mobile_number : 'Email: ' + item.email_id}
                                Mobile={item.mobile_number}
                                emails={item.email_id}
                                date={item.qualified_date ? item.qualified_date : item.record_date}
                                dateColour={item.qualified_date ? colors.green : colors.black}
                                dateTitle={item.status_display}
                                buttonTittle='Task list'
                                buttonScreen='LeadTasks'
                                iconName='add-task'
                                text1='Task'
                                iconName2='view-list'
                                text2='Interest'
                                iconScreen=''
                                callMode='L'
                                screen='LeadTasks'
                                handleIcon={() => handleTaskPressed(item)}
                                handleIcon2={() => handleInterestPressed(item)}
                                handleInfo={handleStatusPressed}
                                companydata={item.company_name == companydata ? companydata : ''}
                                tasklength={item.no_of_task == 0 ? false : item.no_of_task}
                                pilength={item.no_of_pi == 0 ? false : item.no_of_pi}
                            />}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
                <CustomButton
                    onPress={() => navigation.navigate("AddNewLead", { 'task': null })}
                    text={'Add Lead'}
                    bgColor={"#4491FE"} />

            </View>
        </SafeAreaView>

    )

}

export default LeadScreen