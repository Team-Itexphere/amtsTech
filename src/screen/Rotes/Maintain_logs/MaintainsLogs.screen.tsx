import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { getMaintainsLogs, MaintainsLogs } from '../../../store/actions/survey/maintainsLogsAction';
import Loading from '../../../components/UI/Loading';
import MaintainsLogsTable from './MaintainsLogsTable';
import MaintainsModal from './MaintainsModal';


const MaintainsLogsScreen = () => {
    const dispatch = useDispatch();

    const { location: { cus_id } } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [selectedLog, setSelectedLog] = useState<MaintainsLogs | null>(null);
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [maintainsLogs, setMaintainsLogList] = useState<MaintainsLogs[]>([])

    const fetchData = async (cus_id: number) => {
        setIsLoarding(true);
        const fetchArray = await getMaintainsLogs(dispatch, cus_id)
        // console.log(fetchArray);

        setMaintainsLogList(fetchArray)
        setIsLoarding(false);
    };

    useEffect(() => {
        if (cus_id) fetchData(cus_id);
    }, [])


    const handleMorePress = (log: MaintainsLogs) => {
        setSelectedLog(log);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedLog(null);
    };

    return (
        <View style={styles.container}>
            {isLoading && <Loading />}
            <MaintainsLogsTable data={maintainsLogs} onMorePress={handleMorePress} />
            {drawerVisible && <MaintainsModal
                isVisible={drawerVisible}
                setIsVisible={(val) => closeDrawer()}
                selectedLog={selectedLog}
            />}
            {/* <SurveyImgModal
                isVisible={drawerVisible}
                setIsVisible={(val) => closeDrawer()}
                imguri={"file:///data/user/0/com.amtstech/cache/rn_image_picker_lib_temp_5c9726c1-a06b-48fe-9942-821908e64885.jpg"}
            /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    drawerContent: {
        padding: 20,
        backgroundColor: 'white',
        height: '100%',
    },
});

export default MaintainsLogsScreen;
