import { View, Text, Button, FlatList, KeyboardAvoidingViewComponent, KeyboardAvoidingView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigationTypes';
import { RootState } from '../../store/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getCustomers, SaveLocationPressData } from '../../store/actions/survey/routesAction';
import FormInput from '../../components/UI/FormInput';

const CustomersScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>('')
    const [customers, setCustomers] = useState<any[]>([]);

    const fetchCustomers = async (searchParam: string) => {
      setIsLoading(true);
      const customers_arr = await getCustomers(searchParam);
      setIsLoading(false);
      if (!customers_arr) {
        console.warn('No customers');
      } else {console.log('cusArr',customers_arr)
        setCustomers(customers_arr);
      }
    };

    // useEffect(() => {
    //     const fetchCustomers = async () => {
    //         setIsLoading(true);
    //         const customers_arr = await getCustomers(searchParam);
    //         setIsLoading(false);
    //         if (!customers_arr) {
    //             console.warn('No customers');
    //         } else {
    //             setCustomers(customers_arr);
    //         }
    //     };

    //     fetchCustomers();
    // }, [dispatch]);

    const viewCustomer = (customer: { id: number; name: string; cus_notes: any[] }) => {
        const emtRt = {
          ro_loc_id: null, 
          cus_id: customer.id, 
          list_id: null, 
          notes: customer.cus_notes, 
          status: null, 
          cus_name: customer.name, 
          rec_logs: null
        }
        dispatch(SaveLocationPressData(emtRt.ro_loc_id, emtRt.cus_id, emtRt.list_id, emtRt.notes, emtRt.status, emtRt.cus_name, emtRt.rec_logs));
        navigation.navigate('StoreList');
    };

    return (
      <>
        <View 
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            margin: SIZES.base,
            alignItems: 'center',
            height: 60,
            borderBottomWidth: 2,
            paddingBottom: 5,
            borderColor: '#0000002b'
          }}>
          <FormInput
            value={searchParam}
            containerStyle={{
              width: '69%',
              paddingRight: 0
            }}
            placeholder="Type here..."
            onChange={(text: string) => setSearchParam(text)}
          />
          <Button
            title="🔍 Search"
            onPress={() => fetchCustomers(searchParam)}
            color={COLORS.lightOrange}
          />
        </View>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 200 }}>Loading...</Text>
          ) : customers.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 200 }}>No customers available</Text>
          ) : (
            customers.map((customer, index) => (
              <View
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: SIZES.base,
                  borderRadius: 10,
                  borderBottomWidth: 3,
                  borderColor: '#00800082',
                  backgroundColor: '#00000014',
                }}
              >
                <View style={{ margin: SIZES.base }}>
                  <Text
                    style={{
                      ...FONTS.body3,
                      margin: SIZES.base,
                      marginBottom: SIZES.none,
                      textAlign: 'right',
                    }}
                  >
                    {customer.name}
                  </Text>
                </View>
                <View style={{ margin: SIZES.base, display: 'flex', flexDirection: 'row', gap: 5, marginRight: 10 }}>
                  <View style={{ marginLeft: customer.payment == 'Paid' ? 50 : 0 }}>
                    <Button
                      title="View"
                      onPress={() => viewCustomer(customer)}
                      color={COLORS.lightOrange} />
                  </View>
                </View>
              </View>
            ))
          )}
        </KeyboardAwareScrollView>
      </>
    );
};

export default CustomersScreen;
