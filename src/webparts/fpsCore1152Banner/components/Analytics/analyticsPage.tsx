import * as React from 'react';
import { useState, useEffect } from 'react';

require('@mikezimm/fps-styles/dist/easypages.css');

import { ILoadPerformance, IPerformanceOp, } from '@mikezimm/fps-library-v2/lib/components/molecules/Performance/IPerformance';
import { createPerformanceRows, } from '@mikezimm/fps-library-v2/lib/components/molecules/Performance/tables';

import { IStateSourceA, } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/interfaces/IStateSourceA";
import { getAnalyticsSummary } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/functions/fetchAnalytics";
import { createAnalyticsSourceProps } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/interfaces/createAnalyticsSourceProps";

import { EasyPagesAnalTab,  } from '@mikezimm/fps-library-v2/lib/banner/components/EasyPages/interfaces/epTypes';

import { ISourceProps } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/Interface';
import { IEasyPagesSourceProps } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/interfaces/IEasyPagesPageProps";
import { ISourceButtonRowProps, sourceButtonRow } from '../Pages/SourcePages/sourceButtonRow';
import Accordion from '@mikezimm/fps-library-v2/lib/components/molecules/Accordion/Accordion';
import SourcePages from '../Pages/SourcePages/SourcePages';
import { ezAnalyticsItemHeaders, createItemsRow } from './Row';
import { IAnalyticsSummary, IOjbectKeySummaryItem, easyAnalyticsSummary, } from './summarizeArrayByKey';
import { createBarsRow, ezAnalyticsBarHeaders } from './RowBar';
import { makeid } from '../../fpsReferences';
import { check4This } from "@mikezimm/fps-pnp2/lib/services/sp/CheckSearch";

export type ISourceName =  typeof EasyPagesAnalTab ;

// This should come from src\pnpjs\Common\IStateSource.ts
export const EmptyStateSource: IStateSourceA = {
  items: [], 
  itemsA: [],
  itemsS: [],
  itemsO: [],
  itemsP: [],
  index: [], 
  loaded: false, 
  refreshId: makeid(5), 
  status: 'Unknown', 
  e: null, 
  misc1: [],
  meta1: [],
  meta2: [],
}

export interface IEasyAnalyticsProps {
  expandedState: boolean;  //Is this particular page expanded
  analyticsListX: string;
  class1: string;
  class2: string;
}

export interface IEasyAnalyticsHookProps {
  easyAnalyticsProps: IEasyAnalyticsProps;  // Props specific to this Source/Page component
  easyPagesSourceProps: IEasyPagesSourceProps;  // General props which apply to all Sources/Pages
  // fpsItemsReturn?: IFpsItemsReturn;
}

export type IAnalyticsTab = 'Items' | 'Offices' | 'Sites' | 'Languages' | 'Dates' | 'Users' | 'CodeVersion' ;
export const AnalyticsTabs: IAnalyticsTab[] = [ 'Items', 'Offices', 'Sites',  'Languages', 'Dates', 'Users', 'CodeVersion' ];

export type ITopButtons = 'Mine' | 'OtherPeeps' | 'ThisSite' | 'OtherSites';
export const TopButtons: ITopButtons[] = [ 'Mine', 'OtherPeeps', 'ThisSite', 'OtherSites' ];

/***
 *    .d8888. d888888b  .d8b.  d8888b. d888888b      db   db  .d88b.   .d88b.  db   dD 
 *    88'  YP `~~88~~' d8' `8b 88  `8D `~~88~~'      88   88 .8P  Y8. .8P  Y8. 88 ,8P' 
 *    `8bo.      88    88ooo88 88oobY'    88         88ooo88 88    88 88    88 88,8P   
 *      `Y8b.    88    88~~~88 88`8b      88         88~~~88 88    88 88    88 88`8b   
 *    db   8D    88    88   88 88 `88.    88         88   88 `8b  d8' `8b  d8' 88 `88. 
 *    `8888Y'    YP    YP   YP 88   YD    YP         YP   YP  `Y88P'   `Y88P'  YP   YD 
 *                                                                                     
 *                                                                                     
 */

const EasyAnalyticsHook: React.FC<IEasyAnalyticsHookProps> = ( props ) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { context, styles, containerStyles, repo } = props.easyPagesSourceProps;
  const { expandedState, analyticsListX } = props.easyAnalyticsProps;

  /**
   * State related to tabs visible items
   */

  // const [ FPSUser, setFPSUser ] = useState<IFPSUser>( retrieveFPSUser() );
  const [ tab, setTab ] = useState<number>( 0 );
  const [ button1, setButton1 ] = useState<string>( '' ); // SourcePages first filter button
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ sourceProps, setSourceProps ] = useState<ISourceProps>( createAnalyticsSourceProps( analyticsListX ) );
  const [ stateSource, setStateSource ] = useState<IStateSourceA>( EmptyStateSource );

  const [ fetchPerformance, setFetchPerformance ] = useState<IPerformanceOp>( null );
  const [ procPerformance, setProcPerformance ] = useState<IAnalyticsSummary>( null );

  /**
   * State related to fetching the source props
   */
  const [ fetched, setFetched ] = useState<boolean>( false );

/***
 *     .o88b. db    db d8888b. d8888b. d88888b d8b   db d888888b      .d8888. d888888b d888888b d88888b 
 *    d8P  Y8 88    88 88  `8D 88  `8D 88'     888o  88 `~~88~~'      88'  YP   `88'   `~~88~~' 88'     
 *    8P      88    88 88oobY' 88oobY' 88ooooo 88V8o 88    88         `8bo.      88       88    88ooooo 
 *    8b      88    88 88`8b   88`8b   88~~~~~ 88 V8o88    88           `Y8b.    88       88    88~~~~~ 
 *    Y8b  d8 88b  d88 88 `88. 88 `88. 88.     88  V888    88         db   8D   .88.      88    88.     
 *     `Y88P' ~Y8888P' 88   YD 88   YD Y88888P VP   V8P    YP         `8888Y' Y888888P    YP    Y88888P 
 *                                                                                                      
 *                                                                                                      
 */

  useEffect(() => {
    //  https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook

    if ( expandedState === true && fetched === false ) {
      const getItems = async (): Promise<void> => {
        const itemsResults: IStateSourceA = await getAnalyticsSummary( sourceProps );

        const EzSummary: IAnalyticsSummary = easyAnalyticsSummary( itemsResults.items, );

        setFetched( itemsResults.loaded );
        setStateSource( itemsResults );
        setFetchPerformance( itemsResults.performanceOp );
        setProcPerformance( EzSummary );
      };

      // eslint-disable-next-line no-void
      void getItems(); // run it, run it

      return () => {
        // this now gets called when the component unmounts
      };
    }

  }, [ expandedState ] );

  
  const onParentCall = (command: 'GoToItems', Id: number, type: string, item: IOjbectKeySummaryItem ) : void => { // onParentCall( 'GoToItems', -1, '', item )

    if ( item.keyZ === 'createdAge' || ( item.primaryKey && item.primaryKey.indexOf('<< EMPTY') === 0 ) ||  command !== 'GoToItems' ) {
      console.log( 'Invalid onParentCall' );
      return
    }
    console.log( 'Prefiltering items: onParentCall', item );
    setButton1( item.primaryKey );
    setTab( 0 );
  }

  const setTabClick = ( Id: number ) : void => { // onParentCall( 'GoToItems', -1, '', item )
    setButton1( '' );
    setTab( Id );
  }

  /***
 *     .d88b.  d8b   db       .o88b. db      d888888b  .o88b. db   dD .d8888. 
 *    .8P  Y8. 888o  88      d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 88'  YP 
 *    88    88 88V8o 88      8P      88         88    8P      88,8P   `8bo.   
 *    88    88 88 V8o88      8b      88         88    8b      88`8b     `Y8b. 
 *    `8b  d8' 88  V888      Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. db   8D 
 *     `Y88P'  VP   V8P       `Y88P' Y88888P Y888888P  `Y88P' YP   YD `8888Y' 
 *                                                                            
 *                                                                            
 */


  /***
 *    d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b 
 *    88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~' 
 *    88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88    
 *    88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88    
 *    88.     88booo. 88.     88  88  88 88.     88  V888    88    
 *    Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP    
 *                                                                 
 *                                                                 
 */

  //https://github.com/mikezimm/Pnpjs-v2-Upgrade-sample/issues/56
  const classNames: string[] = [ 'source-page', 'ezAnalyticsSourcePage', 'bannerPillShapeSideMargin' ];
  if ( expandedState !== true ) classNames.push ( 'hide-source-page' );

  const ButtonRowProps: ISourceButtonRowProps = {
    title: '',
    Labels: AnalyticsTabs,
    onClick: stateSource.loaded !== true ? undefined : setTabClick.bind( this ),
    selected: tab,
    infoEle: ``,
    selectedClass: props.easyAnalyticsProps.class1,
  }

  const MainContent: JSX.Element = <div className={ 'eZAnalyticsInfo' }style={{ cursor: 'default', padding: '5px 0px 5px 0px' }}>
    { sourceButtonRow( ButtonRowProps ) }
    { !fetchPerformance ? undefined : <div>{ createPerformanceRows( { ops: { fetch: fetchPerformance } } as ILoadPerformance, [ 'fetch' ] ) }</div> }
    { !procPerformance  ? undefined : <div>{ createPerformanceRows( { ops: { process0: procPerformance.performanceOp } } as ILoadPerformance, [ 'process0' ] ) }</div> }
  </div>;

  const accordionHeight: number = 100;
  const InfoElement: JSX.Element = <Accordion 
    title = { `More information about this tab`}
    defaultIcon = 'Help'
    showAccordion = { true }
    content = { MainContent }
    contentStyles = { { height: `${accordionHeight}px` } }
  />;


  const useTopButtons: string[] = tab === 0 ? [ button1, ...TopButtons.filter((str) => str !== button1 ), ...stateSource.meta2.filter((str) => str !== button1 ) ] : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useThisState: IStateSourceA = tab === 0 ? stateSource : { ...stateSource, ...{ items: procPerformance[ AnalyticsTabs[ tab ] as 'Sites' ].summaries } , refreshId: makeid( 5 ) } as any;
  const useHeaders: string[] = tab === 0 ? ezAnalyticsItemHeaders : ezAnalyticsBarHeaders;
  const useSgeSlider: boolean = tab === 0 ? true : false;
  const renderRowsAsThese = tab === 0 ? createItemsRow : createBarsRow;

  if ( check4This(`sourceResults=true`) === true ) console.log('sourceResults analyticsHookState:', AnalyticsTabs[ tab ], tab, useThisState );

  const itemsElement = <SourcePages
    // source={ SourceInfo }
    primarySource={ sourceProps }
    itemsPerPage={ 20 }
    pageWidth={ 1000 }
    topButtons={ useTopButtons }
    stateSource={ useThisState }
    startQty={ 20 }
    showItemType={ false }
    debugMode={ null }

    tableHeaderElements={ useHeaders }
    tableClassName= { 'ezAnalyticsTable' } // styles.itemTable
    tableHeaderClassName= { [  ].join( ' ' )  } // stylesRow.genericItem
    selectedClass={ props.easyAnalyticsProps.class1 }

    renderRow={ renderRowsAsThese }
    deepProps={ null } //this.state.deepProps

    onParentCall={ onParentCall.bind(this) }
    headingElement={ InfoElement }
    ageSlider={ useSgeSlider }
    searchAgeOp={ 'show >' }
    searchAgeProp={ 'createdAge' }
  />;

  const EasyAnalyticsElement: JSX.Element = <div className = { classNames.join( ' ' ) } style={ styles }>
    { itemsElement }
  </div>;

  return ( EasyAnalyticsElement );

}

export default EasyAnalyticsHook;