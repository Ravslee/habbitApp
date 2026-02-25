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

export default function AdBanner({ size = 'banner', isDark = false, shouldLoad = true }: AdBannerProps) {
    const [adError, setAdError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Use test IDs in development for safety
    const adUnitId = __DEV__ ? TestIds.BANNER : AD_CONFIG.getBannerUnitId();

    React.useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (shouldLoad) {
            // Delay ad loading slightly to prevent navigation jank/freeze
            timeout = setTimeout(() => {
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
            className={`items-center justify-center py-2 ${isDark ? 'bg-slate-800/30' : 'bg-gray-100/50'}`}
            style={{ minHeight: 60 }}
        >
            {shouldLoad && isReady && (
                <BannerAd
                    unitId={adUnitId}
                    size={SIZE_MAP[size]}
                    requestOptions={REQUEST_OPTIONS}
                    onAdLoaded={() => {
                        console.log('Ad loaded successfully');
                    }}
                    onAdFailedToLoad={(error) => {
                        console.log('Ad failed to load:', error);
                        setAdError(true);
                    }}
                />
            )}
        </View>
    );
}
