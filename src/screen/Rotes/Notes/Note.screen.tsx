import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import { NoteType } from '../../../store/actions/survey/routesAction';
import { COLORS, SIZES } from '../../../assets/theme';
import NoDataImage from '../../../components/UI/NoDataImage';

const NoteItem = ({ noteData }:{ noteData: NoteType}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Note</Text>
            <Text style={styles.noteText}>{noteData.note}</Text>
            <Text style={styles.timestamp}>
                Created: {new Date(noteData.created_at).toLocaleString()}
            </Text>
            <Text style={styles.timestamp}>
                Updated: {new Date(noteData.updated_at).toLocaleString()}
            </Text>
        </View>
    );
};

const NotesScreen = () => {
    const { location: { notes } } = useSelector((state: RootState) => state.routeReducer);

    if(notes.length === 0) return (
        <View style={{flex:1, justifyContent: 'center',alignItems:'center'}}>
            <NoDataImage/>
            <Text style={styles.title}>N/A</Text>
         </View>
    )
    
    return (
        <View>
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <NoteItem noteData={item} />}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        color:COLORS.black,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    noteText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
    },
});


export default NotesScreen

// [
//     {
//         id: 3,
//         tech_id: 18,
//         cus_id: 64,
//         list_id: 4,
//         note: 'Test note',
//         created_at: '2024-08-14T19:32:23.000000Z',
//         updated_at: '2024-08-14T19:32:23.000000Z',
//     },
  
// ]


