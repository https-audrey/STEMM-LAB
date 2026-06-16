// services/scoreService.ts
import { addDocument, updateDocument, queryDocuments, where, limit, orderBy } from './firestoreService';

export const submitActivityScore = async (
  userId: string,
  activityType: 'parachute' | 'handfan' | 'earthquake' | 'sound',
  sessionId: string,
  trialCount: number,
  hasReflection: boolean
) => {
  try {
    // Calculate score: 10 points per trial + 5 bonus for reflection
    const baseScore = trialCount * 10;
    const reflectionBonus = hasReflection ? 5 : 0;
    const totalScore = baseScore + reflectionBonus;

    // Get user's team
    const teams = await queryDocuments('teams', [
      where('memberIds', 'array-contains', userId),
      limit(1)
    ]);
    
    if (teams.length === 0) {
      console.warn('User is not in a team - score not recorded');
      return null;
    }
    
    const team = teams[0];
    
    // Update team points
    const newTotal = (team.points || 0) + totalScore;
    await updateDocument('teams', team.id, {
      points: newTotal,
      updatedAt: new Date().toISOString()
    });
    
    // Record the activity result
    await addDocument('team_activity_results', {
      teamId: team.id,
      userId: userId,
      activityType: activityType,
      trialCount: trialCount,
      reflectionBonus: reflectionBonus,
      totalScore: totalScore,
      sessionId: sessionId,
      submittedAt: new Date().toISOString()
    });
    
    console.log(`✅ Team ${team.name} earned ${totalScore} points for ${activityType}`);
    return totalScore;
    
  } catch (error) {
    console.error('Error submitting activity score:', error);
    throw error;
  }
};