import { View, FlatList, Text, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getOrderList } from '../../services/productServices';
import SearchInput from '../../components/SearchInput';
import Header from '../../components/Header';
import { colors } from '../../Styles/appStyle';
import Loader from '../../components/Loader';
import SmallCard from '../../components/SmallCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderList = ({ route, navigation }) => {
  // console.log('param', route.params);

  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [custId, setCustId] = useState(route.params.cust_id);
  const [filterInvData, setFilterInvData] = useState([]);

  const subTitle = route.params.cust_id ? 'CUSTOMER :' + route.params.cust_name : ''
  useEffect(() => {
    setLoading(true);
    getOrderList(custId).then((res) => {
      setInvoiceData(res.data);
      setFilterInvData(res.data);
      setLoading(false);
    })
      .catch((error) => {
        setLoading(false)
      });
  }, []);

  const onBackPressed = () => {
    navigation.pop();
  }

  const serchFilter = (text) => {
    // console.log(text)
    if (text) {
      const newData = invoiceData.filter((item) => {
        const itemData = item.customer_name ? item.customer_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilterInvData(newData);
    } else {
      setFilterInvData(invoiceData);
    }

  }

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Loader visible={loading} />
        <Header
          label={'Invoice List' + ' (' + filterInvData.length + ')'}
          image=''
          icon='arrow-left'
          onPress={onBackPressed}
          subTitle={subTitle}
        />

        {!subTitle && (
          <SearchInput label='Search Company Name ...'
            serachFilter={serchFilter}
          />
        )}
        {!invoiceData.length && (
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, paddingLeft: 20, color: colors.red, fontStyle: 'italic' }}>No Invoice Found. </Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 0 }}>
            <FlatList
              data={filterInvData}
              renderItem={({ item }) => <SmallCard data={item}
                navigation={navigation}
                colour={"#d0e7ff"}
                title={item.invoice_number}
                subTitle={item.customer_name}
                date={item.invoice_due_date}
                dateColour={item.is_over_due ? colors.red : colors.yellow}
                dateTitle='Due Date'
                buttonTittle={item.currency_symbol + ' ' + item.total}
                buttonScreen='ViewOrderItem'
                // iconName='email'
                iconName2={(item.is_proforma_invoice != 'N') ? 'delete' : ''}
                iconScreen='InvoiceSendMail'
                callMode='NA'
                logo={true}
              />}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View
            style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0, zIndex: -1, }}
          >
            <View style={{ height: 230, }} />
            <View style={{ flex: 1, }} />
          </View>

        </View>
      </View>

    </SafeAreaView>
  );

}

export default OrderList