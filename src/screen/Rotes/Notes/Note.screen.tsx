import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { NoteType, SaveLocationPressData, Status, updateNotes } from '../../../store/actions/survey/routesAction';
import { COLORS, SIZES } from '../../../assets/theme';
import NoDataImage from '../../../components/UI/NoDataImage';
import Loading from '../../../components/UI/Loading';
import { ServeyStatus } from '../../../types';


const NoteItem = ({ noteData }:{ noteData: NoteType}) => {
    const dispatch = useDispatch();
    const { location: { ro_loc_id, cus_id, list_id, status, cus_name, rec_logs, hasInvoice } } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const markNoteAs = async ( noteStatus: Status, id: number) => {
        setIsLoading(true);

        const newNotes = await updateNotes(noteStatus, id)

        dispatch(
            SaveLocationPressData(
                ro_loc_id, 
                cus_id, 
                list_id, 
                newNotes, 
                status, 
                cus_name, 
                rec_logs, 
                hasInvoice               
            )
        );

        setIsLoading(false);
    }

    return (
        <View style={[styles.card, { display: noteData.status === Status.Completed ? 'none' : 'flex' }]}>
            <View style={{ top: 100 }}>
                {isLoading && <Loading />}
            </View>
            <Text style={styles.title}>Note</Text>
            <Text style={styles.noteText}>{noteData.note}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '55%' }}>
                    <Text style={[styles.timestamp, {fontSize: 11}]}>
                        Created: {new Date(noteData.created_at).toLocaleString()}
                    </Text>
                    <Text style={[styles.timestamp, {fontSize: 11}]}>
                        Updated: {new Date(noteData.updated_at).toLocaleString()}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: noteData.status === Status.Pending ? COLORS.lightOrange : COLORS.green }]}
                    onPress={() => markNoteAs(Status.Completed, noteData.id)}
                    disabled={noteData.status === Status.Completed}
                >
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>{noteData.status === Status.Pending ?  'Mark as Completed' : 'Completed'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const NotesScreen = () => {
    const { location: { notes } } = useSelector((state: RootState) => state.routeReducer);

    if(notes.length === 0 || notes.every(note => note.status === Status.Completed)) return (
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
    button: {
        backgroundColor: COLORS.lightOrange,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10, // For Android shadow
    }
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


