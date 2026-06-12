import React, { useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    TextInput,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { addDocument, queryDocuments, where, updateDocument, increment, orderBy, limit } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';

type Nav = StackNavigationProp<RootStackParamList, 'Act6RateActivity'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const Act6RateActivityPage: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { user } = useAuth();

    const [starRating, setStarRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleClose = () => {
        navigation.goBack();
    };

    const handleStarPress = (index: number) => {
        if (starRating === index) {
            setStarRating(0);
        } else {
            setStarRating(index);
        }
    };

    const handleFinish = async () => {
        if (starRating === 0) {
            Alert.alert('Rating Required', 'Please select a star rating before submitting.');
            return;
        }

        if (!comment.trim()) {
            Alert.alert('Comment Required', 'Please write your comment and feedback before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            await addDocument('activityRatings', {
                starRating,
                comment: comment.trim(),
                userId: user?.uid || 'anonymous',
                createdAt: new Date(),
            });

            // Award points to the user's team
            if (user) {
                try {
                    const teams = await queryDocuments('teams', [
                        where('memberIds', 'array-contains', user.uid),
                        orderBy('createdAt', 'desc'),
                        limit(1)
                    ]);
                    if (teams.length > 0) {
                        await updateDocument('teams', teams[0].id, {
                            points: increment(100)
                        });
                    }
                } catch (err) {
                    console.error('[Act6RateActivity] Failed to update team points:', err);
                }
            }

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error('[Act6RateActivity] Error saving rating:', error);
            Alert.alert('Error', 'Failed to save your rating. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

                    {/* Title bubble */}
                    <Image
                        source={require('../../assets/act6/act6Title.png')}
                        style={styles.titleBubble}
                        resizeMode="contain"
                    />

                    {/* Rate Box container */}
                    <View style={styles.boxContainer}>
                        <Image
                            source={require('../../assets/RateActAssets/rateBox.png')}
                            style={styles.rateBox}
                            resizeMode="contain"
                        />

                        {/* 5 Stars Row */}
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleStarPress(index)}
                                    activeOpacity={0.7}
                                    style={styles.starButton}
                                >
                                    <Image
                                        source={
                                            index <= starRating
                                                ? require('../../assets/RateActAssets/star2.png')
                                                : require('../../assets/RateActAssets/star1.png')
                                        }
                                        style={styles.starImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Comment / Feedback Input Box */}
                        <View style={styles.commentContainer}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder=""
                                placeholderTextColor="#888"
                                value={comment}
                                onChangeText={setComment}
                                multiline
                                textAlignVertical="top"
                            />
                            {comment.length === 0 && (
                                <View pointerEvents="none" style={styles.placeholderWrapper}>
                                    <Image
                                        source={require('../../assets/RateActAssets/Write your comment and feedback here.png')}
                                        style={styles.placeholderImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}
                        </View>

                        {/* Finish Button */}
                        <TouchableOpacity
                            style={styles.finishButton}
                            onPress={handleFinish}
                            activeOpacity={0.8}
                            disabled={submitting}
                        >
                            <Image
                                source={require('../../assets/RateActAssets/finishBtn.png')}
                                style={styles.finishImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Saturn planet — bottom of screen */}
                    <Image
                        source={require('../../assets/act6/mars.png')}
                        style={styles.mars}
                        resizeMode="contain"
                    />
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
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
    titleBubble: {
        position: 'absolute',
        top: s(140),
        alignSelf: 'center',
        width: s(390),
        height: s(180),
        left: s(30),
        zIndex: 2,
    },
    boxContainer: {
        position: 'absolute',
        top: s(320),
        alignSelf: 'center',
        width: s(374),
        height: s(583),
        zIndex: 5,
    },
    rateBox: {
        width: '100%',
        height: '100%',
    },
    starsContainer: {
        position: 'absolute',
        top: s(165),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: s(335),
        zIndex: 10,
    },
    starButton: {
        marginHorizontal: s(6),
        padding: s(2),
    },
    starImage: {
        width: s(50),
        height: s(50),
    },
    commentContainer: {
        position: 'absolute',
        top: s(290),
        left: s(45),
        alignSelf: 'center',
        width: s(300),
        height: s(180),
        zIndex: 10,
    },
    commentInput: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        paddingHorizontal: s(14),
        paddingTop: s(14),
        paddingBottom: s(14),
        fontSize: s(13),
        fontFamily: 'ShortStack_400Regular',
        color: '#333333',
    },
    placeholderWrapper: {
        position: 'absolute',
        top: s(12),
        left: s(12),
        width: s(240),
        height: s(30),
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
    },
    finishButton: {
        position: 'absolute',
        bottom: s(30),
        alignSelf: 'center',
        width: s(141),
        height: s(41),
        zIndex: 10,
    },
    finishImage: {
        width: '100%',
        height: '100%',
    },
    mars: {
        position: 'absolute',
        bottom: s(-30),
        right: s(-40),
        width: s(480),
        height: s(280),
        zIndex: 1,
    },
});

export default Act6RateActivityPage;