import React, { useState, useRef } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { FONTS } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { addDocument } from '../../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'Act6Experiment3'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const ExperimentPage3: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { profile } = useAuth();

    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const [accuracy, setAccuracy] = useState(0);
    const pointsRef = useRef<{ x: number; y: number }[]>([]);
    const accuraciesRef = useRef<number[]>([]);
    const startTimeRef = useRef<number | null>(null);
    const isFinishedRef = useRef(false);

    // Star configuration inside a s(320) x s(320) box
    const cx = s(160);
    const cy = s(160);
    const outerR = s(116);
    const innerR = s(58);

    const starVertices = useRef<{ x: number; y: number }[]>([]);
    if (starVertices.current.length === 0) {
        for (let i = 0; i < 10; i++) {
            const angle = -Math.PI / 2 + i * Math.PI / 5;
            const r = i % 2 === 0 ? outerR : innerR;
            starVertices.current.push({
                x: cx + r * Math.cos(angle),
                y: cy + r * Math.sin(angle),
            });
        }
    }

    // Checkpoints to measure path coverage (8 per segment)
    const checkpointsRef = useRef<{ x: number; y: number; visited: boolean }[]>([]);
    if (checkpointsRef.current.length === 0) {
        const vertices = starVertices.current;
        const cps = [];
        for (let i = 0; i < 10; i++) {
            const a = vertices[i];
            const b = vertices[(i + 1) % 10];
            const numPoints = 8;
            for (let k = 0; k < numPoints; k++) {
                const t = k / numPoints;
                cps.push({
                    x: a.x + t * (b.x - a.x),
                    y: a.y + t * (b.y - a.y),
                    visited: false,
                });
            }
        }
        checkpointsRef.current = cps;
    }

    // Helper functions for math
    const getDistanceToSegment = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
        const dx = bx - ax;
        const dy = by - ay;
        if (dx === 0 && dy === 0) {
            return Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
        }
        const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
        const closestX = ax + t * dx;
        const closestY = ay + t * dy;
        return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
    };

    const getDistanceToStar = (px: number, py: number, vertices: { x: number; y: number }[]) => {
        let minD = Infinity;
        for (let i = 0; i < 10; i++) {
            const a = vertices[i];
            const b = vertices[(i + 1) % 10];
            const d = getDistanceToSegment(px, py, a.x, a.y, b.x, b.y);
            if (d < minD) {
                minD = d;
            }
        }
        return minD;
    };

    const calculatePointAccuracy = (d: number) => {
        const minTolerance = s(5); // strictly accurate within 5px
        const maxTolerance = s(20); // completely inaccurate after 20px
        if (d <= minTolerance) return 100;
        if (d >= maxTolerance) return 0;
        return 100 * (1 - (d - minTolerance) / (maxTolerance - minTolerance));
    };

    const handleTouchStart = () => {
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
        }
    };

    const handleTouchMove = (e: any) => {
        if (isFinishedRef.current) return;
        const { locationX, locationY } = e.nativeEvent;

        // Verify bounds
        if (locationX < 0 || locationX > s(320) || locationY < 0 || locationY > s(320)) {
            return;
        }

        // Limit the frequency of points slightly for smoothness vs performance
        if (pointsRef.current.length > 0) {
            const last = pointsRef.current[pointsRef.current.length - 1];
            const d = Math.sqrt((locationX - last.x) ** 2 + (locationY - last.y) ** 2);
            if (d < s(2)) { // Increased density (was 5)
                return;
            }
        }

        const newPt = { x: locationX, y: locationY };
        pointsRef.current.push(newPt);

        // Accuracy evaluation
        const dToStar = getDistanceToStar(locationX, locationY, starVertices.current);
        const ptAcc = calculatePointAccuracy(dToStar);

        accuraciesRef.current.push(ptAcc);
        const sum = accuraciesRef.current.reduce((a, b) => a + b, 0);
        const avgAcc = sum / accuraciesRef.current.length;
        
        // Coverage evaluation
        for (const cp of checkpointsRef.current) {
            if (!cp.visited) {
                const d = Math.sqrt((locationX - cp.x) ** 2 + (locationY - cp.y) ** 2);
                if (d < s(18)) { // Slightly tighter checkpoint radius
                    cp.visited = true;
                }
            }
        }

        const visitedCount = checkpointsRef.current.filter(cp => cp.visited).length;
        const totalCount = checkpointsRef.current.length;
        const coverage = visitedCount / totalCount;
        
        // Displayed accuracy is a mix of precision and coverage
        const currentAccuracy = avgAcc * (0.5 + 0.5 * coverage); 
        setAccuracy(currentAccuracy);
        setPoints([...pointsRef.current]);

        if (coverage >= 0.98) { // Finished drawing
            handleFinish(currentAccuracy);
        }
    };

    const handleTouchEnd = () => {
        if (isFinishedRef.current) return;
        
        // If they started tracing, finish immediately when lifted
        if (pointsRef.current.length > 10) {
            const visitedCount = checkpointsRef.current.filter(cp => cp.visited).length;
            const totalCount = checkpointsRef.current.length;
            const coverage = visitedCount / totalCount;
            
            const sum = accuraciesRef.current.reduce((a, b) => a + b, 0);
            const avgAcc = accuraciesRef.current.length > 0 ? sum / accuraciesRef.current.length : 0;
            
            const finalScore = avgAcc * coverage; // Final score penalized by missing parts
            handleFinish(finalScore);
        }
    };

    const handleFinish = async (finalAcc: number) => {
        if (isFinishedRef.current) return;
        isFinishedRef.current = true;

        const duration = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;

        try {
            const resultData = {
                userId: profile?.uid || 'anonymous',
                fullName: profile?.fullName || 'Anonymous',
                accuracy: parseFloat(finalAcc.toFixed(1)),
                duration: parseFloat(duration.toFixed(2)),
                act: 6,
                phase: 3,
                createdAt: new Date(),
            };

            await addDocument('experiments', resultData);

            Alert.alert(
                'Tracing Complete!',
                `Accuracy: ${finalAcc.toFixed(0)}%\nTime: ${duration.toFixed(1)}s`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Act6Phase3Result');
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Save failed:', error);
            Alert.alert('Error', 'Failed to save your result.');
        }
    };

    const handleClose = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/OnBoardingAssets/bgImg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                {/* Close (X) button */}
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

                {/* Instruction on top */}
                <Image
                    source={require('../../assets/act6ExperimentAssets/phase3Instruction.png')}
                    style={styles.instruction}
                    resizeMode="contain"
                />

                {/* Star tracing container */}
                <View
                    style={styles.starContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <Image
                        source={require('../../assets/act6ExperimentAssets/starBig.png')}
                        style={styles.starImage}
                        resizeMode="contain"
                    />

                    {/* Trail of tracing (white pen) */}
                    {points.map((pt, index) => (
                        <View
                            key={index}
                            pointerEvents="none"
                            style={[
                                styles.tracePoint,
                                {
                                    left: pt.x - s(4),
                                    top: pt.y - s(4),
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Mars planet bottom */}
                <Image
                    source={require('../../assets/act6/mars.png')}
                    style={styles.marsPlanet}
                    resizeMode="contain"
                />

                {/* Accuracy parameter box */}
                <View style={styles.parameterContainer}>
                    <Image
                        source={require('../../assets/act6ExperimentAssets/accuracy.png')}
                        style={styles.parameterBox}
                        resizeMode="contain"
                    />
                    <Text style={styles.accuracyText}>
                        Accuracy  {accuracy.toFixed(0)} %
                    </Text>
                </View>
            </ImageBackground>
        </View>
    );
};

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

    /* Close button */
    closeButton: {
        position: 'absolute',
        top: s(70),
        left: s(28),
        width: s(55),
        height: s(55),
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: s(45),
        height: s(45),
    },

    /* Instruction */
    instruction: {
        position: 'absolute',
        top: s(150),
        alignSelf: 'center',
        width: s(380),
        height: s(80),
    },

    /* Star Container */
    starContainer: {
        position: 'absolute',
        top: s(260),
        alignSelf: 'center',
        width: s(320),
        height: s(320),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    starImage: {
        width: s(280),
        height: s(280),
    },
    tracePoint: {
        position: 'absolute',
        width: s(8),
        height: s(8),
        borderRadius: s(4),
        backgroundColor: 'white',
        opacity: 0.9,
    },

    /* Mars planet */
    marsPlanet: {
        position: 'absolute',
        bottom: s(-30),
        alignSelf: 'center',
        width: s(480),
        height: s(280),
        zIndex: 1,
    },

    /* Accuracy parameter container */
    parameterContainer: {
        position: 'absolute',
        bottom: s(60),
        left: s(50),
        width: s(160),
        height: s(50),
        zIndex: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    parameterBox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    accuracyText: {
        fontFamily: FONTS.title, // ShortStack
        fontSize: s(13),
        color: '#07181f',
        marginLeft: s(15),
        marginTop: s(2),
    },
});

export default ExperimentPage3;
