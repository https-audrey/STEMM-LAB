import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
    ImageSourcePropType,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { FONTS } from '../../utils/theme';
import { getDocument } from '../../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'Act5ResultComp'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

// ── Bar graph constants ────────────────────────────────────────────
const GRAPH_LEFT = s(70);           // x where value 0 starts
const GRAPH_RIGHT = s(330);         // x where value 10 ends
const BAR_FULL_WIDTH = GRAPH_RIGHT - GRAPH_LEFT;   // px span for 0‑10
const BAR_HEIGHT = s(16);
const BAR_GAP = s(3);              // vertical gap between bars in a group
const GROUP_GAP = s(18);           // vertical gap between recording groups

interface RecordingData {
    id: string;
    name: string;
    averageSpeed: number;
    averageSmoothness: number;
    rangeOfMotion: number;
}

// Clamp a value into the 0‑10 range then return the proportional pixel width
const valueToWidth = (value: number): number => {
    const clamped = Math.max(0, Math.min(10, value));
    return (clamped / 10) * BAR_FULL_WIDTH;
};

const ResultCompPage: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<any>();
    const docIds: string[] = route.params?.docIds || [];

    const [recordings, setRecordings] = useState<RecordingData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecordings = async () => {
            setLoading(true);
            try {
                const list: RecordingData[] = [];
                for (let i = 0; i < docIds.length; i++) {
                    const id = docIds[i];
                    const docData = await getDocument('experiments', id);
                    if (docData) {
                        list.push({
                            id,
                            name: docData.recordingName || `Recording ${i + 1}`,
                            averageSpeed: docData.averageSpeed ?? 0,
                            averageSmoothness: docData.averageSmoothness ?? 0,
                            rangeOfMotion: docData.rangeOfMotion ?? 0,
                        });
                    }
                }
                setRecordings(list);
            } catch (error) {
                console.error('[ResultComp] Error fetching recordings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (docIds.length > 0) {
            fetchRecordings();
        } else {
            setLoading(false);
        }
    }, [docIds]);

    const handleClose = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        navigation.navigate('Home');
    };

    // ── Render a single horizontal bar ─────────────────────────────
    const renderBar = (
        value: number,
        barImage: ImageSourcePropType,
        key: string,
    ) => {
        const width = valueToWidth(value);
        return (
            <View key={key} style={barStyles.barRow}>
                <View style={[barStyles.barTrack]}>
                    {width > 0 && (
                        <Image
                            source={barImage}
                            style={[barStyles.barFill, { width }]}
                            resizeMode="stretch"
                        />
                    )}
                </View>
            </View>
        );
    };

    // ── Render one person's 3‑bar group ────────────────────────────
    const renderRecordingGroup = (rec: RecordingData, index: number) => (
        <View key={rec.id} style={barStyles.group}>
            {/* Name label on the left */}
            <Text style={barStyles.nameLabel} numberOfLines={1}>
                {rec.name}
            </Text>
            <View style={barStyles.barsWrapper}>
                {renderBar(
                    rec.averageSpeed,
                    require('../../assets/ResultCompAssets/speedBar.png'),
                    `${rec.id}-speed`,
                )}
                {renderBar(
                    rec.averageSmoothness,
                    require('../../assets/ResultCompAssets/smoothBar.png'),
                    `${rec.id}-smooth`,
                )}
                {renderBar(
                    rec.rangeOfMotion / 100,
                    require('../../assets/ResultCompAssets/rangeBar.png'),
                    `${rec.id}-range`,
                )}
            </View>
        </View>
    );

    // ── Render the x‑axis labels (0 – 10) ──────────────────────────
    const renderXAxis = () => {
        const ticks = Array.from({ length: 11 }, (_, i) => i);
        return (
            <View style={barStyles.xAxisRow}>
                {ticks.map((t) => (
                    <Text key={t} style={barStyles.xTick}>
                        {t}
                    </Text>
                ))}
            </View>
        );
    };

    // ── Render the legend row ──────────────────────────────────────
    const renderLegend = () => (
        <View style={barStyles.legendRow}>
            <View style={barStyles.legendItem}>
                <View style={[barStyles.legendSwatch, { backgroundColor: '#A3C27B' }]} />
                <Text style={barStyles.legendText}>Speed</Text>
            </View>
            <View style={barStyles.legendItem}>
                <View style={[barStyles.legendSwatch, { backgroundColor: '#E8D87C' }]} />
                <Text style={barStyles.legendText}>Smoothness</Text>
            </View>
            <View style={barStyles.legendItem}>
                <View style={[barStyles.legendSwatch, { backgroundColor: '#7BA3D4' }]} />
                <Text style={barStyles.legendText}>Range of Motion</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/OnBoardingAssets/bgImg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                {/* Close (X) button — top left */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../../assets/act5/crossBtn.png')}
                        style={styles.closeIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* Title bubble — "Stretch Speed & Gracefulness" */}
                <Image
                    source={require('../../assets/act5/act5Title.png')}
                    style={styles.titleBubble}
                    resizeMode="contain"
                />

                {/* Result box container */}
                <View style={styles.boxContainer}>
                    <Image
                        source={require('../../assets/ResultCompAssets/ex1Results.png')}
                        style={styles.resultBox}
                        resizeMode="contain"
                    />

                    {/* Chart area overlaid on top of the result box image */}
                    <View style={styles.chartArea}>
                        {loading ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#08121E" />
                            </View>
                        ) : recordings.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No recordings yet.</Text>
                            </View>
                        ) : (
                            <>
                                <ScrollView
                                    contentContainerStyle={styles.scrollContent}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {recordings.map((rec, idx) =>
                                        renderRecordingGroup(rec, idx),
                                    )}
                                    {renderXAxis()}
                                </ScrollView>
                                {renderLegend()}
                            </>
                        )}
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require('../../assets/EquipmentAssets/continueBtn.png')}
                            style={styles.continueImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* Saturn planet — bottom of screen */}
                <Image
                    source={require('../../assets/act5/saturnPlanet.png')}
                    style={styles.saturnPlanet}
                    resizeMode="contain"
                />
            </ImageBackground>
        </View>
    );
};

// ═══════════════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08121E',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    /* Close button — top left corner */
    closeButton: {
        position: 'absolute',
        top: s(70),
        left: s(28),
        width: s(55),
        height: s(55),
        zIndex: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: s(45),
        height: s(45),
    },

    /* Title bubble */
    titleBubble: {
        position: 'absolute',
        top: s(140),
        alignSelf: 'center',
        width: s(390),
        height: s(180),
        left: s(30),
        zIndex: 2,
    },

    /* Result Box Container */
    boxContainer: {
        position: 'absolute',
        top: s(340),
        alignSelf: 'center',
        width: s(374),
        height: s(583),
        zIndex: 5,
    },
    resultBox: {
        width: '100%',
        height: '100%',
    },

    /* Chart area — overlaid on the result‑box image inside dashed border */
    chartArea: {
        position: 'absolute',
        top: s(115),
        alignSelf: 'center',
        width: s(335),
        height: s(370),
        zIndex: 10,
    },
    scrollContent: {
        paddingTop: s(8),
        paddingBottom: s(10),
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: FONTS.title,
        fontSize: s(14),
        color: '#08121E',
    },

    /* Continue button */
    continueButton: {
        position: 'absolute',
        bottom: s(28),
        right: s(22),
        width: s(141),
        height: s(41),
        zIndex: 10,
    },
    continueImage: {
        width: '100%',
        height: '100%',
    },

    /* Saturn planet */
    saturnPlanet: {
        position: 'absolute',
        bottom: s(-30),
        right: s(-40),
        width: s(480),
        height: s(280),
        zIndex: 1,
    },
});

// ── Bar‑graph‑specific styles ─────────────────────────────────────
const barStyles = StyleSheet.create({
    group: {
        marginBottom: GROUP_GAP,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameLabel: {
        fontFamily: FONTS.title,
        fontSize: s(12),
        color: '#08121E',
        width: s(60),
        textAlign: 'right',
        marginRight: s(6),
    },
    barsWrapper: {
        flex: 1,
    },
    barRow: {
        marginBottom: BAR_GAP,
    },
    barTrack: {
        height: BAR_HEIGHT,
        width: '100%',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        borderRadius: s(3),
    },
    barFill: {
        height: '100%',
        borderRadius: s(3),
    },

    /* X‑axis labels */
    xAxisRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: s(66),
        marginRight: s(2),
        marginTop: s(4),
    },
    xTick: {
        fontFamily: FONTS.title,
        fontSize: s(10),
        color: '#08121E',
    },

    /* Legend */
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: s(10),
        gap: s(12),
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendSwatch: {
        width: s(10),
        height: s(10),
        borderRadius: s(2),
        marginRight: s(4),
    },
    legendText: {
        fontFamily: FONTS.title,
        fontSize: s(9),
        color: '#08121E',
    },
});

export default ResultCompPage;