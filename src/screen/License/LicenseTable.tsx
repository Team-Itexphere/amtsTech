import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface LicenseData {
    id: number;
    name: string;
    type: string;
    expire_date: string;
    agency: string;
}

const LicenseTable: React.FC<{ data: LicenseData[] }> = ({ data }) => {
    const today = new Date();

    const isNearExpiry = (expireDate: string) => {
        const expiry = new Date(expireDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 30;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const renderItem = ({ item }: { item: LicenseData }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.type}</Text>
            <Text style={styles.cell}>{item.agency}</Text>
            <Text
                style={[
                    styles.cell,
                    isNearExpiry(item.expire_date) && { color: 'red' },
                ]}
            >
                {formatDate(item.expire_date)}
            </Text>
        </View>
    );

    return (
        <View style={styles.table}>
            <View style={styles.header}>
                <Text style={styles.headerCell}>License Name</Text>
                <Text style={styles.headerCell}>Type</Text>
                <Text style={styles.headerCell}>Agency</Text>
                <Text style={styles.headerCell}>Expire Date</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    table: {
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cell: {
        flex: 1,
        padding: 10,
    },
});

export default LicenseTable;
