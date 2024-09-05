import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LicenseTable from './LicenseTable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getStoreLicense, LicenseData } from '../../store/actions/survey/storeLicenseAction';
import Loading from '../../components/UI/Loading';

const data = [
    {
        id: 121,
        name: 'Delivery Certificate',
        type: 'Delivery Certificate',
        expire_date: '2024-05-12',
        agency: 'TCEQ',
    },
    {
        id: 123,
        name: 'Tank Insurance',
        type: 'Tank Insurance',
        expire_date: '2024-08-09',
        agency: 'Mid-Continent Insurance',
    },
    {
        id: 124,
        name: 'A+B Operating',
        type: 'A+B Operating',
        expire_date: '2026-07-16',
        agency: 'PASS Training & Compliance',
    },
];

const LicenseScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { location: { cus_id } } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [storeLicense, setSToreLicense] = useState<LicenseData[]>([])

    const fetchData = async (cus_id: number) => {
        setIsLoarding(true);
        const fetchArray = await getStoreLicense(dispatch, cus_id)

        setSToreLicense(fetchArray)
        setIsLoarding(false);
    };

    useEffect(() => {
        if (cus_id) { fetchData(cus_id) } else { console.warn("LicenseScreen cus_id -> null"); }
    }, [])


    return (
        <View style={styles.container}>
            {isLoading && <Loading />}
            <LicenseTable data={storeLicense} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
});

export default LicenseScreen;
