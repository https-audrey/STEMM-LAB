import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RateActivityPage from '../RateActivityPage';

// Mock navigation
const mockGoBack = jest.fn();
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        goBack: mockGoBack,
        reset: mockReset,
    }),
}));

// Mock Auth Context
const mockUser = { uid: 'test-user-123' };
const mockUseAuth = jest.fn(() => ({
    user: mockUser,
    profile: null,
    loading: false,
    refreshProfile: jest.fn(),
}));
jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock Firestore Service
const mockAddDocument = jest.fn();
const mockQueryDocuments = jest.fn();
const mockUpdateDocument = jest.fn();
const mockWhere = jest.fn((field, op, val) => ({ field, op, val }));
const mockIncrement = jest.fn((val) => ({ type: 'increment', value: val }));
jest.mock('../../../services/firestoreService', () => ({
    addDocument: (...args: any[]) => mockAddDocument(...args),
    queryDocuments: (...args: any[]) => mockQueryDocuments(...args),
    updateDocument: (...args: any[]) => mockUpdateDocument(...args),
    where: (...args: any[]) => mockWhere(...args),
    increment: (...args: any[]) => mockIncrement(...args),
    orderBy: jest.fn(),
    limit: jest.fn(),
}));

describe('RateActivityPage Tests', () => {
    let mockAlert: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
        mockUseAuth.mockReturnValue({
            user: mockUser,
            profile: null,
            loading: false,
            refreshProfile: jest.fn(),
        });
    });

    afterEach(() => {
        mockAlert.mockRestore();
    });

    // ─── 1. UNIT TESTS ──────────────────────────────────────────────────────────
    describe('1. Unit Tests (Component & Validation)', () => {
        it('should render the UI components correctly with initial empty state', () => {
            const { getByTestId, queryByTestId } = render(<RateActivityPage />);

            // Check elements are present
            expect(getByTestId('close-button')).toBeTruthy();
            expect(getByTestId('finish-button')).toBeTruthy();
            expect(getByTestId('comment-input')).toBeTruthy();

            // All stars should be empty initially
            for (let i = 1; i <= 5; i++) {
                expect(getByTestId(`star-image-${i}-empty`)).toBeTruthy();
                expect(queryByTestId(`star-image-${i}-filled`)).toBeNull();
            }
        });

        it('should toggle the star rating when tapped', () => {
            const { getByTestId, queryByTestId } = render(<RateActivityPage />);

            // Tap star 4
            fireEvent.press(getByTestId('star-button-4'));

            // Stars 1 to 4 should be filled, star 5 empty
            for (let i = 1; i <= 4; i++) {
                expect(getByTestId(`star-image-${i}-filled`)).toBeTruthy();
            }
            expect(getByTestId('star-image-5-empty')).toBeTruthy();

            // Tap star 4 again to toggle/deselect it
            fireEvent.press(getByTestId('star-button-4'));

            // All stars should be empty now
            for (let i = 1; i <= 5; i++) {
                expect(getByTestId(`star-image-${i}-empty`)).toBeTruthy();
                expect(queryByTestId(`star-image-${i}-filled`)).toBeNull();
            }
        });

        it('should show an Alert if "Finish" is pressed with 0 stars selected', async () => {
            const { getByTestId } = render(<RateActivityPage />);
            
            // Press finish without selecting stars
            fireEvent.press(getByTestId('finish-button'));

            expect(mockAlert).toHaveBeenCalledWith(
                'Rating Required',
                'Please select a star rating before submitting.'
            );
            expect(mockAddDocument).not.toHaveBeenCalled();
        });

        it('should show an Alert if "Finish" is pressed with star rating but empty comment', async () => {
            const { getByTestId } = render(<RateActivityPage />);

            // Select star 3
            fireEvent.press(getByTestId('star-button-3'));

            // Press finish (comment is empty)
            fireEvent.press(getByTestId('finish-button'));

            expect(mockAlert).toHaveBeenCalledWith(
                'Comment Required',
                'Please write your comment and feedback before submitting.'
            );
            expect(mockAddDocument).not.toHaveBeenCalled();
        });

        it('should navigate back when Close (X) button is pressed', () => {
            const { getByTestId } = render(<RateActivityPage />);

            fireEvent.press(getByTestId('close-button'));
            expect(mockGoBack).toHaveBeenCalledTimes(1);
        });
    });

    // ─── 2. INTEGRATION TESTS ───────────────────────────────────────────────────
    describe('2. Integration Tests (Context & Services)', () => {
        it('should submit rating with anonymous userId if user is not logged in', async () => {
            // Mock useAuth to return no user (anonymous case)
            mockUseAuth.mockReturnValue({
                user: null,
                profile: null,
                loading: false,
                refreshProfile: jest.fn(),
            });

            const { getByTestId } = render(<RateActivityPage />);

            // Select 5 stars
            fireEvent.press(getByTestId('star-button-5'));

            // Type comment
            fireEvent.changeText(getByTestId('comment-input'), 'Excellent activity!');

            // Press finish
            fireEvent.press(getByTestId('finish-button'));

            await waitFor(() => {
                expect(mockAddDocument).toHaveBeenCalledWith('activityRatings', expect.objectContaining({
                    starRating: 5,
                    comment: 'Excellent activity!',
                    userId: 'anonymous',
                    createdAt: expect.any(Date),
                }));
            });

            // For anonymous user, team queries and updates must be skipped
            expect(mockQueryDocuments).not.toHaveBeenCalled();
            expect(mockUpdateDocument).not.toHaveBeenCalled();

            // Should navigate home
            expect(mockReset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        });

        it('should query user teams and award 100 points to the most recent team for an authenticated user', async () => {
            mockAddDocument.mockResolvedValue('new-rating-id');
            const mockTeams = [
                { id: 'team-old', createdAt: new Date('2026-06-10T12:00:00Z'), points: 50 },
                { id: 'team-new', createdAt: new Date('2026-06-14T12:00:00Z'), points: 120 },
            ];
            mockQueryDocuments.mockResolvedValue(mockTeams);

            const { getByTestId } = render(<RateActivityPage />);

            // Select 3 stars and fill comment
            fireEvent.press(getByTestId('star-button-3'));
            fireEvent.changeText(getByTestId('comment-input'), 'Pretty fun!');

            fireEvent.press(getByTestId('finish-button'));

            await waitFor(() => {
                expect(mockAddDocument).toHaveBeenCalled();
            });

            // Verify team queries are triggered with correct where constraint
            expect(mockQueryDocuments).toHaveBeenCalledWith('teams', [
                expect.objectContaining({ field: 'memberIds', op: 'array-contains', val: mockUser.uid })
            ]);

            // Verify points are awarded to the most recent team ('team-new')
            expect(mockUpdateDocument).toHaveBeenCalledWith('teams', 'team-new', {
                points: { type: 'increment', value: 100 }
            });

            // Verify home navigation reset
            expect(mockReset).toHaveBeenCalled();
        });

        it('should show an Alert if rating submission fails', async () => {
            mockAddDocument.mockRejectedValue(new Error('Firestore error'));

            const { getByTestId } = render(<RateActivityPage />);

            // Select star and enter comment
            fireEvent.press(getByTestId('star-button-2'));
            fireEvent.changeText(getByTestId('comment-input'), 'Buggy screen');

            fireEvent.press(getByTestId('finish-button'));

            await waitFor(() => {
                expect(mockAlert).toHaveBeenCalledWith(
                    'Error',
                    'Failed to save your rating. Please try again.'
                );
            });

            // Should not reset navigation
            expect(mockReset).not.toHaveBeenCalled();
        });
    });

    // ─── 3. END-TO-END FLOW SIMULATION ──────────────────────────────────────────
    describe('3. End-to-End Flow Simulation', () => {
        it('should simulate full user journey: select stars, type comment, submit, save to firestore, award points, and navigate home', async () => {
            mockAddDocument.mockResolvedValue('rating-doc-id');
            const mockTeams = [
                { id: 'user-team', createdAt: new Date(), points: 10 },
            ];
            mockQueryDocuments.mockResolvedValue(mockTeams);

            const { getByTestId, queryByTestId } = render(<RateActivityPage />);

            // 1. Initial State assertions
            expect(queryByTestId('star-image-4-filled')).toBeNull();

            // 2. Select 4 stars
            fireEvent.press(getByTestId('star-button-4'));
            expect(getByTestId('star-image-4-filled')).toBeTruthy();

            // 3. Type feedback comment
            fireEvent.changeText(getByTestId('comment-input'), 'Really loved the speed challenge!');

            // 4. Click Finish
            fireEvent.press(getByTestId('finish-button'));

            // 5. Verify asynchronous execution completes all E2E actions
            await waitFor(() => {
                // Assert rating was saved
                expect(mockAddDocument).toHaveBeenCalledWith('activityRatings', {
                    starRating: 4,
                    comment: 'Really loved the speed challenge!',
                    userId: mockUser.uid,
                    createdAt: expect.any(Date),
                });
                // Assert team points updated
                expect(mockUpdateDocument).toHaveBeenCalledWith('teams', 'user-team', {
                    points: { type: 'increment', value: 100 }
                });
                // Assert navigated to Home screen
                expect(mockReset).toHaveBeenCalledWith({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            });
        });
    });
});
