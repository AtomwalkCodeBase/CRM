import { View, FlatList, Text, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getTaskInterest } from '../../services/productServices';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { colors } from '../../Styles/appStyle';
import Loader from '../../components/Loader';
import SmallCard from '../../components/SmallCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustTaskInterest = ({ route, navigation }) => {
  const [interest, setInterest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState(route.params.task_id);
  const [customerId, setCustomerId] = useState(route.params.customer_id);
  const [leadId, setLeadId] = useState(route.params.lead_id);
  const Mobile = route.params.Mobile;
  const emails = route.params.emails;
  const subTitle = (route.params.call_mode == 'L') ? 'LEAD - ' + route.params.name : 'CUSTOMER: ' + route.params.name
  const pageTitle = route.params.task_name ? 'Interest For Task: ' + route.params.task_name : ''
  const screen = route.params.screen
  const company = route.params?.Company_name
  // console.log('param', route.params);
  useEffect(() => {
    setLoading(true);
    getTaskInterest(taskId, customerId, leadId).then((res) => {
      setInterest(res.data);
      setLoading(false);
    })
      .catch((error) => {
        setLoading(false)
      });
  }, []);

  const onBackPressed = () => {
    navigation.pop();
  }

  // console.log(interest)

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Loader visible={loading} />
        <Header
          label='Product Interests'
          image=''
          icon='arrow-left'
          onPress={onBackPressed}
          subTitle={subTitle}

        />

        {pageTitle && (
          <Text style={{ fontSize: 15, paddingLeft: 20, color: colors.navyblue, fontStyle: 'italic' }}>{pageTitle} </Text>
        )}

        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 0, backgroundColor: "#fff" }}>
            <FlatList
              backgroundColor
              data={interest}
              renderItem={({ item }) => <SmallCard data={item}
                navigation={navigation}
                colour={colors.yellow}
                Mobile={Mobile}
                emails={emails}
                subTitle={(item.variation_name ? item.variation_name.name + ' - ' + item.variation_value : '') +
                  (item.variation_name_1 ? ' | ' + item.variation_name_1.name + ' - ' + item.variation_value_1 : '') +
                  (item.variation_name_2 ? ' | ' + item.variation_name_2.name + ' - ' + item.variation_value_2 : '')}
                title={item.category ? item.category.name : ''}
                date={item.due_date}
                dateTitle='Due Date'
                buttonTittle='UPDATE'
                buttonScreen={screen == 'TaskInterest' ? "UpdateTaskInterest" : "UpdateInterest"}
                iconName='preview'
                iconName2='delete'
                iconScreen={screen == 'TaskInterest' ? 'ViewTaskInterest' : 'ViewInterest'}
                callMode={route.params.call_mode ? route.params.call_mode : ''}
                name={route.params.name ? route.params.name : ''}
                task_name={route.params.task_name ? route.params.task_name : ''}

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
            {interest.length == 0 && (
              <>
                <View style={{ height: '100%', backgroundColor: 'transparent', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, color: colors.red }}> No records found ! </Text>
                </View>
              </>
            )}

            <View
              style={{ height: 260, backgroundColor: colors.white }} />


            <View style={{ flex: 1, backgroundColor: colors.white }} />
          </View>

        </View>
        <CustomButton
          onPress={() => navigation.navigate(screen == 'TaskInterest' ? "UpdateTaskInterest" : "UpdateInterest",
            {
              task_id: taskId, customer_id: customerId, lead_id: leadId, variation_name_id: '',
              variation_value: '', category_id: '', name: route.params.name,
              due_date: '', product_info: '', id: '', call_mode: route.params.call_mode, company_name: company
            })}
          text={'Add Product Interest'}
          bgColor={colors.primary} />

      </View>
    </SafeAreaView>
  );

}

export default CustTaskInterest