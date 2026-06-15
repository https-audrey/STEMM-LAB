import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Pressable,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type NavProp = StackNavigationProp<RootStackParamList, 'Sound'>;

export default function Sound() {
    const navigation = useNavigation<NavProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'Sound'>>();

    const currentSessionId = route.params?.currentSessionId ?? '';

    const handleStart = () => {
        const newSessionId =
            `session_${Date.now()}`;

        navigation.navigate(
            'SoundActivity',
            {
                currentSessionId:
                    newSessionId,
                forceNewSession: true,
            }
        );
    };

    const equipment = [
        "Mobile phone with STEMM Lab app ",
    ];

    const instruction = [
        "Measure noise from different actions (dropping objects (pens, books) talking, walking, stamping your feet).",
        "Record sound levels and locations.",
        "Map loud and quiet zones.",
    ];

    return (
        <ScrollView style={styles.mainContainer} contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text style={styles.title}>Sound Pollution Hunter</Text>
                <View style={styles.rightSpacer} />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🎯 Engineering Challenge Overview</Text>
                    <Text style={styles.descriptionText}>
                        Students measure and compare sound levels in different classroom activities.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🛠️ Equipment Checklist</Text>
                    {equipment.map((item, index) => (
                        <View key={`equip-${index}`} style={styles.bulletItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>{item}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📋 Laboratory Instructions</Text>
                    {instruction.map((item, index) => (
                        <View key={`inst-${index}`} style={styles.bulletItem}>
                            <Text style={styles.numericPrefix}>{index + 1}.</Text>
                            <Text style={styles.bulletText}>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.startButton} onPress={handleStart}>
                    <Text style={styles.startText}>Initialize Experiment 🚀</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#071A3D',
    },
    container: {
        flexGrow: 1,
        paddingBottom: 50,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginHorizontal: 10,
    },
    rightSpacer: {
        width: 44,
    },
    contentContainer: {
        paddingHorizontal: 20,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    descriptionText: {
        fontSize: 15,
        color: '#E2E8F0',
        lineHeight: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00d2d3',
        marginBottom: 15,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    bullet: {
        color: '#4A90E2',
        fontSize: 18,
        marginRight: 12,
        lineHeight: 22,
    },
    numericPrefix: {
        color: '#4A90E2',
        fontSize: 15,
        fontWeight: '700',
        marginRight: 10,
        lineHeight: 22,
        width: 22,
    },
    bulletText: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 22,
    },
    buttonContainer: {
        marginTop: 15,
        marginBottom: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    startButton: {
        backgroundColor: '#2ed573',
        width: '100%',
        maxWidth: 340,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#2ed573',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    startText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
});