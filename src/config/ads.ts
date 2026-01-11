// Ad configuration for HabbitApp
// Using Google's test Ad Unit IDs for development
// Replace with your own Ad Unit IDs from AdMob for production

export const AD_CONFIG = {
    // Set to false when you have real Ad Unit IDs from AdMob
    isTestMode: true,

    // Test Ad Unit IDs from Google (for development only)
    // These will show test ads that say "Test Ad"
    testBannerUnitId: 'ca-app-pub-3940256099942544/6300978111',
    testInterstitialUnitId: 'ca-app-pub-3940256099942544/1033173712',
    testRewardedUnitId: 'ca-app-pub-3940256099942544/5224354917',

    // Production Ad Unit IDs (replace with your own from AdMob)
    // Get these from: https://admob.google.com
    prodBannerUnitId: 'ca-app-pub-4344122111795358/2747217648',
    prodInterstitialUnitId: 'ca-app-pub-4344122111795358/7469061280',
    prodRewardedUnitId: 'ca-app-pub-4344122111795358/5510796564',

    // Get the appropriate Ad Unit ID based on mode
    getBannerUnitId: function () {
        return this.isTestMode ? this.testBannerUnitId : this.prodBannerUnitId;
    },
    getInterstitialUnitId: function () {
        return this.isTestMode ? this.testInterstitialUnitId : this.prodInterstitialUnitId;
    },
    getRewardedUnitId: function () {
        return this.isTestMode ? this.testRewardedUnitId : this.prodRewardedUnitId;
    },
};

export default AD_CONFIG;
