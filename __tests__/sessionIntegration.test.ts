import {
  saveSessionReflection,
  getSessionReflection,
  markSessionSubmitted,
  getAllSessions,
  ensureSessionExists,
} from '../services/db';

describe('Session Management Integration Tests', () => {
  
  // Helper to create unique session ID for each test
  const createTestSessionId = () => `test_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  describe('Complete Session Lifecycle', () => {
    it('should create, update, and submit a session successfully', () => {
      // ARRANGE: Create a unique session ID
      const sessionId = createTestSessionId();
      const activityType = 'parachute';
      const initialReflection = 'Initial thoughts: The parachute needs more drag.';
      const updatedReflection = 'After testing: Adding folds reduced the fall speed!';
      
      // ACT: Simulate the session lifecycle
      
      // Step 1: Ensure session exists
      ensureSessionExists(sessionId, activityType);
      
      // Step 2: Save initial reflection
      saveSessionReflection(sessionId, activityType, initialReflection);
      
      // Step 3: Verify reflection was saved
      const retrievedInitial = getSessionReflection(sessionId);
      
      // Step 4: Update reflection with new findings
      saveSessionReflection(sessionId, activityType, updatedReflection);
      
      // Step 5: Verify reflection was updated
      const retrievedUpdated = getSessionReflection(sessionId);
      
      // Step 6: Mark session as submitted
      markSessionSubmitted(sessionId);
      
      // Step 7: Get all sessions to verify it exists
      const allSessions = getAllSessions();
      const foundSession = allSessions.find(s => s.session_id === sessionId);
      
      // ASSERT
      expect(retrievedInitial).toBe(initialReflection);
      expect(retrievedUpdated).toBe(updatedReflection);
      expect(retrievedUpdated).not.toBe(initialReflection);
      expect(foundSession).toBeDefined();
      expect(foundSession?.activity_type).toBe(activityType);
      expect(foundSession?.submitted_at).not.toBeNull();
    });

    it('should handle multiple sessions independently without mixing data', () => {
      // ARRANGE: Create two separate sessions
      const session1 = createTestSessionId();
      const session2 = createTestSessionId();
      const reflection1 = 'Parachute experiment results';
      const reflection2 = 'Earthquake experiment results';
      
      // ACT: Save different data to each session
      ensureSessionExists(session1, 'parachute');
      ensureSessionExists(session2, 'earthquake');
      
      saveSessionReflection(session1, 'parachute', reflection1);
      saveSessionReflection(session2, 'earthquake', reflection2);
      
      // ASSERT: Each session should have its own data, not mixed
      expect(getSessionReflection(session1)).toBe(reflection1);
      expect(getSessionReflection(session2)).toBe(reflection2);
      expect(getSessionReflection(session1)).not.toBe(reflection2);
      
      // Verify both sessions appear in all sessions list
      const allSessions = getAllSessions();
      const session1Exists = allSessions.some(s => s.session_id === session1);
      const session2Exists = allSessions.some(s => s.session_id === session2);
      
      expect(session1Exists).toBe(true);
      expect(session2Exists).toBe(true);
    });

    it('should handle empty reflection updates gracefully', () => {
      // ARRANGE
      const sessionId = createTestSessionId();
      const initialReflection = 'Initial reflection with content';
      const emptyReflection = '';
      
      // ACT
      ensureSessionExists(sessionId, 'handfan');
      saveSessionReflection(sessionId, 'handfan', initialReflection);
      expect(getSessionReflection(sessionId)).toBe(initialReflection);
      
      // Update with empty string
      saveSessionReflection(sessionId, 'handfan', emptyReflection);
      
      // ASSERT: Empty reflection should be saved (not ignored)
      const retrieved = getSessionReflection(sessionId);
      expect(retrieved).toBe(emptyReflection);
      expect(retrieved).not.toBe(initialReflection);
    });
  });
});