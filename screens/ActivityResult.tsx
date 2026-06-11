// screens/ActivityResult.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import {File, Paths} from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { sendNotification } from '../services/notificationService';
import {
    getTrialsBySession,
    getHFTrialsBySession,
    getEarthquakeTrialsBySession,
    getSoundTrialsBySession,
    getSessionReflection,
    getAllSessions,
} from '../services/db';

type NavProp = StackNavigationProp<RootStackParamList, 'ActivityResult'>;
type ActivityType = 'all' | 'parachute' | 'handfan' | 'earthquake' | 'sound';

interface Session {
    session_id: string;
    activity_type: string;
    submitted_at: string | null;  // Allow null
    reflection: string | null;
    created_at: string;
    updated_at: string;
}

interface SessionWithDetails extends Session {
    trials: any[];
    trialCount: number;
}

export default function ActivityResult() {
    const navigation = useNavigation<NavProp>();
    const [activeFilter, setActiveFilter] = useState<ActivityType>('all');
    const [allSessions, setAllSessions] = useState<SessionWithDetails[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<SessionWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<SessionWithDetails | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);

    useEffect(() => {
        loadAllSessionsInParallel();
    }, []);

    useEffect(() => {
        filterSessions();
    }, [activeFilter, allSessions]);

    // 🔥 PARALLEL PROGRAMMING: Load all sessions concurrently
    const loadAllSessionsInParallel = async () => {
        setLoading(true);
        
        try {
            // Get all sessions from SQLite
            const sessions = await getAllSessions();
            const submittedSessions = sessions
                .filter(s => s.submitted_at)
                .sort((a, b) => {
                    const dateA = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
                    const dateB = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
                    return dateB - dateA;
                });
            
            // 🔥 PARALLEL: Load ALL sessions at the same time
            const loadPromises = submittedSessions.map(async (session) => {
                let trials: any[] = [];  // Explicitly type as any[]
                
                // Load trials based on activity type
                switch (session.activity_type) {
                    case 'parachute':
                        trials = getTrialsBySession(session.session_id);
                        break;
                    case 'handfan':
                        trials = getHFTrialsBySession(session.session_id);
                        break;
                    case 'earthquake':
                        trials = getEarthquakeTrialsBySession(session.session_id);
                        break;
                    case 'sound':
                        trials = getSoundTrialsBySession(session.session_id);
                        break;
                }
                
                const sessionWithDetails: SessionWithDetails = {
                    ...session,
                    trials,
                    trialCount: trials.length,
                };
                
                return sessionWithDetails;
            });
            
            // 🔥 PARALLEL: Wait for ALL to finish
            const sessionsWithDetails = await Promise.all(loadPromises);
            setAllSessions(sessionsWithDetails);
            
        } catch (error) {
            console.error('Error loading sessions:', error);
            Alert.alert('Error', 'Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const filterSessions = () => {
        if (activeFilter === 'all') {
            setFilteredSessions(allSessions);
        } else {
            setFilteredSessions(allSessions.filter(s => s.activity_type === activeFilter));
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getActivityIcon = (activityType: string) => {
        switch (activityType) {
            case 'parachute': return '🪂';
            case 'handfan': return '🎐';
            case 'earthquake': return '🏗️';
            case 'sound': return '🔊';
            default: return '📋';
        }
    };

    const getActivityColor = (activityType: string) => {
        switch (activityType) {
            case 'parachute': return '#00d2d3';
            case 'handfan': return '#2ed573';
            case 'earthquake': return '#ffa502';
            case 'sound': return '#ff6b81';
            default: return '#4A90E2';
        }
    };

    const handleSessionPress = (session: SessionWithDetails) => {
        setSelectedSession(session);
        setModalVisible(true);
    };

    const generatePDF = async () => {
        if (!selectedSession) return;
        
        setGeneratingPDF(true);
        
        try {
            const reflection = getSessionReflection(selectedSession.session_id);
            
            // Generate HTML for PDF
            let trialsHTML = '';
            for (const trial of selectedSession.trials) {
                trialsHTML += `
                    <div style="border:1px solid #ddd; margin:10px; padding:10px; border-radius:8px;">
                        <h3 style="color:#4A90E2;">${trial.prototype_key || 'Trial'}</h3>
                        ${generateTrialHTML(trial, selectedSession.activity_type)}
                    </div>
                `;
            }
            
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>STEMM Lab Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4A90E2; }
                        .title { font-size: 28px; font-weight: bold; color: #4A90E2; }
                        .session-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                        .reflection { background: #e8f4f8; padding: 15px; border-radius: 8px; margin-top: 20px; font-style: italic; }
                        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="title">${getActivityIcon(selectedSession.activity_type)} ${selectedSession.activity_type.toUpperCase()}</div>
                        <div>STEMM Lab Experiment Report</div>
                    </div>
                    <div class="session-info">
                        <strong>Session ID:</strong> ${selectedSession.session_id}<br>
                        <strong>Submitted:</strong> ${formatDate(selectedSession.submitted_at)}<br>
                        <strong>Total Trials:</strong> ${selectedSession.trialCount}
                    </div>
                    <h2>📊 Trial Results</h2>
                    ${trialsHTML}
                    ${reflection ? `
                        <div class="reflection">
                            <strong>💭 Team Reflection:</strong><br>
                            ${reflection}
                        </div>
                    ` : ''}
                    <div class="footer">Generated by STEMM Lab App on ${new Date().toLocaleString()}</div>
                </body>
                </html>
            `;
            
            // Generate temporary PDF and share directly
            const { uri } = await Print.printToFileAsync({ html });
            
            // Share - system handles cleanup automatically
            await Sharing.shareAsync(uri);
            
            // Optional: Send notification (but not necessary)
            // await sendNotification('📄 Report Shared', 'Report generated successfully');
            
        } catch (error) {
            console.error('PDF generation error:', error);
            Alert.alert('Error', 'Failed to generate PDF');
        } finally {
            setGeneratingPDF(false);
        }
    };
    
    const generateTrialHTML = (trial: any, activityType: string): string => {
        switch (activityType) {
            case 'parachute':
                return `
                    <div><strong>Mass:</strong> ${trial.mass} kg</div>
                    <div><strong>Height:</strong> ${trial.height} m</div>
                    <div><strong>G-Force:</strong> ${trial.g_force?.toFixed(2)} g</div>
                    <div><strong>Impact Velocity:</strong> ${trial.v_impact?.toFixed(2)} m/s</div>
                `;
            case 'handfan':
                return `
                    <div><strong>Design:</strong> ${trial.design}</div>
                    <div><strong>Distance:</strong> ${trial.distance} cm</div>
                    <div><strong>Material:</strong> ${trial.material}</div>
                    <div><strong>Stiffness:</strong> ${trial.stiffness} N/rad</div>
                    <div><strong>Bend Angle:</strong> ${trial.bend_angle?.toFixed(1)}°</div>
                    <div><strong>Force:</strong> ${trial.force?.toFixed(3)} N</div>
                `;
            case 'earthquake':
                return `
                    <div><strong>Description:</strong> ${trial.description || '—'}</div>
                    <div><strong>Peak Acceleration:</strong> ${trial.peakAccel?.toFixed(3)} g</div>
                    <div><strong>Average Acceleration:</strong> ${trial.avgAccel?.toFixed(3)} g</div>
                `;
            case 'sound':
                return `
                    <div><strong>Action:</strong> ${trial.action}</div>
                    <div><strong>Location:</strong> ${trial.location_description}</div>
                    <div><strong>Peak Sound Level:</strong> ${trial.sound_level_db?.toFixed(1)} dB</div>
                    <div><strong>Average Sound Level:</strong> ${trial.avg_db?.toFixed(1)} dB</div>
                    <div><strong>Duration:</strong> ${trial.duration?.toFixed(1)} s</div>
                `;
            default:
                return '';
        }
    };

    const renderTrialDetails = (trial: any, activityType: string) => {
        switch (activityType) {
            case 'parachute':
                return (
                    <>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Mass:</Text>
                            <Text style={styles.detailValue}>{trial.mass} kg</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Height:</Text>
                            <Text style={styles.detailValue}>{trial.height} m</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>G-Force:</Text>
                            <Text style={styles.detailValue}>{trial.g_force?.toFixed(2)} g</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Impact Velocity:</Text>
                            <Text style={styles.detailValue}>{trial.v_impact?.toFixed(2)} m/s</Text>
                        </View>
                    </>
                );
            case 'handfan':
                return (
                    <>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Design:</Text>
                            <Text style={styles.detailValue}>{trial.design}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Distance:</Text>
                            <Text style={styles.detailValue}>{trial.distance} cm</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Material:</Text>
                            <Text style={styles.detailValue}>{trial.material}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Stiffness:</Text>
                            <Text style={styles.detailValue}>{trial.stiffness} N/rad</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Bend Angle:</Text>
                            <Text style={styles.detailValue}>{trial.bend_angle?.toFixed(1)}°</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Force:</Text>
                            <Text style={styles.detailValue}>{trial.force?.toFixed(3)} N</Text>
                        </View>
                    </>
                );
            case 'earthquake':
                return (
                    <>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Description:</Text>
                            <Text style={styles.detailValue}>{trial.description || '—'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Peak Acceleration:</Text>
                            <Text style={styles.detailValue}>{trial.peakAccel?.toFixed(3)} g</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Average Acceleration:</Text>
                            <Text style={styles.detailValue}>{trial.avgAccel?.toFixed(3)} g</Text>
                        </View>
                    </>
                );
            case 'sound':
                return (
                    <>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Action:</Text>
                            <Text style={styles.detailValue}>{trial.action}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Location:</Text>
                            <Text style={styles.detailValue}>{trial.location_description}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Peak Sound Level:</Text>
                            <Text style={styles.detailValue}>{trial.sound_level_db?.toFixed(1)} dB</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Average Sound Level:</Text>
                            <Text style={styles.detailValue}>{trial.avg_db?.toFixed(1)} dB</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Duration:</Text>
                            <Text style={styles.detailValue}>{trial.duration?.toFixed(1)} s</Text>
                        </View>
                    </>
                );
            default:
                return null;
        }
    };

    const ActivityButton = ({ type, icon, label }: { type: ActivityType; icon: string; label: string }) => (
        <TouchableOpacity
            style={[styles.filterButton, activeFilter === type && styles.filterButtonActive]}
            onPress={() => setActiveFilter(type)}
        >
            <Text style={styles.filterIcon}>{icon}</Text>
            <Text style={[styles.filterText, activeFilter === type && styles.filterTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Activity Results</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Filter Buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer} contentContainerStyle={styles.filterContentContainer}>
                <ActivityButton type="all" icon="📊" label="All" />
                <ActivityButton type="parachute" icon="🪂" label="Parachute" />
                <ActivityButton type="handfan" icon="🎐" label="Hand Fan" />
                <ActivityButton type="earthquake" icon="🏗️" label="Earthquake" />
                <ActivityButton type="sound" icon="🔊" label="Sound" />
            </ScrollView>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.loadingText}>Loading sessions in parallel...</Text>
                </View>
            ) : filteredSessions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No sessions found</Text>
                    <Text style={styles.emptySubtext}>
                        {activeFilter === 'all' 
                            ? 'Complete and submit an activity to see results here'
                            : `No ${activeFilter} sessions submitted yet`}
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContainer}>
                    {filteredSessions.map((session) => (
                        <TouchableOpacity
                            key={session.session_id}
                            style={[styles.sessionCard, { borderLeftColor: getActivityColor(session.activity_type) }]}
                            onPress={() => handleSessionPress(session)}
                        >
                            <View style={styles.sessionHeader}>
                                <Text style={styles.sessionIcon}>{getActivityIcon(session.activity_type)}</Text>
                                <Text style={styles.sessionType}>{session.activity_type.toUpperCase()}</Text>
                                <Text style={styles.trialCount}>{session.trialCount} trial(s)</Text>
                            </View>
                            <Text style={styles.sessionId} numberOfLines={1}>ID: {session.session_id}</Text>
                            <Text style={styles.sessionDate}>📅 {formatDate(session.submitted_at)}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Details Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {getActivityIcon(selectedSession?.activity_type || '')} {selectedSession?.activity_type?.toUpperCase()}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {selectedSession && (
                            <ScrollView style={styles.modalContent}>
                                <View style={styles.modalInfoCard}>
                                    <Text style={styles.modalInfoText}>Session ID: {selectedSession.session_id}</Text>
                                    <Text style={styles.modalInfoText}>Submitted: {formatDate(selectedSession.submitted_at)}</Text>
                                    <Text style={styles.modalInfoText}>Total Trials: {selectedSession.trialCount}</Text>
                                </View>

                                <Text style={styles.sectionTitle}>📊 Trial Results</Text>
                                {selectedSession.trials.map((trial, index) => (
                                    <View key={index} style={styles.detailCard}>
                                        <Text style={styles.detailTitle}>{trial.prototype_key || `Trial ${index + 1}`}</Text>
                                        {renderTrialDetails(trial, selectedSession.activity_type)}
                                    </View>
                                ))}

                                {(() => {
                                    const reflection = getSessionReflection(selectedSession.session_id);
                                    return reflection ? (
                                        <>
                                            <Text style={styles.sectionTitle}>💭 Team Reflection</Text>
                                            <View style={styles.reflectionCard}>
                                                <Text style={styles.reflectionText}>{reflection}</Text>
                                            </View>
                                        </>
                                    ) : null;
                                })()}
                            </ScrollView>
                        )}

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.pdfButton}
                                onPress={generatePDF}
                                disabled={generatingPDF}
                            >
                                {generatingPDF ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="document-text-outline" size={20} color="#fff" />
                                        <Text style={styles.pdfButtonText}>Share PDF</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeModalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeModalText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#071A3D',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128,128,128,0.5)',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerSpacer: {
        width: 40,
    },
    filterContainer: {
        paddingHorizontal: 20,
        marginBottom: 8,
        height: 40,
        flexGrow: 0,
    },
    filterContentContainer: {
        paddingHorizontal: 5,
        paddingRight: 20,
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        gap: 4,
        height: 32,
    },
    filterButtonActive: {
        backgroundColor: '#4A90E2',
    },
    filterIcon: {
        fontSize: 14,
    },
    filterText: {
        color: '#aaa',
        fontSize: 12,
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptySubtext: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    listContainer: {
        padding: 20,
    },
    sessionCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    sessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sessionIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    sessionType: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    trialCount: {
        color: '#00d2d3',
        fontSize: 12,
        backgroundColor: 'rgba(0,210,211,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    sessionId: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    sessionDate: {
        color: '#00d2d3',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '85%',
        backgroundColor: '#102654',
        borderRadius: 24,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContent: {
        padding: 20,
    },
    modalInfoCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    modalInfoText: {
        color: '#ddd',
        fontSize: 12,
        marginBottom: 4,
    },
    sectionTitle: {
        color: '#00d2d3',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    detailCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    detailTitle: {
        color: '#ffa502',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    detailLabel: {
        color: '#aaa',
        fontSize: 12,
    },
    detailValue: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    reflectionCard: {
        backgroundColor: 'rgba(108,92,231,0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: '#6c5ce7',
    },
    reflectionText: {
        color: '#ddd',
        fontSize: 13,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    pdfButton: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#2ed573',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    pdfButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    closeModalButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeModalText: {
        color: '#ffa502',
        fontWeight: 'bold',
    },
});