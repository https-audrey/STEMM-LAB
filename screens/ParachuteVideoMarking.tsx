import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VideoView, useVideoPlayer } from 'expo-video';
import { RootStackParamList } from '../types/navigation';

type NavProp = StackNavigationProp<RootStackParamList, 'ParachuteVideoMarking'>;
type RouteProps = RouteProp<RootStackParamList, 'ParachuteVideoMarking'>;

export default function ParachuteVideoMarking() {
    const navigation = useNavigation<NavProp>();
    const route = useRoute<RouteProps>();

    const { videoUri, prototypeKey, mass, height, currentSessionId } = route.params || {};
    
    const validMass = typeof mass === 'number' ? mass : 0;
    const validHeight = typeof height === 'number' ? height : 0;
    
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [dropTime, setDropTime] = useState<number | null>(null);
    const [hitGroundTime, setHitGroundTime] = useState<number | null>(null);
    const [bounceTime, setBounceTime] = useState<number | null>(null);
    const [stopTime, setStopTime] = useState<number | null>(null);

    useEffect(() => {
        console.log('VideoMarking mounted with:', { videoUri, prototypeKey, validMass, validHeight });
        
        if (!videoUri) {
            Alert.alert('Error', 'No video URI provided', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
        
        if (validMass === 0 || validHeight === 0) {
            console.warn('Mass or height is zero, using default values');
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

    const markTimeEvent = (type: 'drop' | 'hit' | 'bounce' | 'stop') => {
        if (!player) return;
        const time = player.currentTime;
        switch (type) {
            case 'drop': setDropTime(time); break;
            case 'hit': setHitGroundTime(time); break;
            case 'bounce': setBounceTime(time); break;
            case 'stop': setStopTime(time); break;
        }
    };

    const handleCalculateMetrics = () => {
        if (dropTime === null || hitGroundTime === null || stopTime === null) {
            Alert.alert('Missing Milestones', 'Please log timestamps for Drop, Ground Impact, and Stable Stop.');
            return;
        }
        if (hitGroundTime <= dropTime) {
            Alert.alert('Timeline Error', 'Ground impact must occur sequentially after launch.');
            return;
        }
        if (stopTime <= hitGroundTime) {
            Alert.alert('Timeline Error', 'The stable recovery stop must settle after impact.');
            return;
        }

        navigation.navigate('ParachuteResult', {
            data: { 
                currentSessionId: currentSessionId ?? '',
                videoUri, 
                prototypeKey, 
                mass: validMass, 
                height: validHeight, 
                dropTime: dropTime ?? 0, 
                hitGroundTime: hitGroundTime ?? 0, 
                bounceTime: bounceTime ?? null, 
                stopTime: stopTime ?? 0, 
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
            <Text style={styles.title}>Timeline Analysis Workspace</Text>
            <Text style={styles.subtitle}>Target Active Profile: <Text style={{color: '#ffa502'}}>{prototypeKey?.toUpperCase()}</Text></Text>

            <View style={styles.videoWrapper}>
                <VideoView style={styles.absoluteFill} player={player} nativeControls={false} />
            </View>

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

            <View style={styles.controlsBlock}>
                <Text style={styles.sectionHeader}>Capture Physics Events:</Text>

                <View style={styles.markerRow}>
                    <Pressable style={styles.captureBtn} onPress={() => markTimeEvent('drop')}>
                        <Text style={styles.captureBtnText}>Set Drop Frame 🛫</Text>
                    </Pressable>
                    <Text style={styles.markerValText}>{dropTime ? `${dropTime.toFixed(3)}s` : '--'}</Text>
                </View>

                <View style={styles.markerRow}>
                    <Pressable style={styles.captureBtn} onPress={() => markTimeEvent('hit')}>
                        <Text style={styles.captureBtnText}>Set First Impact 💥</Text>
                    </Pressable>
                    <Text style={styles.markerValText}>{hitGroundTime ? `${hitGroundTime.toFixed(3)}s` : '--'}</Text>
                </View>

                <View style={styles.markerRow}>
                    <Pressable style={[styles.captureBtn, {backgroundColor: '#6c5ce7'}]} onPress={() => markTimeEvent('bounce')}>
                        <Text style={styles.captureBtnText}>Set Peak Bounce (Optional) 🔄</Text>
                    </Pressable>
                    <Text style={styles.markerValText}>{bounceTime ? `${bounceTime.toFixed(3)}s` : 'None'}</Text>
                </View>

                <View style={styles.markerRow}>
                    <Pressable style={styles.captureBtn} onPress={() => markTimeEvent('stop')}>
                        <Text style={styles.captureBtnText}>Set Stable Stop 🛑</Text>
                    </Pressable>
                    <Text style={styles.markerValText}>{stopTime ? `${stopTime.toFixed(3)}s` : '--'}</Text>
                </View>
            </View>

            <Pressable style={styles.calcButton} onPress={handleCalculateMetrics}>
                <Text style={styles.calcButtonText}>Process Physics Analytics 📊</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#071A3D', padding: 20 },
    absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    title: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 30 },
    subtitle: { color: '#bbb', fontSize: 14, textAlign: 'center', marginBottom: 20 },
    videoWrapper: { width: '100%', height: Dimensions.get('window').height * 0.3, backgroundColor: '#000', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
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
    controlsBlock: { gap: 12, marginBottom: 30 },
    sectionHeader: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 5 },
    markerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 12 },
    captureBtn: { backgroundColor: '#341f97', paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10, flex: 0.65 },
    captureBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    markerValText: { color: '#fff', fontFamily: 'monospace', fontSize: 15, marginRight: 10, flex: 0.3, textAlign: 'right' },
    calcButton: { backgroundColor: '#2ed573', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
    calcButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' }
});