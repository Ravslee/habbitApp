import { HabitHistory } from "../../App";

export const calculateStreak = (habitId: number, history: HabitHistory): number => {
    let streak = 0;
    const today = new Date();

    // Check from today backwards
    // If today is completed, start counting.
    // If today is not completed, check if yesterday was completed to keep the streak alive?
    // Usually, a streak is valid if completed today OR (not completed today but completed yesterday).
    // Actually, if I haven't done it today, my current active streak is technically what I had yesterday, 
    // but if I miss today, it breaks tomorrow.
    // For UI "Current Streak", usually we show the count including today if done.
    // If not done today, we show yesterday's streak.

    // Simple algorithm:
    // 1. Check today. If done, streak = 1, continue to yesterday.
    // 2. If not done today, check yesterday. If done, streak = 0 (start counting from yesterday), continue.
    // 3. If neither, streak is 0.

    // Wait, correct logic:
    // Loop days backwards.
    // day 0 = today.
    // day 1 = yesterday.

    for (let i = 0; i < 365; i++) { // Limit check to a year for performance
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const completedOnDate = history[dateStr]?.includes(habitId);

        if (i === 0) {
            if (completedOnDate) {
                streak++;
            } else {
                // If not completed today, we don't increment, but we don't break yet, 
                // because the user might do it later today.
                // We check yesterday.
                continue;
            }
        } else {
            if (completedOnDate) {
                streak++;
            } else {
                // If we missed a day (prior to today), streak is broken.
                break;
            }
        }
    }

    return streak;
};
