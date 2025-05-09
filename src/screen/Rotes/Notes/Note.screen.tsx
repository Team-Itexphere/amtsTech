import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import React, { useState } from 'react';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { addNotes, NoteType, SaveLocationPressData, Status, updateNotes } from '../../../store/actions/survey/routesAction';
import { COLORS, FONTS, SIZES } from '../../../assets/theme';
import NoDataImage from '../../../components/UI/NoDataImage';
import FormInput from '../../../components/UI/FormInput';
import TextButton from '../../../components/UI/TextButton';
import Loading from '../../../components/UI/Loading';

const NoteItem = ({ noteData }:{ noteData: NoteType}) => {
    const dispatch = useDispatch();
    const { location: { ro_loc_id, cus_id, list_id, status, cus_name, rec_logs, hasInvoice } } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [statusToUpdate, setStatusToUpdate] = useState<Status>(Status.Pending);
    const [noteIdToUpdate, setNoteIdToUpdate] = useState<number>(0);
    const [reason, setReason] = useState<string>('');

    const markNoteAs = async () => {
        setIsLoading(true);

        if (statusToUpdate === Status.Pending && !reason) {
            Alert.alert('Please provide a reason for changing the status to Pending.');
            setIsLoading(false);
            return;
        }

        const newNotes = await updateNotes(statusToUpdate, noteIdToUpdate, reason);

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

        setIsModalVisible(false); // Hide modal after update
        setIsLoading(false);
    }

    const handleStatusChange = (status: Status, id: number) => {
        setStatusToUpdate(status === Status.Completed ? Status.Pending : Status.Completed);
        setNoteIdToUpdate(id);
        setIsModalVisible(true); // Show modal
    }

    return (
        <View style={[styles.card]}>
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
                    style={[styles.button, { backgroundColor: noteData.status !== Status.Completed ? COLORS.lightOrange : COLORS.green }]}
                    onPress={() => handleStatusChange(noteData.status === Status.Completed ? Status.Completed : Status.Pending, noteData.id)}
                >
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>
                        {noteData.status !== Status.Completed ? 'Mark as Completed' : 'Completed'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Modal for status change confirmation */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Are you sure you want to change the status?
                        </Text>
                        {statusToUpdate === Status.Pending && (
                            <TextInput
                                style={styles.reasonInput}
                                placeholder="Enter reason for Pending status"
                                value={reason}
                                onChangeText={setReason}
                                multiline
                            />
                        )}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: COLORS.gray }]}
                                onPress={() => setIsModalVisible(false)} // Close modal
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: COLORS.primary }]}
                                onPress={markNoteAs}
                            >
                                <Text style={styles.modalButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const NotesScreen = () => {
    const dispatch = useDispatch();
    const { location: { ro_loc_id, cus_id, list_id, status, cus_name, notes, rec_logs, hasInvoice } } = useSelector((state: RootState) => state.routeReducer);

    const [noteText, setNoteText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<Status>(Status.Pending); // Default tab is 'Pending'

    // Filter notes based on the selected tab
    const filteredNotes = notes
                            .map((note) => ({
                                ...note,
                                status: note.status ?? Status.Pending,
                            }))
                            .filter((note) => note.status === activeTab);

    const addNote = async () => {
        setIsLoading(true);

        if (!noteText) {
            Alert.alert('Type your note before submit.');
            setIsLoading(false)
            return;
        }

        if (!cus_id) {
            Alert.alert('Submission failed!');
            setIsLoading(false)
            return;
        }

        const newNotes = await addNotes(noteText, cus_id);

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
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === Status.Pending && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab(Status.Pending)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === Status.Pending && styles.tabText,
                        ]}
                    >
                        Pending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === Status.Completed && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab(Status.Completed)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === Status.Completed && styles.tabText,
                        ]}
                    >
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <NoDataImage />
                    <Text style={styles.title}>No {activeTab} Notes</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredNotes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <NoteItem noteData={item} />}
                    contentContainerStyle={{ paddingBottom: 200 }}
                />
            )}

            {/* Add Note Section */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: SIZES.base,
                    backgroundColor: COLORS.white,
                }}
            >
                <FormInput
                    containerStyle={{
                        borderRadius: SIZES.radius,
                        margin: SIZES.base,
                        backgroundColor: COLORS.white,
                        ...FONTS.h3,
                    }}
                    inputStyle={{
                        textAlign: 'center',
                    }}
                    placeholder="Type here to add new note..."
                    placeholderTextColor={COLORS.gray}
                    value={noteText}
                    onChange={(text: string) => setNoteText(text)}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        margin: SIZES.base,
                        marginBottom: SIZES.radius,
                    }}
                >
                    <TextButton
                        label="Add New Note"
                        contentContainerStyle={{
                            height: 55,
                            width: '100%',
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.primary,
                        }}
                        labelStyle={{
                            ...FONTS.h3,
                            color: COLORS.white,
                        }}
                        onPress={() => addNote()}
                        disabled={isLoading}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: COLORS.lightGray2,
        paddingVertical: 10,
    },
    tabButton: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 5,
        borderBottomColor: COLORS.transparent,
        borderRadius: 3,
    },
    activeTab: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        ...FONTS.h3, 
        fontSize: SIZES.height > 800 ? 16 : 15
    },
    title: {
        color: COLORS.black,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
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
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    reasonInput: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        height: 80,
        fontSize: 14,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default NotesScreen;