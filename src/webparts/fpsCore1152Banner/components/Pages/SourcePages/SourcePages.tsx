import * as React from 'react';

import { ISourcePagesProps, ISourcePagesState, } from './ISourcePagesProps';

import FPSAgeSliderHook from '@mikezimm/fps-library-v2/lib/components/atoms/FPSAgeSlider/FPSAgeHook';

import { check4This } from "@mikezimm/fps-pnp2/lib/services/sp/CheckSearch";

import { IAnySourceItem } from '@mikezimm/fps-library-v2/lib/components/molecules/SourceList/IAnyContent';
import { makeid } from '@mikezimm/fps-library-v2/lib/logic/Strings/guids';

import { getFilteredItems } from '@mikezimm/fps-library-v2/lib/components/molecules/SearchPage/functions/getFilteredV1';
import SourceSearchAgeHook from '@mikezimm/fps-library-v2/lib/components/molecules/SearchPage/component/SearchBoxRowAge';
import { IFPSAgeSliderProps } from '@mikezimm/fps-library-v2/lib/components/atoms/FPSAgeSlider/FPSAgeTypes';
import { FPSAgeSliderOptions7Years } from '@mikezimm/fps-library-v2/lib/components/atoms/FPSAgeSlider/FPSAgeSliderOptions7YearPart';
import { GetGoToListLink, } from '@mikezimm/fps-library-v2/lib/components/atoms/Links/GoToLinks';

import { FPSFetchStatus } from './FPSFetchStatus';

const AgeSliderOptions = [ { key: -1, maxAge: 0, text: 'all dates', }, ...FPSAgeSliderOptions7Years.map( item => { 
  item.text = `${item.text.replace( 'The past ', 'older than ')} ago`;
  return item }) ];

const defaultMaxVisible: number = 20;

require('./sourcePages.css');

export default class SourcePages extends React.Component<ISourcePagesProps, ISourcePagesState> {

  private _itemsPerPage = defaultMaxVisible;


/***
 *          .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
 *         d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
 *         8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
 *         8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
 *         Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
 *          `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
 *                                                                                                       
 *                                                                                                       
 */


 //Standards are really site pages, supporting docs are files


public constructor(props:ISourcePagesProps){
  super(props);

  const { stateSource, } = this.props; 
  const refreshId = stateSource ? stateSource.refreshId : 'mzWasHere'; 

  const searchText = this.props.deepProps && this.props.deepProps.length >=1 && this.props.deepProps[0] ? decodeURIComponent( this.props.deepProps[0] ) : '';
  const topSearchStr = this.props.deepProps && this.props.deepProps.length >=2 && this.props.deepProps[1] ? decodeURIComponent( this.props.deepProps[1] ) : '[]';
  const topSearch = !topSearchStr ? [] : JSON.parse( topSearchStr );

  const filtered: IAnySourceItem[] = stateSource ? getFilteredItems( stateSource.items , searchText, [], [], [], topSearch  ) : [];
  this._itemsPerPage = this.props.itemsPerPage ? this.props.itemsPerPage : this._itemsPerPage ;

  const enableAge = this.props.ageSlider === true && this.props.searchAgeProp && this.props.searchAgeOp ? true : false;

  const ageIndex = this.props.ageIndexDefault ? this.props.ageIndexDefault : 0;
  const searchAge = AgeSliderOptions[ Math.abs( ageIndex ) ].maxAge;  //ageIndex is negative... needs inverse to get array element

  this.state = {
    refreshId: refreshId ? refreshId : 'mzWasHere',
    filtered: filtered,
    topSearch: topSearch,
    sortNum: 'asc',
    sortName: '-',
    sortGroup: '-',
    searchTime: null,
    searchText: searchText,

    showItemPanel: false,
    showCanvasContent1: false, // this.props.canvasOptions.pagePreference === 'canvasContent1' ? true : false,
    showPanelJSON: false,
    showThisItem: filtered.length > 0 ? filtered[ 0 ] : null,

    firstVisible: 0,
    lastVisible: this._itemsPerPage - 1,
    resetArrows: refreshId ? refreshId : 'mzWasHere',

    detailToggle: false, // this.props.search.showDetails,

    searchAge: searchAge,
    enableAge: enableAge,

  };
}

public async componentDidMount(): Promise<void> {
  await this.updateWebInfo(  );
}


public componentDidUpdate(prevProps: ISourcePagesProps): void {
    //Just rebuild the component
    const { stateSource, topButtons, ageSlider, searchAgeProp, searchAgeOp } = this.props; 

    const enableAge = ageSlider === true && searchAgeProp && searchAgeOp ? true : false;

    const itemsLength = stateSource ? stateSource.items.length : 0;
    let resetArrows = false;
    if ( prevProps.resetArrows !== this.props.resetArrows ||  prevProps.ageSlider !== this.props.ageSlider  
      ||  prevProps.searchAgeProp !== this.props.searchAgeProp   ||  prevProps.searchAgeOp !== this.props.searchAgeOp  ) {
      resetArrows = true;

    }

    let lastVisible = this._itemsPerPage;

    if ( check4This( 'filtered=true' ) === true )  console.log( 'filtered SourePage', lastVisible, stateSource.items, );

    if ( itemsLength < lastVisible ) lastVisible = itemsLength;

    if ( !stateSource || topButtons.join('-') !== prevProps.topButtons.join('-')) {
      this.setState({ 
        filtered: stateSource ? stateSource.items : [],
        topSearch: [],
        searchText: '',
        firstVisible: 0,
        lastVisible: lastVisible - 1,
        refreshId: makeid(4),
        resetArrows: makeid(4),
        enableAge: enableAge,
      });

    } else if ( this.props.primarySource !== prevProps.primarySource ) {
      this.setState({ 
        filtered: stateSource ? stateSource.items : [],
        topSearch: [],
        searchText: '',
        firstVisible: 0,
        lastVisible: lastVisible - 1,
        refreshId: makeid(4),
        resetArrows: makeid(4),
        enableAge: enableAge,
      });

    } else if ( this.props.stateSource.items.length !== prevProps.stateSource.items.length ) {
      this.setState({ 
        filtered: stateSource.items,
        // added searchText reset for https://github.com/mikezimm/Compliance/issues/126
        searchText: '',  
        firstVisible: 0, 
        lastVisible: lastVisible - 1,
        refreshId: makeid(4),
        resetArrows: makeid(4),
        enableAge: enableAge,
      });

    } else if ( this.props.stateSource.refreshId !== prevProps.stateSource.refreshId || this.props.pageWidth !== prevProps.pageWidth || this.props.topButtons.length !== prevProps.topButtons.length ) {
      this.setState({ 
        filtered: this.props.stateSource.items,
        firstVisible: 0,
        lastVisible: lastVisible - 1,
        refreshId: this.props.stateSource.refreshId,
        resetArrows: makeid(4),
        enableAge: enableAge,


      });

    } else if ( resetArrows === true ) {
      this.setState({
        firstVisible: 0,
        lastVisible: lastVisible - 1,
        resetArrows: makeid(4),
        enableAge: enableAge,
      });
    }
}


public async updateWebInfo (   ): Promise<void> {  // eslint-disable-line  @typescript-eslint/no-empty-function

}

//        
  /***
 *         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
 *         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
 *         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
 *         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
 *         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
 *         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
 *                                                                                         
 *                                                                                         
 */

  public render(): React.ReactElement<ISourcePagesProps> {

    const { primarySource , topButtons, showItemType, stateSource, sourcePageClassName, disableSpinner } = this.props; // canvasOptions
    const { debugMode, selectedClass, tableHeaderElements, tableHeaderClassName, tableClassName } = this.props; // canvasOptions
    const { headingElement, footerElement } = this.props; // canvasOptions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { showThisItem , showItemPanel, searchText } = this.state;

    const topSearch: JSX.Element[] = [];  //All major future to be grid components

    topButtons.map( searchObjectFull => {
      // Added this if then so only buttons with valid value will create button... empty, undefined and null will not create button
      if ( searchObjectFull ) {
        const searchObjectArray = searchObjectFull.split('==');
        const searchObject = searchObjectArray[0];
        const classNames = [ 'button' ];
        if ( this.state.topSearch.indexOf( searchObjectFull ) > -1 ) { 
          classNames.push( 'isSelected' ) ;
          classNames.push( selectedClass ) ;
        }
        /**
         * This topSearch using arrow function did not work
         */
        topSearch.push( <div className={ classNames.join(' ') } style={ null }  
          onClick={ this._clickTop.bind( this, searchObjectFull )} 
          title={ searchObjectArray.length > 0 ? searchObjectFull : '' }>{ searchObject }</div> ); //Only show Title prop if the button has special search 
      }

    });

    const topSearchContent = <div className={ 'topSearch' } style={ { background : debugMode === true ? 'pink' : null }} >{ topSearch }</div>;

    const renderAsTable = tableHeaderElements && tableHeaderElements.length > 0 ? true : false;
    let tableElement = undefined;

    const filtered: JSX.Element[] = [];
    let tableHeaderRow: JSX.Element = undefined;
    if ( renderAsTable === true ) {
      tableHeaderRow = <tr className={ tableHeaderClassName }>{
        tableHeaderElements.map( ( item, index ) => { return <th key={ index }>{item}</th>} )
      }</tr>
    }

    if ( stateSource.loaded === true ) {
      this.state.filtered.map( ( item: IAnySourceItem, idx: number ) => {
        if ( idx >= this.state.firstVisible && idx <= this.state.lastVisible ) {
          filtered.push( this.props.renderRow({
            item : item,
            searchText: searchText,
            onClick:  this.clickListItem.bind( this ),
            onTextFilter:  this.clickTextFilter.bind( this ),
            onPropFilter:  this.clickPropFilter.bind( this ),
            details: this.state.detailToggle,
            showItemType: showItemType,
            onParentCall: this.props.onParentCall,
          }));
        }
      });
    } else { // push spinner element
      // if ( this.props.disableSpinner !== true ) filtered.push( FPSFetchSpinner( stateSource, primarySource ));
    }

    if ( !stateSource || stateSource.items.length === 0 ) {
      // This is duplicated in SearchPage.tsx and SourcePages.tsx as well
      // const FetchingSpinner = this.props.showSpinner === false ? null : <div style={{display: 'inline'}}><Spinner size={SpinnerSize.large} label={"Fetching more information ..."} style={{ padding: 30 }} /></div>;
      // const spinnerStyles : ISpinnerStyles = { label: {fontSize: '20px', fontWeight: '600',  }};
      // const FetchingSpinner =  this.props.showSpinner === false ? null : <div style={{display: 'inline', top: -10, position: 'relative'}}>
      //   <Spinner size={SpinnerSize.medium} label={"Fetching more information ..."} labelPosition= 'right' 
      //   style={{ paddingBottom: 10, backgroundColor: 'lightyellow' }} styles={ spinnerStyles }/></div>;

      filtered.push( undefined );

    } else if ( stateSource.items.length > 0 && filtered.length === 0 ) {
      filtered.push(    <div>
        <h2>Hmmm... I could not find any items with</h2>
        <h3>Search text: </h3>
        <div style={{ fontWeight: 'bold', color: 'darkred' }}>{ searchText ? searchText : 'Does not look like you typed anything in the search box...' }</div>

        <h3>With any of these words (top buttons)</h3>
        {this.state.topSearch.length === 0 ? 
          <div>
            No top buttons were selected.
          </div>
          :
          <div style={{ fontWeight: 'bold', color: 'blue' }}>{ this.state.topSearch.map( (str: string, idx: number ) => {
            return <li key={idx} >{ str }</li>
          })}</div>
        }
      </div>
      )
    }

    if ( renderAsTable === true ) {
      tableElement = <table className={ [ 'sourceTable', tableClassName ].join( ' ' ) }>
        { tableHeaderRow }
        { filtered }
      </table>
    }

    const AgeSliderWPProps: IFPSAgeSliderProps = this.props.ageSlider === false ? undefined : {
      FPSAgeIsVisible: true,
      FPSAgeColumnName: 'modifiedAge',
      FPSAgeColumnTitle: 'Modified',
      FPSAgeDefault: 0, //Should be index of AgeSliderOption
      onChange: (value: number, ) => this._onAgeChange( value ) ,  // value * - to make positive
      alternateOptions: AgeSliderOptions,
    };

    const AgeSlider = this.props.ageSlider === false ? undefined : <FPSAgeSliderHook 
      props = { AgeSliderWPProps } />

      // GetGoToListLink, GetGoToItemLink, GetGoToWebLink

    // const gotoListLink = !primarySource.webRelativeLink ? null : 
    //   <div className={ [ 'fps-gen-inBlockNoWrap ', 'searchSourceStatus', 'fps-gen-goToLink' ].join(' ')} 
    //     onClick={ () => { window.open( `${primarySource.webUrl}${primarySource.webRelativeLink}`,'_blank' ) ; } }>
    //     Go to full list <Icon iconName='OpenInNewTab'/>
    //   </div>;

    const gotoListLink = GetGoToListLink( { primarySource: primarySource, }); // GetGoToListLink, GetGoToItemLink, GetGoToWebLink

    const debugContent = debugMode !== true ? null : <div style={{ cursor: 'default', marginLeft: '20px' }}>
      App in debugMode - Change in Web Part Properties - Page Preferences.  <b><em>Currently in {primarySource.listTitle}</em></b>
    </div>;

    const searchSourceDesc = !primarySource.searchSourceDesc ? null : <div className={ 'searchSourceDesc' }>
      <div className={ 'sourceDesc' }>{ primarySource.searchSourceDesc }</div>
      { gotoListLink }
    </div>;

    const searchBox =  <SourceSearchAgeHook 
      _onSearchChange={ this._onSearchChange.bind( this ) }
      searchTime={ this.state.searchTime }
      searchText={ searchText }
      itemsPerPage={ this._itemsPerPage }
      itemCount={ this.state.filtered.length }
      _updateFirstLastVisible={ this._updateFirstLastVisible.bind(this) }
      debugMode={ debugMode }
      resetArrows={ this.state.resetArrows }
      layout={ 'grid' }
      ageElement={ AgeSlider }
    />;

    // const deepHistory = debugMode !== true ? null :  
    //   <ReactJson src={ this.state.filtered } name={ primarySource.listTitle } collapsed={ false } displayDataTypes={ false } displayObjectSize={ false } enableClipboard={ true } style={{ padding: '20px 0px' }} theme= { 'rjv-default' } indentWidth={ 2}/>;

    // // Moved entire panel to separate functional component so it can be reused from Search as well

    // const thePanel = showItemPanel !== true ? null : 
    //   ContentPanel( {
    //     showItemPanel: showItemPanel,
    //     showThisItem: showThisItem,
    //     primarySource: primarySource,
    //     onClosePanel: this._onClosePanel.bind(this),
    //     debugMode: debugMode,
    //     topButtons: topButtons,
    //     refreshId: refreshId,
    //     search: search,
    //     source: source,
    //     canvasOptions: canvasOptions,
    //   } );


    // const errorMessage = stateSource && stateSource.errorInfo && stateSource.errorInfo.returnMess ? true : false;
    // const theMessage = errorMessage === false ? '' : stateSource.errorInfo.returnMess.split('"value":"');
  
    // const webUrl = itemList[ preLoadIndex ].Subsite;
    // const listTitle = itemList[ preLoadIndex ].NoRecordsDeclared;
    // const webLinkElemennt2 = <div style={{ paddingLeft: '20px' }}className={ [ 'searchSourceStatus', 'fps-gen-goToLink' ].join(' ')} onClick={ () => { window.open( `${primarySource.webUrl}`,'_blank' ) ; } }>
    // Go to web <Icon iconName='OpenInNewTab'/></div>;

    // const webUrlLink = <span className={ 'errorLink' } onClick={ () => { window.open( primarySource.webUrl, '_blank')}}>{ primarySource.webUrl }</span>;
    // const webUrlLinkDiv = <div style={ { color: 'black', fontSize: 'large', paddingBottom: '10px', fontWeight: 600 }} >Site Url: { webUrlLink }</div>;

    // const GoToWebLink1 = GetGoToWebLink( { primarySource: primarySource, altWebText: 'Site Url:', }); // GetGoToListLink, GetGoToItemLink, GetGoToWebLink
    // const GoToWebLink2 = GetGoToWebLink( { primarySource: primarySource, altWebText: 'Go to site:', showWebIcon: true, webLinkCSS: { color: null, fontSize: null, marginRight: '60px'} }); // GetGoToListLink, GetGoToItemLink, GetGoToWebLink

    // const errorElement = errorMessage !== true ? undefined : <div style={{ background: 'yellow', color: 'red', height: '200px', paddingTop: '25px', textAlign: 'center' }}>
    //   { GoToWebLink1 }
    //   {/* <div style={{ color: 'black', paddingBottom: '5px', fontSize: 'large', fontWeight: 600 }}>Site Url: { webUrlLink }</div>
    //   <div style={{ color: 'black', paddingBottom: '15px', fontSize: 'large', fontWeight: 600  }}>Library: { listUrlLink }</div> */}
    //   <div style={{ fontSize: 'x-large', paddingBottom: '5px', fontWeight: 700 }}>{ stateSource.errorInfo.friendly }</div>
    //   <div style={{ fontSize: 'large', paddingBottom: '15px' }}>{ theMessage[ theMessage.length -1 ].replace('"}}}', '') }</div>
    //   { GoToWebLink2 }
    //   { gotoListLink }
    // </div>;
  
    const StatusElement : JSX.Element = FPSFetchStatus( primarySource, stateSource, disableSpinner );

    return (
          <div className={ [ 'sourcePage', sourcePageClassName ].join( ' ' ) }>
              { debugContent }
              { headingElement }
              { searchSourceDesc }
              {/* <div> */}
              { searchBox }
                {/* { AgeSlider }
              </div> */}

              { topSearchContent }
              { renderAsTable === true ? tableElement : undefined }
              { renderAsTable === false ? filtered : undefined }
              { StatusElement }
              { footerElement }
              {/* { FetchingSpinner } */}
              {/* { deepHistory }
              { thePanel } */}
          </div>


    );
  }
  
  private _clickTop( item: string, event: React.MouseEvent<HTMLDivElement, MouseEvent> ): void {

    const selected: string[] = this.toggleSearchInArray( this.state.topSearch, item , event.ctrlKey === true ? 'multi' : 'single' );
    console.log('_clickTop:', item, selected );

    const ageFilteredItems: IAnySourceItem[] = this.state.enableAge === false ? this.props.stateSource.items : [];
    if ( this.state.enableAge === true ) {
      this.props.stateSource.items.map( ( item: IAnySourceItem ) => { 
        if( item[ this.props.searchAgeProp ] > this.state.searchAge ) ageFilteredItems.push( item ); 
       } );
    }

    const filtered: IAnySourceItem[] = getFilteredItems( ageFilteredItems, this.state.searchText, [], [], [], selected );

    let lastVisible = this._itemsPerPage;

    if ( check4This( 'filtered=true' ) === true ) console.log( 'filtered SourePage', lastVisible, filtered, );

    if ( filtered.length < lastVisible ) lastVisible = filtered.length;

    this.setState({ 
      topSearch: selected , 
      filtered: filtered,
      firstVisible: 0,
      lastVisible: lastVisible - 1,
      resetArrows: makeid(4),
     });

  }

  
  private _detailsToggle(): void {
    const newState = this.state.detailToggle === true ? false : true;
    this.setState({ detailToggle: newState });
  }

  private toggleSearchInArray( searchArray: string[], value: string, doThis: 'multi' | 'single' ): string[] {

    let selected: string[] = JSON.parse(JSON.stringify( searchArray ));
    const idx = selected.indexOf( value );
    if ( doThis === 'multi' ) {
      if ( idx < 0 ) { selected.push( value ) ; } else { delete selected[ idx ] ; }
    } else if ( doThis === 'single' ) {
      if ( selected.length > 1 ) {
        selected = [ value ] ;  }
      else if ( idx < 0 ) { selected = [ value ] ; }
      else if ( idx > -1 ) { selected = [ ] ; }
      else { alert( 'toggleSearchInArrayError'); console.log('toggleSearchInArray Not triggered:', value, doThis, searchArray, ) ; }
    }

    return selected;

  }

  /**
   * https://www.kindacode.com/article/react-typescript-handling-onclick-event/
   * React.MouseEvent<HTMLImageElement>
   * @param NewSearch 
   * 
   * 
   * Found sample here:
   * https://github.com/pnp/sp-dev-fx-webparts/blob/b139ba199cb57363a88f070dd9814e5af4fc3cbd/samples/react-my-sites/src/webparts/mySites/components/MySites/MySites.tsx#L168
   * (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string)
   */

  private _onAgeChange ( ageIndex: number  ): void {

    const startTime = new Date();

    const searchAge = AgeSliderOptions[ Math.abs( ageIndex ) ].maxAge;  //ageIndex is negative... needs inverse to get array element

    // Defaults searchAgeProp to 'modifiedAge' if nothing is provided but ageSearch is enabled.
    // Defaults searchAgeOp to 'show <' if nothing is provided but ageSearch is enabled.
    const searchAgeProp: string = this.props.searchAgeProp ? this.props.searchAgeProp : 'modifiedAge';
    const searchAgeOp: string = this.props.searchAgeOp ? this.props.searchAgeOp : 'show <';

    const ageFilteredItems: IAnySourceItem[] = this.state.enableAge === false ? this.props.stateSource.items : [];
    if ( this.state.enableAge === true ) {
      this.props.stateSource.items.map( ( item: IAnySourceItem ) => { 
        if ( searchAgeOp === 'show >' ) {
          if( item[ searchAgeProp ] > searchAge ) ageFilteredItems.push( item ); 
        } else if ( searchAgeOp === 'show <' ) {
          if( item[ searchAgeProp ] < searchAge ) ageFilteredItems.push( item ); 
        } 
       } );
    }

    const filtered: IAnySourceItem[] = getFilteredItems( ageFilteredItems, this.state.searchText, [], [], [], this.state.topSearch );

    const endTime = new Date();
    const totalTime = endTime.getTime() - startTime.getTime();

    let lastVisible = this.props.itemsPerPage ? this.props.itemsPerPage : defaultMaxVisible;
    if (filtered.length < lastVisible ) lastVisible = filtered.length;

    this.setState({ filtered: filtered, 
      searchText: this.state.searchText,
      searchTime: totalTime,
      firstVisible: 0,
      lastVisible: lastVisible - 1,
      refreshId: makeid(4),
      resetArrows: makeid(4),
      searchAge: searchAge,
    });
  }

  private _onSearchChange ( event?: React.ChangeEvent<HTMLInputElement>, NewSearch?: string  ): void {

    const startTime = new Date();
    const SearchValue = NewSearch;

    const ageFilteredItems: IAnySourceItem[] = this.state.enableAge === false ? this.props.stateSource.items : [];
    if ( this.state.enableAge === true ) {
      this.props.stateSource.items.map( ( item: IAnySourceItem ) => { 
        if( item[ this.props.searchAgeProp ] > this.state.searchAge ) ageFilteredItems.push( item ); 
       } );
    }

    const filtered: IAnySourceItem[] = getFilteredItems( ageFilteredItems, NewSearch, [], [], [], this.state.topSearch );

    const endTime = new Date();
    const totalTime = endTime.getTime() - startTime.getTime();

    let lastVisible = this.props.itemsPerPage ? this.props.itemsPerPage : defaultMaxVisible;
    if (filtered.length < lastVisible ) lastVisible = filtered.length;

    this.setState({ filtered: filtered, 
      searchText: !SearchValue ? '' : SearchValue, 
      searchTime: totalTime,
      firstVisible: 0,
      lastVisible: lastVisible - 1,
      refreshId: makeid(4),
      resetArrows: makeid(4),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private clickListItem( ID: number, category: string, item: IAnySourceItem, e: any ): void {  
    if ( check4This(`onClicks=true`) === true ) console.log('onClicks clickNewsItem:', ID, item );
    this.setState({ showItemPanel : true , showThisItem: item }) ;

  }

  private clickTextFilter( value: string ): void {  
    if ( check4This(`onClicks=true`) === true ) console.log('onClicks clickTextFilter:', value );
    this._onSearchChange( null, value ) ;

  }

  private clickPropFilter( prop: string, value: string ): void {  
    if ( check4This(`onClicks=true`) === true ) console.log('onClicks clickPropFilter:', prop, value );
    //Clear filter if it was already set to this value
    if ( value === this.state.searchText ) value = '';
    this._onSearchChange( null, value ) ;

  }

  private _updateFirstLastVisible( firstVisible: number, lastVisible: number ) : void{
    this.setState({
      firstVisible: firstVisible,
      lastVisible: lastVisible,
    });
  }

}
