import * as React from 'react';
import { useState, useEffect } from 'react';

// import { getExpandColumns, getSelectColumns } from '../../fpsReferences';

require('@mikezimm/fps-styles/dist/easypages.css');

// import styles from '../PropPaneCols.module.scss';
import { WebPartContextCopy_15_2 } from '@mikezimm/fps-library-v2/lib/common/interfaces/@msft/1.15.2/WebPartContext'; // Used in:  IEasyPagesSourceProps

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { sortObjectArrayByStringKeyCollator } from '@mikezimm/fps-library-v2/lib/logic/Arrays/sorting/objects';

// import { ISupportedHost } from '@mikezimm/fps-library-v2/lib/common/interfaces/@msft/1.15.2/layout';
// import { IPinMeState } from "../../features/PinMe/Interfaces";

import { ILoadPerformance, IPerformanceOp, } from '@mikezimm/fps-library-v2/lib/components/molecules/Performance/IPerformance';
import { createBasePerformanceInit, } from '@mikezimm/fps-library-v2/lib/components/molecules/Performance/functions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createPerformanceTableVisitor, } from '@mikezimm/fps-library-v2/lib/components/molecules/Performance/tables';

// import { getItemsContent, getUsedTabs } from './functions';
import { IStateSourceA, IZFetchedAnalytics, } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/IStateSourceA";
import { getAnalyticsSummary } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/fetchAnalytics";
import { createAnalyticsSourceProps } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/createAnalyticsSourceProps";
import { compoundArrayFilter } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/functions/compoundArrayFilter";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EasyPagesAnalTab,  } from '@mikezimm/fps-library-v2/lib/banner/components/EasyPages/interfaces/epTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { prepSourceColumns } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/index';
import { prepSourceColumns } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/prepSourceColumns';
import { ISourceProps } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/Interface';
import { IEasyPagesSourceProps } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/interfaces/IEasyPagesPageProps";
import { IAnySourceItem } from '@mikezimm/fps-library-v2/lib/components/molecules/SourceList/IAnyContent';
import { IStateSource } from '@mikezimm/fps-library-v2/lib/pnpjs/Common/IStateSource';
import { ISourceButtonRowProps, sourceButtonRow } from '../Pages/SourcePages/sourceButtonRow';
import Accordion from '@mikezimm/fps-library-v2/lib/components/molecules/Accordion/Accordion';
import SourcePages from '../Pages/SourcePages/SourcePages';
import { ezAnalyticsItemHeaders, createItemsRow } from './Row';
import { check4Gulp, makeid } from '../../fpsReferences';
import { addSearchMeta1 } from '@mikezimm/fps-library-v2/lib/components/molecules/SearchPage/functions/addSearchMeta1';
import { addSearchMeta2 } from '@mikezimm/fps-library-v2/lib/components/molecules/SearchPage/functions/addSearchMeta2';
import { IFPSUser } from '@mikezimm/fps-library-v2/lib/logic/Users/IUserInterfaces';
import { retrieveFPSUser } from "@mikezimm/fps-library-v2/lib/banner/FPSWebPartClass/functions/showTricks";
import { IAnalyticsSummary, easyAnalyticsSummary, summarizeArrayByKey } from './summarizeArrayByKey';
import { createBarsRow, ezAnalyticsBarHeaders } from './RowBar';
import { ISourceRowRender } from '../Pages/SourcePages/ISourceRowRender';

export type ISourceName =  typeof EasyPagesAnalTab ;

// This should come from src\pnpjs\Common\IStateSource.ts
export const EmptyStateSource: IStateSourceA = {
  items: [], 
  itemsA: [], 
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

export type IAnalyticsTab = 'Items' | 'Offices' | 'Sites' | 'Languages' | 'Dates' | 'Users' ;
export const AnalyticsTabs: IAnalyticsTab[] = [ 'Items', 'Offices', 'Sites',  'Languages', 'Dates', 'Users', ];

export type ITopButtons = 'All' | 'Mine' | 'OtherPeeps' | 'ThisSite' | 'OtherSites';
export const TopButtons: ITopButtons[] = [ 'All', 'Mine', 'OtherPeeps', 'ThisSite', 'OtherSites' ];

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

  const [ FPSUser, setFPSUser ] = useState<IFPSUser>( retrieveFPSUser() );
  const [ tab, setTab ] = useState<number>( 0 );
  const [ sourceProps, setSourceProps ] = useState<ISourceProps>( createAnalyticsSourceProps( analyticsListX ) );
  const [ stateSource, setStateSource ] = useState<IStateSourceA>( EmptyStateSource );
  const [ refreshId, setRefreshId ] = useState<string>( makeid( 5 ) );
  const [ preFilteredItems, setPreFilteredItems ] = useState<IAnySourceItem[]>( [] );
  const [ fetchPerformance, setFetchPerformance ] = useState<IPerformanceOp>( null );
  const [ procPerformance, setProcPerformance ] = useState<IAnalyticsSummary>( null );
  // const [ activeTabs, setActiveTabs ] = useState<string[]>( tabs.length > 0 ? [ ...tabs, ...[ InfoTab ] ]: ['Pages'] );

  /**
   * State related to fetching the source props
   */
  const [ fetched, setFetched ] = useState<boolean>( false );
  // const [ performance, setPerformance ] = useState<ILoadPerformance>( () => createBasePerformanceInit( 1, false ) ); //() => createBasePerformanceInit( 1, false )
  const [ performance, setPerformance ] = useState<IPerformanceOp>( null ); //() => createBasePerformanceInit( 1, false )
  const [ items, setItems ] = useState<any[]>( [] );
  const [ summary, setSummary ] = useState<any[]>( [] );

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

        console.log('summaries:', EzSummary );

        // itemsResults.items = addSearchMeta1( itemsResults.items, sourceProps, null ) as IZFetchedAnalytics[];
        // itemsResults.items.map( ( item ) => {
        //   if ( item['Author/Title'] === FPSUser.Title ) 
        //     { item.searchTextLC += ` || Mine` }
        //   else { item.searchTextLC += ` || Others` }
      
        //   // if ( item['Author/Title'] === FPSUser.Title ) { item.searchTextLC += ` || Mine` }
        //   //   else { item.searchTextLC += ` || Others` }
      
        //   if ( item.siteServerRelativeUrl && window.location.pathname.toLowerCase().indexOf( item.siteServerRelativeUrl.toLowerCase() ) > -1 ) 
        //     { item.searchTextLC += ` || ThisSite` }
        //   else { item.searchTextLC += ` || OtherSites` }
      
        //   // if ( item['Author/Title'] === FPSEnviro.siteUrl ) { item.searchTextLC += ` || Mine` }
        //   //   else { item.searchTextLC += ` || Others` }
        // });
        console.log( 'EasyAnalyticsResults:', itemsResults );
        // const actualTabs = getUsedTabs( source, itemsResults.items );
        // actualTabs.push( InfoTab );
        // const links: IEasyLink[] = compoundArrayFilter( itemsResults.items, actualTabs[0], '' );
        // setTab( actualTabs[0] );

        setFetched( itemsResults.loaded );
        // setFiltered( links );
        setStateSource( itemsResults );
        // setActiveTabs( actualTabs );
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
  const classNames: string[] = [ 'source-page' ];
  // const classNames: string[] = [ 'easy-items' ];
  if ( expandedState !== true ) classNames.push ( 'hide-source-page' );
  // if ( props.easyPagesSourceProps.pageLayout === 'SharePointFullPage' || props.easyPagesSourceProps.pageLayout === 'SingleWebPartAppPageLayout' ) classNames.push ( 'easy-items-spa' );
  // if ( ( props.easyPagesSourceProps.pinState === 'pinFull' || props.easyPagesSourceProps.pinState === 'pinMini' ) && classNames.indexOf('easy-items-spa') < 0 ) classNames.push ( 'easy-items-spa' );

  const ButtonRowProps: ISourceButtonRowProps = {
    title: '',
    Labels: AnalyticsTabs,
    onClick: stateSource.loaded !== true ? undefined : setTab.bind( this ),
    selected: tab,
    infoEle: ``,
    selectedClass: props.easyAnalyticsProps.class1,
  }

  const MainContent: JSX.Element = <div className={ 'eZAnalyticsInfo' }style={{ cursor: 'default', padding: '5px 20px 5px 20px' }}>
    { sourceButtonRow( ButtonRowProps ) }
  </div>;

  const accordionHeight: number = 100;
  const InfoElement: JSX.Element = <Accordion 
    title = { `More information about this tab`}
    defaultIcon = 'Help'
    showAccordion = { true }
    content = { MainContent }
    contentStyles = { { height: `${accordionHeight}px` } }
  />;


  const useTopButtons: string[] = tab === 0 ? [ ...TopButtons, ...stateSource.meta2 ] : [];
  const useThisState: IStateSourceA = tab === 0 ? stateSource : { ...stateSource, ...{ items: procPerformance[ AnalyticsTabs[ tab ] as 'Sites' ].summaries } , refreshId: makeid( 5 ) } as any;
  const useHeaders: string[] = tab === 0 ? ezAnalyticsItemHeaders : ezAnalyticsBarHeaders;
  const renderRowsAsThese = tab === 0 ? createItemsRow : createBarsRow;

  console.log('analyticsHookState:', AnalyticsTabs[ tab ], tab, useThisState );

  const itemsElement = <SourcePages
    // source={ SourceInfo }
    primarySource={ sourceProps }
    itemsPerPage={ 20 }
    pageWidth={ 1000 }
    topButtons={ useTopButtons }
    // stateSource={ { ...stateSource, ...{ refreshId: refreshId } } }
    stateSource={ useThisState }
    startQty={ 20 }
    showItemType={ false }
    debugMode={ null }

    tableHeaderElements={ useHeaders }
    tableClassName= { 'ezAnalyticsTable' } // styles.itemTable
    tableHeaderClassName= { [  ].join( ' ' )  } // stylesRow.genericItem
    selectedClass={ props.easyAnalyticsProps.class1 }

    renderRow={ renderRowsAsThese }
    // bumpDeepLinks= { this.bumpDeepStateFromComponent.bind(this) }
    deepProps={ null } //this.state.deepProps
    // canvasOptions={ this.props.canvasOptions }

    onParentCall={ () => { alert('Hey, parent was called!') } }
    headingElement={ InfoElement }
    ageSlider={ true }
    searchAgeOp={ 'show >' }
    searchAgeProp={ 'createdAge' }
    // footerElement={ <div style={{color: 'red', fontWeight: 600 }}>THIS IS the FOOTER ELEMENT</div> }
  />;


  const EasyAnalyticsElement: JSX.Element = <div className = { classNames.join( '' ) } style={ styles }>
    { itemsElement }
    {/* { tab === InfoTab ? createPerformanceTableVisitor( performance, ['fetch1', 'analyze1' ] ) : 
      <div className = { [ 'easy-container', EasyPageNoFetchTabs.indexOf( sourceName ) > -1 ? 'easy-container-2col' : null ].join( ' ' ) } style={ containerStyles }>
        { filtered.map( link => { return easyLinkElement( link, '_blank'  ) } ) }
      </div>
    } */}
  </div>;

  return ( EasyAnalyticsElement );

}

export default EasyAnalyticsHook;