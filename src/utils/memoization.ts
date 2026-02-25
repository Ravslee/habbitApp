
// Utility to prevent re-renders of hidden screens
export const screenPropsAreEqual = (prevProps: any, nextProps: any) => {
    // If the screen is hidden and remains hidden, do NOT re-render
    // This prevents background screens from processing theme updates until they become visible
    if (!prevProps.isVisible && !nextProps.isVisible) {
        return true;
    }

    // Otherwise, use default React behavior (shallow comparison of props would be standard, 
    // but since we want to handle the specific case above, we can return false to force render 
    // when visible, or we could do a shallow compare. 
    // Returning false ensures that when it *does* become visible, or if it *is* visible, 
    // it updates normally if other props change.)
    return false;
};
