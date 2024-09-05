import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaintainsLogs } from '../../../store/actions/survey/maintainsLogsAction';
import { COLORS } from '../../../assets/theme';

interface MaintainsLogsTableProps {
    data: MaintainsLogs[];
    onMorePress: (log: MaintainsLogs) => void;
}

const MaintainsLogsTable: React.FC<MaintainsLogsTableProps> = ({ data, onMorePress }) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const renderItem = ({ item }: { item: MaintainsLogs }) => (
        <View style={styles.row}>
            <Text style={[styles.cell, styles.dateCell]}>{formatDate(item.date)}</Text>
            <Text style={[styles.cell, styles.dateCell]}>{item.category}</Text>
            <Text style={[styles.cell, styles.categoryCell]}>{item.descript}</Text>
            <TouchableOpacity style={[styles.cell, styles.moreCell]} onPress={() => onMorePress(item)}>
                <Text>  ⋯</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View>
            <View style={styles.header}>
                <Text style={[styles.headerCell, styles.dateCell]}>Date</Text>
                <Text style={[styles.headerCell, styles.dateCell]}>Category</Text>
                <Text style={[styles.headerCell, styles.categoryCell]}>Description</Text>
                <Text style={[styles.headerCell, styles.moreCell]}>More</Text>
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
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    cell: {
        padding: 10,
    },
    moreIcon: {
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
    },
    headerCell: {
        fontWeight: 'bold',
        padding: 10,
    },
    // Define specific column styles
    dateCell: {
        flex: 2, // Give more space to the date column
    },
    categoryCell: {
        flex: 3, // Give more space to the category column
    },
    moreCell: {
        flex: 1, // Give less space to the more column
        textAlign: 'center',
    },
});

export default MaintainsLogsTable;
