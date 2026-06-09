import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VideoView, useVideoPlayer } from 'expo-video';
import { RootStackParamList } from '../types/navigation';

type NavProp = StackNavigationProp<RootStackParamList, 'HandFanMarking'>;
type RouteProps = RouteProp<RootStackParamList, 'HandFanMarking'>;

export default function HandFanVideoMarking() {
    const navigation = useNavigation<NavProp>();
    const route = useRoute<RouteProps>();

    const { videoUri, prototypeKey, design, distance, material, stiffness, currentSessionId } = route.params || {};
    
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    
    // Two points for angle calculation
    const [topPoint, setTopPoint] = useState<{ x: number; y: number } | null>(null);
    const [bottomPoint, setBottomPoint] = useState<{ x: number; y: number } | null>(null);
    
    const [videoLayout, setVideoLayout] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        console.log('HandFanVideoMarking mounted with:', { videoUri, prototypeKey, design, distance, material, stiffness });
        
        if (!videoUri) {
            Alert.alert('Error', 'No video URI provided', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    }, []);

    const player = useVideoPlayer(videoUri, (playerInstance) => {
        playerInstance.loop = false;
        setIsLoading(false);
        console.log('Player ready, duration:', playerInstance.duration);
    });

    useEffect(() => {
        if (!player) return;
        const interval = setInterval(() => {
            try {
                setCurrentTime(player.currentTime);
                setDuration(player.duration || 0);
                setIsPlaying(player.playing);
            } catch (error) {
                console.error('Error updating time:', error);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [player]);

    const togglePlayback = () => {
        if (!player) return;
        if (player.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    const stepTimeValue = (offset: number) => {
        if (!player) return;
        player.pause(); 
        const targetTime = Math.min(Math.max(0, player.currentTime + offset), player.duration || 0);
        player.currentTime = targetTime;
        setCurrentTime(targetTime); 
    };

    const handleProgressBarPress = (event: any) => {
        if (!player) return;
        const videoDuration = player.duration || 0;
        if (videoDuration === 0) return;

        const { locationX } = event.nativeEvent;
        const trackWidth = Dimensions.get('window').width - 40; 
        const percentage = Math.min(Math.max(0, locationX / trackWidth), 1);
        const targetTime = percentage * videoDuration;
        
        player.pause();
        player.currentTime = targetTime;
        setCurrentTime(targetTime);
    };

    const handleVideoLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setVideoLayout({ width, height });
    };

    const handleVideoTouch = (event: any) => {
        if (!videoLayout) return;
        
        const { locationX, locationY } = event.nativeEvent;
        
        // Scale coordinates relative to video dimensions (0 to 1)
        const scaledX = locationX / videoLayout.width;
        const scaledY = locationY / videoLayout.height;
        
        if (!topPoint) {
            setTopPoint({ x: scaledX, y: scaledY });
            Alert.alert('Top Point Set', 'Now tap the bottom point of the hand fan.');
        } else if (!bottomPoint) {
            setBottomPoint({ x: scaledX, y: scaledY });
            Alert.alert('Points Complete', 'Both points recorded! Ready to calculate angle.');
        } else {
            // Reset if both already set
            setTopPoint({ x: scaledX, y: scaledY });
            setBottomPoint(null);
            Alert.alert('Reset', 'Top point reset. Tap bottom point again.');
        }
    };

    const calculateAngle = (): number | null => {
        if (!topPoint || !bottomPoint) {
            Alert.alert('Missing Points', 'Please tap both top and bottom points on the hand fan.');
            return null;
        }
        
        // Calculate the angle between the two points
        // For a hand fan, we want the angle from vertical or horizontal
        // Let's calculate the angle from vertical (straight up/down)
        
        const deltaX = bottomPoint.x - topPoint.x;
        const deltaY = bottomPoint.y - topPoint.y;
        
        // Calculate angle from vertical (in radians)
        // If vertical = 0 degrees (straight up/down)
        // If horizontal = 90 degrees
        let angleRad = Math.atan2(Math.abs(deltaX), Math.abs(deltaY));
        let angleDeg = angleRad * (180 / Math.PI);
        
        // Determine direction (left or right lean)
        const direction = deltaX > 0 ? 'right' : 'left';
        
        console.log(`Angle calculated: ${angleDeg.toFixed(1)}° ${direction}`);
        
        return angleDeg;
    };

    const resetPoints = () => {
        setTopPoint(null);
        setBottomPoint(null);
        Alert.alert('Reset', 'All points cleared. Tap top point again.');
    };

    const handleCalculateAngle = () => {
        const angle = calculateAngle();
        
        if (angle === null) return;
        
        navigation.navigate('HandFanResult', {
            data: {
                currentSessionId,
                videoUri,
                prototypeKey,
                design,
                distance,  // fanning distance (kept as is from params)
                material,
                stiffness,
                bend_angle: angle,
                top_point_x: topPoint?.x ?? 0,
                top_point_y: topPoint?.y ?? 0,
                bottom_point_x: bottomPoint?.x ?? 0,
                bottom_point_y: bottomPoint?.y ?? 0,
                isHistoricalView: false
            }
        });
    };

    const filledWeight = duration > 0 ? currentTime / duration : 0;

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={{ color: '#fff', marginTop: 20 }}>Loading video...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.title}>Hand Fan Angle Analysis</Text>
            <Text style={styles.subtitle}>
                Prototype: <Text style={{color: '#ffa502'}}>{prototypeKey?.toUpperCase()}</Text> | 
                Material: {material} | Stiffness: {stiffness}
            </Text>
            <Text style={styles.distanceText}>
                Fanning Distance: {distance} cm
            </Text>

            {/* Video Player */}
            <View style={styles.videoWrapper} onLayout={handleVideoLayout}>
                <VideoView 
                    style={styles.absoluteFill} 
                    player={player} 
                    nativeControls={false} 
                />
                {/* Touch overlay for marking points */}
                <TouchableWithoutFeedback onPress={handleVideoTouch}>
                    <View style={styles.touchOverlay}>
                        {/* Render visual markers */}
                        {topPoint && (
                            <View style={[styles.marker, { 
                                left: topPoint.x * (videoLayout?.width || 0) - 15, 
                                top: topPoint.y * (videoLayout?.height || 0) - 20
                            }]}>
                                <Text style={styles.markerText}>🔴 T</Text>
                            </View>
                        )}
                        {bottomPoint && (
                            <View style={[styles.marker, { 
                                left: bottomPoint.x * (videoLayout?.width || 0) - 20, 
                                top: bottomPoint.y * (videoLayout?.height || 0) - 20
                            }]}>
                                <Text style={styles.markerText}>🔴 B</Text>
                            </View>
                        )}
                        {/* Draw line between points if both exist */}
                        {topPoint && bottomPoint && videoLayout && (
                            <View style={[styles.angleLine, {
                                left: topPoint.x * videoLayout.width,
                                top: topPoint.y * videoLayout.height,
                                width: Math.hypot(
                                    (bottomPoint.x - topPoint.x) * videoLayout.width,
                                    (bottomPoint.y - topPoint.y) * videoLayout.height
                                ),
                                transform: [{
                                    rotate: `${Math.atan2(
                                        (bottomPoint.y - topPoint.y) * videoLayout.height,
                                        (bottomPoint.x - topPoint.x) * videoLayout.width
                                    )}rad`
                                }]
                            }]} />
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>

            {/* Video Controls */}
            <View style={styles.scrubDashboard}>
                <View style={styles.timeTelemetryRow}>
                    <Text style={styles.timerMono}>⏱️ {currentTime.toFixed(3)}s</Text>
                    <Text style={styles.timerMono}>Total: {duration.toFixed(2)}s</Text>
                </View>

                <TouchableWithoutFeedback onPress={handleProgressBarPress}>
                    <View style={styles.trackContainer}>
                        <View style={styles.trackBackground}>
                            <View style={[styles.trackFill, { flex: filledWeight || 0.001 }]} />
                            <View style={{ flex: 1 - (filledWeight || 0.001) }} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.controlDeck}>
                    <Pressable style={styles.microStepBtn} onPress={() => stepTimeValue(-0.5)}>
                        <Text style={styles.stepBtnText}>-0.5s</Text>
                    </Pressable>
                    <Pressable style={styles.microStepBtn} onPress={() => stepTimeValue(-0.033)}>
                        <Text style={styles.stepBtnText}>-Frame</Text>
                    </Pressable>

                    <Pressable style={styles.playPauseBtn} onPress={togglePlayback}>
                        <Text style={styles.playPauseText}>{isPlaying ? '⏸ Pause' : '▶ Play'}</Text>
                    </Pressable>

                    <Pressable style={styles.microStepBtn} onPress={() => stepTimeValue(0.033)}>
                        <Text style={styles.stepBtnText}>+Frame</Text>
                    </Pressable>
                    <Pressable style={styles.microStepBtn} onPress={() => stepTimeValue(0.5)}>
                        <Text style={styles.stepBtnText}>+0.5s</Text>
                    </Pressable>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsCard}>
                <Text style={styles.sectionHeader}>📐 How to Measure Angle</Text>
                <Text style={styles.instructionText}>
                    1. Pause the video at the moment you want to measure
                </Text>
                <Text style={styles.instructionText}>
                    2. Tap the TOP of the material
                </Text>
                <Text style={styles.instructionText}>
                    3. Tap the BOTTOM of the material
                </Text>
                <Text style={styles.instructionText}>
                    4. The angle will be calculated automatically
                </Text>
                <View style={styles.tipBox}>
                    <Text style={styles.tipText}>
                        💡 Tip: The angle is measured from vertical (0° = straight up/down, 90° = fully horizontal)
                    </Text>
                </View>
            </View>

            {/* Marking Status */}
            <View style={styles.statusCard}>
                <Text style={styles.sectionHeader}>✓ Current Selection</Text>
                <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Top Point:</Text>
                    <Text style={styles.statusValue}>
                        {topPoint ? `(${topPoint.x.toFixed(2)}, ${topPoint.y.toFixed(2)})` : 'Not set'}
                    </Text>
                </View>
                <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Bottom Point:</Text>
                    <Text style={styles.statusValue}>
                        {bottomPoint ? `(${bottomPoint.x.toFixed(2)}, ${bottomPoint.y.toFixed(2)})` : 'Not set'}
                    </Text>
                </View>
                {topPoint && bottomPoint && (
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Calculated Angle:</Text>
                        <Text style={styles.angleValue}>
                            {calculateAngle()?.toFixed(1)}°
                        </Text>
                    </View>
                )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonGroup}>
                <Pressable style={styles.resetButton} onPress={resetPoints}>
                    <Text style={styles.resetButtonText}>↺ Reset Points</Text>
                </Pressable>
                
                <Pressable 
                    style={[
                        styles.calcButton, 
                        (!topPoint || !bottomPoint) && styles.calcButtonDisabled
                    ]} 
                    onPress={handleCalculateAngle}
                    disabled={!topPoint || !bottomPoint}
                >
                    <Text style={styles.calcButtonText}>📊 Continue</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#071A3D', padding: 20 },
    absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    title: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 30 },
    subtitle: { color: '#bbb', fontSize: 14, textAlign: 'center', marginBottom: 8 },
    distanceText: { color: '#4A90E2', fontSize: 14, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
    
    videoWrapper: { 
        width: '100%', 
        height: Dimensions.get('window').height * 0.4, 
        backgroundColor: '#000', 
        borderRadius: 16, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.15)',
        position: 'relative'
    },
    touchOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    marker: { 
        position: 'absolute', 
        backgroundColor: 'rgba(255,0,0,0.9)', 
        borderRadius: 20, 
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff'
    },
    markerText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
    angleLine: {
        position: 'absolute',
        height: 3,
        backgroundColor: '#ff4444',
        transformOrigin: '0 0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3
    },
    
    scrubDashboard: { backgroundColor: 'rgba(255,255,255,0.04)', padding: 15, borderRadius: 14, marginVertical: 20 },
    timeTelemetryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    timerMono: { color: '#00d2d3', fontFamily: 'monospace', fontSize: 14, fontWeight: '600' },
    trackContainer: { height: 30, justifyContent: 'center', width: '100%' },
    trackBackground: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, flexDirection: 'row' },
    trackFill: { height: '100%', backgroundColor: '#4A90E2', borderRadius: 3 },
    controlDeck: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 4 },
    playPauseBtn: { backgroundColor: '#4A90E2', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, minWidth: 90, alignItems: 'center' },
    playPauseText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    microStepBtn: { backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
    stepBtnText: { color: '#fff', fontSize: 11, fontWeight: '500' },
    
    instructionsCard: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 15 },
    sectionHeader: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
    instructionText: { color: '#ddd', fontSize: 13, marginBottom: 8, lineHeight: 20 },
    tipBox: { backgroundColor: 'rgba(74,144,226,0.2)', padding: 12, borderRadius: 8, marginTop: 8, borderLeftWidth: 3, borderLeftColor: '#4A90E2' },
    tipText: { color: '#4A90E2', fontSize: 12, fontStyle: 'italic' },
    
    statusCard: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 20 },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    statusLabel: { color: '#aaa', fontSize: 13 },
    statusValue: { color: '#fff', fontFamily: 'monospace', fontSize: 13, fontWeight: '500' },
    angleValue: { color: '#2ed573', fontFamily: 'monospace', fontSize: 18, fontWeight: 'bold' },
    
    buttonGroup: { gap: 12, marginBottom: 30 },
    resetButton: { backgroundColor: 'rgba(255,69,58,0.8)', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    resetButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    calcButton: { backgroundColor: '#2ed573', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
    calcButtonDisabled: { backgroundColor: '#666', opacity: 0.5 },
    calcButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' }
});