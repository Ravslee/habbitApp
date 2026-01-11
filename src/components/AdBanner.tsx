import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AD_CONFIG from '../config/ads';

interface AdBannerProps {
    size?: 'banner' | 'largeBanner' | 'mediumRectangle';
    isDark?: boolean;
}

const SIZE_MAP = {
    banner: BannerAdSize.BANNER,           // 320x50
    largeBanner: BannerAdSize.LARGE_BANNER, // 320x100
    mediumRectangle: BannerAdSize.MEDIUM_RECTANGLE, // 300x250
};

export default function AdBanner({ size = 'banner', isDark = false }: AdBannerProps) {
    const [adError, setAdError] = useState(false);

    // Use test IDs in development for safety
    const adUnitId = __DEV__ ? TestIds.BANNER : AD_CONFIG.getBannerUnitId();

    if (adError) {
        // Show nothing if ad fails to load
        return null;
    }

    return (
        <View
            className={`items-center justify-center py-2 ${isDark ? 'bg-slate-800/30' : 'bg-gray-100/50'}`}
            style={{ minHeight: 60 }}
        >
            <BannerAd
                unitId={adUnitId}
                size={SIZE_MAP[size]}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdLoaded={() => {
                    console.log('Ad loaded successfully');
                }}
                onAdFailedToLoad={(error) => {
                    console.log('Ad failed to load:', error);
                    setAdError(true);
                }}
            />
        </View>
    );
}
