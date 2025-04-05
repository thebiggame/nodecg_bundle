/* eslint-disable max-len */

import {
  type Clock,
  type AlertData,
  type AlertDelay,
  type AlertFlair,
  type CountdownActive,
  type CountdownName,
  type CountdownData,
  type EventInfoActive,
  type EventInfoData,
  type HalfwipeData,
  type HalfwipeActive,
  type LowerthirdData,
  type LowerthirdActive,
  type PersonsActive,
  type PersonsData,
  type ProjectorActive,
  ScoreboardActive,
  ScoreboardData,
  BandwidthData,
} from '@thebiggame/types/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */

// Clock.
export const repClock = nodecg().Replicant<Clock>('clock', {
  defaultValue: Date.now().toString(),
  persistent: false,
});

// Countdown.
export const repCountdownData = nodecg().Replicant<CountdownData>(
  'countdown:data',
  {
    defaultValue: 0,
    persistent: false,
  },
);

export const repCountdownName = nodecg().Replicant<CountdownName>(
  'countdown:name',
  {
    defaultValue: '',
    persistent: true,
  },
);
export const repCountdownActive = nodecg().Replicant<CountdownActive>(
  'countdown:active',
  {
    defaultValue: false,
    persistent: false,
  },
);

// Halfwipe.
export const repHalfwipeData = nodecg().Replicant<HalfwipeData>(
  'halfwipe:data',
  {
    defaultValue: {
      now: 'theBIGGAME',
      next: '',
    },
    persistent: true,
  },
);
export const repHalfwipeActive = nodecg().Replicant<HalfwipeActive>(
  'halfwipe:active',
  {
    defaultValue: false,
    persistent: true,
  },
);

// Lowerthird.
export const repLowerthirdData = nodecg().Replicant<LowerthirdData>(
  'lowerthird:data',
  {
    defaultValue: 'theBIGGAME',
    persistent: true,
  },
);
export const repLowerthirdActive = nodecg().Replicant<LowerthirdActive>(
  'lowerthird:active',
  {
    defaultValue: false,
    persistent: true,
  },
);

// Network bandwidth.
export const repNetworkWANBandwidth = nodecg().Replicant<BandwidthData>(
  'network:wan:bandwidth',
);

// Notifications - Events.
export const repEventInfoBody = nodecg().Replicant<EventInfoData>(
  'event:info:body',
  {
    defaultValue: 'theBIGGAME',
    persistent: true,
  },
);
export const repEventInfoActive = nodecg().Replicant<EventInfoActive>(
  'event:info:active',
  {
    defaultValue: false,
    persistent: true,
  },
);

// Notifications - Alerts.
export const repAlertData = nodecg().Replicant<AlertData>('alert:data', {
  defaultValue: 'Pay Attention!',
  persistent: false,
});
export const repAlertFlair = nodecg().Replicant<AlertFlair>('alert:flair', {
  defaultValue: false,
  persistent: false,
});
export const repAlertDelay = nodecg().Replicant<AlertDelay>('alert:delay', {
  defaultValue: 0,
  persistent: false,
});

export const repScoreboardData = nodecg().Replicant<ScoreboardData>(
  'scoreboard:data',
  {
    defaultValue: {
      title: '',
      team1: {
        name: 'Player 1',
        score: 0,
      },
      team2: {
        name: 'Player 2',
        score: 0,
      },
    },
    persistent: true,
  },
);
export const repScoreboardActive = nodecg().Replicant<ScoreboardActive>(
  'scoreboard:active',
  {
    defaultValue: false,
    persistent: true,
  },
);

// Projector - global animate in state.
export const repProjectorActive = nodecg().Replicant<ProjectorActive>(
  'projector:active',
  {
    defaultValue: true,
    persistent: true,
  },
);

// Scoreboard.
export const repPersonsData = nodecg().Replicant<PersonsData>('persons:data', {
  defaultValue: {
    person1: 'Person 1',
    person1desc: 'Person 1 Description',
    person2: 'Person 2',
    person2desc: 'Person 2 Description',
    person3: 'Person 3',
    person3desc: 'Person 3 Description',
  },
  persistent: true,
});
export const repPersonsActive = nodecg().Replicant<PersonsActive>(
  'persons:active',
  {
    defaultValue: false,
    persistent: true,
  },
);
