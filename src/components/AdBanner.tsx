import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AD_CONFIG from '../config/ads';

interface AdBannerProps {
    size?: 'banner' | 'largeBanner' | 'mediumRectangle';
    isDark?: boolean;
    shouldLoad?: boolean;
}

const SIZE_MAP = {
    banner: BannerAdSize.BANNER,           // 320x50
    largeBanner: BannerAdSize.LARGE_BANNER, // 320x100
    mediumRectangle: BannerAdSize.MEDIUM_RECTANGLE, // 300x250
};

const REQUEST_OPTIONS = {
    requestNonPersonalizedAdsOnly: true,
};

function AdBanner({ size = 'banner', isDark = false, shouldLoad = true }: AdBannerProps) {
    const [adError, setAdError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Use test IDs in development for safety
    const adUnitId = __DEV__ ? TestIds.BANNER : AD_CONFIG.getBannerUnitId();

    const [adId, setAdId] = useState(Date.now());

    React.useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (shouldLoad) {
            // Delay ad loading slightly to prevent navigation jank/freeze
            timeout = setTimeout(() => {
                setAdId(Date.now()); // force a new key to completely remount BannerAd
                setIsReady(true);
            }, 300); // 300ms delay
        } else {
            setIsReady(false);
        }
        return () => clearTimeout(timeout);
    }, [shouldLoad]);

    if (adError) {
        // Show nothing if ad fails to load
        return null;
    }

    return (
        <View
            className={`items-center justify-center`}
            style={{ minHeight: 60 }}
        >
            {shouldLoad && isReady && (
                <BannerAd
                    key={`ad-${size}-${adId}`}
                    unitId={adUnitId}
                    size={SIZE_MAP[size]}
                    requestOptions={REQUEST_OPTIONS}
                    onAdLoaded={() => {
                        // console.log('Ad loaded successfully');
                    }}
                    onAdFailedToLoad={(error) => {
                        // console.log('Ad failed to load:', error);
                        setAdError(true);
                    }}
                />
            )}
        </View>
    );
}

// Custom comparison function for React.memo
// We IGNORE isDark changes to prevent heavy Ad reloads during theme toggle.
// The ad will maintain its current background until it naturally unmounts/remounts.
const adPropsAreEqual = (prevProps: Readonly<AdBannerProps>, nextProps: Readonly<AdBannerProps>) => {
    return (
        prevProps.size === nextProps.size &&
        prevProps.shouldLoad === nextProps.shouldLoad
    );
};

export default React.memo(AdBanner, adPropsAreEqual);
