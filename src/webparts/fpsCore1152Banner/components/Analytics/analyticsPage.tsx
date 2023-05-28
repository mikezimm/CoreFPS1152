import * as React from 'react';
import { useState, useEffect } from 'react';
import { Pivot, PivotItem, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';

// import { getExpandColumns, getSelectColumns } from '../../fpsReferences';

require('@mikezimm/fps-styles/dist/easypages.css');

// import styles from '../PropPaneCols.module.scss';
import { WebPartContextCopy_15_2 } from '@mikezimm/fps-library-v2/lib/common/interfaces/@msft/1.15.2/WebPartContext'; // Used in:  IEasyPagesSourceProps

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { sortObjectArrayByStringKeyCollator } from '@mikezimm/fps-library-v2/lib/logic/Arrays/sorting/objects';

// import { ISupportedHost } from '@mikezimm/fps-library-v2/lib/common/interfaces/@msft/1.15.2/layout';
// import { IPinMeState } from "../../features/PinMe/Interfaces";

import { ILoadPerformance, } from '@mikezimm/fps-library-v2/lib/components/molecules/Performance/IPerformance';
import { createBasePerformanceInit, } from '@mikezimm/fps-library-v2/lib/components/molecules/Performance/functions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createPerformanceTableVisitor, } from '@mikezimm/fps-library-v2/lib/components/molecules/Performance/tables';

// import { getItemsContent, getUsedTabs } from './functions';
import { IFpsAnalyticsReturn, fetchAnalytics } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/fetchAnalytics";
import { compoundArrayFilter } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/functions/compoundArrayFilter";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EasyPagesAnalTab, EasyPagesDevTab, EasyPagesRepoTab, ISourcePropsEP } from '@mikezimm/fps-library-v2/lib/banner/components/EasyPages/interfaces/epTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IEasyIcons } from '@mikezimm/fps-library-v2/lib/components/atoms/EasyIcons/interfaces/eiTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EasyDevPages, getZGitLinks } from '@mikezimm/fps-library-v2/lib/banner/components/EasyPages/functions/devLinks';
import { IRepoLinks } from '@mikezimm/fps-library-v2/lib/components/atoms/Links/CreateLinks';
// import { prepSourceColumns } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/index';
import { IFpsItemsReturn } from '@mikezimm/fps-library-v2/lib/pnpjs/Common/CheckItemsResults';
import { prepSourceColumns } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/prepSourceColumns';
import { ISourceProps } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/Interface';
import { IEasyPagesSourceProps } from "@mikezimm/fps-library-v2/lib/components/atoms/EasyIcons/interfaces/IEasyPagesPageProps";

export type ISourceName = 'Current' | 'Parent' | 'Alternate' | typeof EasyPagesDevTab | typeof EasyPagesRepoTab | typeof EasyPagesAnalTab ;

export const EasyPageNoFetchTabs: ISourceName[] = [ EasyPagesDevTab, EasyPagesRepoTab ] ;

export interface IEasyAnalyticsProps {
  expandedState: boolean;  //Is this particular page expanded
  analyticsListX: string;
}

export interface IEasyPagesPageHookProps {
  easyAnalyticsProps: IEasyAnalyticsProps;  // Props specific to this Source/Page component
  easyPagesSourceProps: IEasyPagesSourceProps;  // General props which apply to all Sources/Pages
  fpsItemsReturn?: IFpsItemsReturn;
}

export interface IEasyLink extends Partial<any> {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  imageDesc: string;
  searchTextLC: string;
  type: 'current' | 'parent' | 'other' | 'nav';
  tabs: string[];
}

export const InfoTab = 'FetchInfoZz79';
export const InfoIcon = 'History';


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

const EasyPagesPageHook: React.FC<IEasyPagesPageHookProps> = ( props ) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { context, styles, containerStyles, repo } = props.easyPagesSourceProps;
  const { expandedState, analyticsListX } = props.easyAnalyticsProps;

  /**
   * State related to tabs visible items
   */
  // const [ tab, setTab ] = useState<string>( tabs.length > 0 ? tabs[0] : 'Pages' );
  const [ filtered, setFiltered ] = useState<IEasyLink[]>( sourceName === EasyPagesDevTab ? EasyDevPages : sourceName === EasyPagesRepoTab ? () => getZGitLinks( repo ) : [] );
  // const [ activeTabs, setActiveTabs ] = useState<string[]>( tabs.length > 0 ? [ ...tabs, ...[ InfoTab ] ]: ['Pages'] );

  /**
   * State related to fetching the source props
   */
  const [ fetched, setFetched ] = useState<boolean>( false );
  const [ performance, setPerformance ] = useState<ILoadPerformance>( () => createBasePerformanceInit( 1, false ));
  const [ items, setItems ] = useState<IEasyLink[]>( EasyPageNoFetchTabs.indexOf( sourceName ) > -1 ? EasyDevPages : [] );

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
        const itemsResults: IFpsAnalyticsReturn = await fetchAnalytics( analyticsListX );
        // const actualTabs = getUsedTabs( source, itemsResults.items );
        // actualTabs.push( InfoTab );
        const links: IEasyLink[] = compoundArrayFilter( itemsResults.items, actualTabs[0], '' );
        // setTab( actualTabs[0] );
        setFetched( true );
        setFiltered( links );
        setItems( itemsResults.items );
        // setActiveTabs( actualTabs );
        setPerformance( itemsResults.performanceOp );
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

  const onTextSearch = ( item: any, text: string = '' ): void => {
    const SearchValue : string = typeof item === 'string' ? item : item && item.target && item.target.value ? item.target.value : '';
    const links: IEasyLink[] = compoundArrayFilter( items, SearchValue, text );
    setFiltered( links );
    setTab( SearchValue );

  }

  // item SHOULD BE IPivotItemProps but have to cast as any in order to get itemKey and headerText
  const pivotClick = ( item: PivotItem, ev?: React.MouseEvent<HTMLElement> ): void => {
    //Because of Performance Tab, need to adjust what is returned.   have to use .indexOf because itemKey value is .$FetchInfo
    const itemKey = !item.props.headerText ? InfoTab : item.props.headerText ;
    onTextSearch( itemKey );

  }

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

  const EasyPagesPageElement: JSX.Element = <div className = { classNames.join( ' ' ) } style={ styles }>

    { EasyPageNoFetchTabs.indexOf( sourceName ) > -1 ? null : <Pivot 
        linkFormat={ props.linkFormat ? props.linkFormat : PivotLinkFormat.links }
        linkSize={ props.linkSize ? props.linkSize : PivotLinkSize.normal}
      //   style={{ flexGrow: 1, paddingLeft: '10px' }}
        onLinkClick= { pivotClick.bind(this) }
        selectedKey={ tab }
      >
      { activeTabs.map( ( tab: string ) => {
        return <PivotItem key={ tab } itemKey={ tab } headerText={ tab !== InfoTab ? tab : '' } itemIcon={ tab === InfoTab ? InfoIcon : undefined } />
      })}

    </Pivot>}

    { tab === InfoTab ? createPerformanceTableVisitor( performance, ['fetch1', 'analyze1' ] ) : 
      <div className = { [ 'easy-container', EasyPageNoFetchTabs.indexOf( sourceName ) > -1 ? 'easy-container-2col' : null ].join( ' ' ) } style={ containerStyles }>
        { filtered.map( link => { return easyLinkElement( link, '_blank'  ) } ) }
      </div>
    }
  </div>;

  return ( EasyPagesPageElement );

}

export default EasyPagesPageHook;