import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ViewStyle,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getSiteInfo, SiteInfoDataRes } from '../../store/actions/survey/siteInfoAction';
import Loading from '../../components/UI/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../../components/UI/FormInput';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import NoDataImage from '../../components/UI/NoDataImage';

interface LabeledInputProps {
    label: string;
    value: string | number;
    placeholder: string;
    editable?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
}

const LabeledInput = ({
    label,
    value,
    placeholder,
    keyboardType = 'default',
    onChange,
    editable = true,
    containerStyle,
}: LabeledInputProps) => (
    <View style={[containerStyle, { padding: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 10, marginTop: 5 }]}>
        <Text style={[styles.label, { fontWeight: '700', fontSize: 16 }]}>{label}</Text>
        <FormInput
            value={String(value)}
            placeholder={placeholder}
            keyboardType={keyboardType}
            onChange={onChange}
            editable={editable}
            containerStyle={styles.inputContainer}
        />
    </View>
);

const SiteInfoScreen = () => {
    const dispatch = useDispatch();
    const { location: { cus_id } } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [siteInfo, setSiteInfo] = useState<SiteInfoDataRes | null>(null);
    const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});

    const fetchData = useCallback(async () => {
        if (!cus_id) return;
        setIsLoading(true);
        try {
            const fetchedData = await getSiteInfo(dispatch, cus_id);
            if (fetchedData && Object.keys(fetchedData).length > 0) setSiteInfo(fetchedData);
        } finally {
            setIsLoading(false);
        }
    }, [cus_id, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (key: keyof SiteInfoDataRes, value: string) => {
        setSiteInfo((prevState) =>
            prevState ? { ...prevState, [key]: value } : null
        );
    };

    const toggleSection = (index: number) => {
        setExpandedSections((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const handleTankChange = (tankIndex: number, key: string, value: string) => {
        setSiteInfo(prevState => {
            if (!prevState) return null;
            const updatedTanks = prevState.site_info_tanks.map((tank, index) =>
                index === tankIndex ? { ...tank, [key]: value } : tank
            );
            return { ...prevState, site_info_tanks: updatedTanks };
        });
    };

    const renderTankInfo = (tankVal: any, index: number) => (
        <View key={index} style={styles.sectionContainer}>
            <TouchableOpacity
                onPress={() => toggleSection(index)}
                style={styles.sectionHeader}
            >
                <Text style={styles.sectionHeaderText}>Site Info Tanks</Text>
                <Text>{expandedSections[index] ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandedSections[index] && (
                <View style={styles.sectionContent}>
                    {Object.entries(tankVal)
                        .filter(([key]) => !excludedFields.includes(key))
                        .map(([key, value]) => (
                            // const value = tankVal[key as keyof typeof tankVal];
                            // const initialKeyboardType = typeof value === 'number' ? 'numeric' : 'default';
                            <LabeledInput
                                key={key}
                                label={key.replace(/_/g, ' ')}
                                value={value as string | number}
                                placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                                // keyboardType={typeof value === 'number' ? 'numeric' : 'default'}
                                keyboardType={'default'}
                                onChange={value => handleTankChange(index, key, value)}
                            />
                        ))}
                </View>
            )}
        </View>
    );

    const fieldLabel = (key: string): string => {
        switch (key) {
            case 'id':
                return 'Info ID';
            case 'fu_brand':
                return 'Fuel Brand';
            case 'truck_stop':
                return 'Truck stop';
            case 'dis_brand':
                return 'Dispenser Brand';
            case 'dis_model':
                return 'Dispenser Model';
            case 'dis_sumps':
                return 'Does it have sumps under dispenser?';
            case 'dis_type':
                return 'Sumps Type';
            case 'vents_count':
                return 'Number of Vents';
            case 'h_many_3_0':
                return 'Number of 3+0 Dispensers';
            case 'h_many_3_1':
                return 'Number of 3+1 Dispensers';
            case 'h_many_h_flows':
                return 'Number of High Flows Dispensers';
            case 'tanks_count':
                return 'Number of Tanks';
            case 'atg_brand':
                return 'ATG Brand';
            case 'atg_sensors':
                return 'ATG Sensors';
            case 'relay_brand':
                return 'Relay Brand';
            case 'pos_system':
                return 'POS System';
            case 'lock':
                return 'Site Info Locked?';
            case 'customer_id':
                return 'Customer ID';
            default:
                return 'Unknown';
        }
    };

    const renderSiteInfo = () => (
        siteInfo && Object.entries(siteInfo)
            .filter(([key]) => !excludedFields.includes(key))
            .map(([key, value]) => (
                <LabeledInput
                    key={key}
                    label={fieldLabel(key)}
                    value={value as string | number}
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                    // keyboardType={typeof value === 'number' ? 'numeric' : 'default'}
                    keyboardType={'default'}
                    onChange={(val) => handleChange(key as keyof SiteInfoDataRes, val)}
                    editable={siteInfo.lock === 0}
                />
            ))
    );

    const excludedFields = ['site_info_tanks', 'created_at', 'updated_at'];

    if (!isLoading && !siteInfo) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <NoDataImage />
            <Text style={{ ...FONTS.body2 }}>Site info is empty</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            {isLoading && <Loading />}
            <KeyboardAwareScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                {siteInfo?.site_info_tanks?.map(renderTankInfo)}
                {renderSiteInfo()}
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
        marginHorizontal: SIZES.base,
    },
    sectionContainer: {
        marginVertical: SIZES.base * 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SIZES.base,
        paddingVertical: SIZES.base * 2,
        backgroundColor: COLORS.lightGrey,
        borderTopLeftRadius: SIZES.base,
        borderTopRightRadius: SIZES.base,
    },
    sectionHeaderText: {
        ...FONTS.body3,
    },
    sectionContent: {
        backgroundColor: COLORS.primary30,
    },
    label: {
        ...FONTS.body4,
        marginLeft: SIZES.base,
    },
    inputContainer: {
        marginBottom: SIZES.base,
    },
});

export default SiteInfoScreen;
