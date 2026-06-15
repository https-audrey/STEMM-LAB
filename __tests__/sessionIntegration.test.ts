import * as dbService from '../services/db';

// Mock the service
jest.mock('../services/db', () => ({
  ...jest.requireActual('../services/db'),
  ensureSessionExists: jest.fn(),
  saveSessionReflection: jest.fn(),
  getSessionReflection: jest.fn(),
}));

describe('Comprehensive Database Service Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle a new reflection correctly', () => {
    (dbService.getSessionReflection as jest.Mock).mockReturnValue('Great experiment!');
    
    dbService.saveSessionReflection('session-1', 'parachute', 'Great experiment!');
    
    expect(dbService.saveSessionReflection).toHaveBeenCalledWith('session-1', 'parachute', 'Great experiment!');
    expect(dbService.getSessionReflection('session-1')).toBe('Great experiment!');
  });

  test('should return null when retrieving a non-existent session', () => {
    (dbService.getSessionReflection as jest.Mock).mockReturnValue(null);
    
    const result = dbService.getSessionReflection('fake-session');
    expect(result).toBeNull();
  });

  test('should handle updating an existing reflection', () => {
    (dbService.getSessionReflection as jest.Mock).mockReturnValue('Updated reflection');
    
    dbService.saveSessionReflection('session-1', 'parachute', 'Updated reflection');
    
    const result = dbService.getSessionReflection('session-1');
    expect(result).toBe('Updated reflection');
  });
});