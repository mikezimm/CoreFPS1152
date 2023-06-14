import { IFPSCoreReactComponentProps } from '@mikezimm/fps-library-v2/lib/banner/mainReact/ReactComponentProps';
import { IFPSCorePinMeReactComponentState } from '@mikezimm/fps-library-v2/lib/banner/mainReact/ReactComponentState';

import { ILoadPerformance } from '../fpsReferences';

export interface IFpsCore1152BannerProps  extends IFPSCoreReactComponentProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  performance: ILoadPerformance;
  
}

export type IDefSourceType = 'lists...' | '' | '' | '' | '' | '*';

/**
 * Extends IFPSCorePinMeReactComponentState with all basics required for FPS Banner
 */
 export interface IFpsCore1152BannerState extends IFPSCorePinMeReactComponentState {


}