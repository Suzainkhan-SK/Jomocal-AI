import React from 'react';
import { Composition } from 'remotion';
import { JomocalIntro } from './compositions/JomocalIntro';
import { AutomationShowcase } from './compositions/AutomationShowcase';

export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="JomocalIntro"
                component={JomocalIntro}
                durationInFrames={300}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    brandName: 'Jomocal AI',
                    tagline: 'Your 1-Click Automation Studio',
                }}
            />
            <Composition
                id="AutomationShowcase"
                component={AutomationShowcase}
                durationInFrames={300}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    automationName: 'Daily YouTube Shorts Maker',
                    description: 'Automatically creates and uploads marketing videos for you.',
                    platform: 'youtube',
                }}
            />
        </>
    );
};
