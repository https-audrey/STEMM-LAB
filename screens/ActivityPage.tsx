import React, { useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type Nav = StackNavigationProp<RootStackParamList, 'Activity'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const ActivityPage: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const [selectedSubject, setSelectedSubject] = useState<'physics' | 'biology' | 'chemistry' | 'mathematics' | null>(null);

    const handleNavigateHome = () => {
        navigation.navigate('Home');
    };

    const handleNavigateTeam = () => {
        navigation.navigate('NoTeam');
    };

    const handleNavigateLeaderboard = () => {
        navigation.navigate('Leaderboard');
    };

    const handleNavigateProfile = () => {
        navigation.navigate('Profile');
    };

    const getPhysicsAsset = () => {
        return selectedSubject === null
            ? require('../assets/HomescreenAssets/phy.png')
            : require('../assets/HomescreenAssets/phy2.png');
    };

    const getBiologyAsset = () => {
        return selectedSubject === 'biology'
            ? require('../assets/HomescreenAssets/bio2.png')
            : require('../assets/HomescreenAssets/bio.png');
    };

    const getChemistryAsset = () => {
        return selectedSubject === 'chemistry'
            ? require('../assets/HomescreenAssets/chem2.png')
            : require('../assets/HomescreenAssets/chem.png');
    };

    const getMathematicsAsset = () => {
        return selectedSubject === 'mathematics'
            ? require('../assets/HomescreenAssets/math2.png')
            : require('../assets/HomescreenAssets/math.png');
    };

    return (
        <View style={styles.container}>
            {/* Full-screen space background */}
            <ImageBackground
                source={require('../assets/OnBoardingAssets/bgImg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                {/* Top Progress Box */}
                <Image
                    source={require('../assets/ActivityAssets/boxTopLvl.png')}
                    style={styles.boxTopLvl}
                    resizeMode="contain"
                />

                {/* Category Buttons Row */}
                <View style={styles.categoriesRow}>
                    {/* Physics Tab */}
                    <TouchableOpacity
                        style={[styles.categoryTab, { left: s(38) }]}
                        onPress={() => setSelectedSubject(null)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={getPhysicsAsset()}
                            style={styles.categoryImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Biology Tab */}
                    <TouchableOpacity
                        style={[styles.categoryTab, { left: s(132) }]}
                        onPress={() => setSelectedSubject(prev => prev === 'biology' ? null : 'biology')}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={getBiologyAsset()}
                            style={styles.categoryImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Chemistry Tab */}
                    <TouchableOpacity
                        style={[styles.categoryTab, { left: s(226) }]}
                        onPress={() => setSelectedSubject(prev => prev === 'chemistry' ? null : 'chemistry')}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={getChemistryAsset()}
                            style={styles.categoryImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Mathematics Tab */}
                    <TouchableOpacity
                        style={[styles.categoryTab, { left: s(320) }]}
                        onPress={() => setSelectedSubject(prev => prev === 'mathematics' ? null : 'mathematics')}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={getMathematicsAsset()}
                            style={styles.categoryImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* Map Card Box (levelBox.png) */}
                <ImageBackground
                    source={require('../assets/ActivityAssets/levelBox.png')}
                    style={styles.levelBox}
                    resizeMode="stretch"
                >
                    {/* Level Title Header Banner (rendered at the top of levelBox) */}
                    <View pointerEvents="none" style={styles.levelTitleBanner}>
                        <Image
                            source={require('../assets/HomescreenAssets/levelTitle.png')}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View pointerEvents="none" style={styles.gradeTitleText}>
                        <Image
                            source={require('../assets/HomescreenAssets/Grade 8 - Physics.png')}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Planet 1 (ACT 1) */}
                    <TouchableOpacity
                        style={[styles.planetNode, { top: s(430), left: s(33), width: s(100), height: s(100), zIndex: 5 }]}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../assets/HomescreenAssets/planet 1.png')}
                            style={styles.planetImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Planet 2 (ACT 2) */}
                    <TouchableOpacity
                        style={[styles.planetNode, { top: s(400), left: s(210), width: s(100), height: s(100), zIndex: 5 }]}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../assets/HomescreenAssets/planet 2.png')}
                            style={styles.planetImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Planet 3 (ACT 3) */}
                    <TouchableOpacity
                        style={[styles.planetNode, { top: s(310), left: s(88), width: s(100), height: s(100), zIndex: 5 }]}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../assets/HomescreenAssets/planet 3.png')}
                            style={styles.planetImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Planet 4 (ACT 4) */}
                    <TouchableOpacity
                        style={[styles.planetNode, { top: s(190), left: s(25), width: s(100), height: s(100), zIndex: 5 }]}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../assets/HomescreenAssets/planet 4.png')}
                            style={styles.planetImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Planet 5 (ACT 5) */}
                    <TouchableOpacity
                        style={[styles.planetNode, { top: s(290), left: s(240), width: s(100), height: s(100), zIndex: 5 }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Act5Start')}
                    >
                        <Image
                            source={require('../assets/HomescreenAssets/planet 5.png')}
                            style={styles.planetImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Planet 6 (ACT 6) */}
                    <TouchableOpacity
                        style={[styles.planetNode, { top: s(115), left: s(210), width: s(110), height: s(110), zIndex: 5 }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Act6Start')}
                    >
                        <Image
                            source={require('../assets/HomescreenAssets/planet 6.png')}
                            style={styles.planetImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Planet 7 (ACT 7) */}
                    <TouchableOpacity
                        style={[styles.planetNode, { top: s(60), left: s(65), width: s(105), height: s(105), zIndex: 5 }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Act7Start')}
                    >
                        <Image
                            source={require('../assets/ActivityAssets/planet 7.png')}
                            style={styles.planetImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </ImageBackground>

                {/* Big Earth Planet at bottom base */}
                <Image
                    source={require('../assets/HomescreenAssets/bigEarth.png')}
                    style={styles.bigEarth}
                    resizeMode="contain"
                />

                {/* Bottom Navigation Bar */}
                <Image
                    source={require('../assets/HomescreenAssets/navbarBox.png')}
                    style={styles.navbarBox}
                    resizeMode="contain"
                />

                {/* Home Button */}
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={handleNavigateHome}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../assets/HomescreenAssets/home.png')}
                        style={styles.homeImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* Team Button */}
                <TouchableOpacity
                    style={styles.teamButton}
                    onPress={handleNavigateTeam}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../assets/HomescreenAssets/team.png')}
                        style={styles.teamImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* Levels Button (Active) */}
                <TouchableOpacity style={styles.levelsButton} activeOpacity={1.0}>
                    <Image
                        source={require('../assets/HomescreenAssets/activity.png')}
                        style={styles.levelsImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* Leaderboard Button */}
                <TouchableOpacity
                    style={styles.leaderboardButton}
                    onPress={handleNavigateLeaderboard}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../assets/HomescreenAssets/leaderboard.png')}
                        style={styles.leaderboardImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* Profile Button */}
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={handleNavigateProfile}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../assets/HomescreenAssets/profile.png')}
                        style={styles.profileImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
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
    boxTopLvl: {
        position: 'absolute',
        top: s(85),
        alignSelf: 'center',
        width: s(369),
        height: s(98),
    },
    categoriesRow: {
        position: 'absolute',
        top: s(205),
        width: '100%',
        height: s(50),
    },
    categoryTab: {
        position: 'absolute',
        width: s(85),
        height: s(48),
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    levelBox: {
        position: 'absolute',
        top: s(275),
        alignSelf: 'center',
        width: s(374),
        height: s(553),
        zIndex: 10,
    },
    levelTitleBanner: {
        position: 'absolute',
        top: s(0),
        alignSelf: 'center',
        width: s(374),
        height: s(54),
        zIndex: 3,
    },
    gradeTitleText: {
        position: 'absolute',
        top: s(13),
        alignSelf: 'center',
        width: s(250),
        height: s(28),
        zIndex: 3,
    },
    planetNode: {
        position: 'absolute',
    },
    planetImage: {
        width: '100%',
        height: '100%',
    },
    bigEarth: {
        position: 'absolute',
        top: s(730),
        left: s(-60),
        width: s(600),
        height: s(250),
        zIndex: 1,
    },
    navbarBox: {
        position: 'absolute',
        top: s(790),
        left: s(1),
        width: s(440),
        height: s(250),
        zIndex: 20,
    },
    homeButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: s(870),
        left: s(12),
        zIndex: 21,
    },
    homeImage: {
        width: s(90),
        height: s(90),
    },
    teamButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: s(884),
        left: s(95),
        zIndex: 21,
    },
    teamImage: {
        width: s(90),
        height: s(70),
    },
    levelsButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: s(880),
        left: s(188),
        zIndex: 21,
    },
    levelsImage: {
        width: s(80),
        height: s(80),
    },
    leaderboardButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: s(880),
        left: s(275),
        zIndex: 21,
    },
    leaderboardImage: {
        width: s(82),
        height: s(72),
    },
    profileButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: s(873),
        left: s(353),
        zIndex: 21,
    },
    profileImage: {
        width: s(83),
        height: s(83),
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
});

export default ActivityPage;
