/* eslint-disable dot-notation */

import * as React from 'react';

import { getHighlightedText } from '@mikezimm/fps-library-v2/lib/components/atoms/Elements/HighlightedText';

import { buildClickableIcon } from '@mikezimm/fps-library-v2/lib/components/atoms/Icons/stdIconsBuildersV02';
import { IZFetchedAnalytics } from '@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/interfaces/IStateSourceA';
import { ISourceRowRender } from '../Pages/SourcePages/ISourceRowRender';
import { IAnalyticsLinkIcon, getBestAnalyticsLinkAndIcon } from './getBestAnalyticsLinkAndIcon';

require ('@mikezimm/fps-styles/dist/easyAnalytics.css');
require ('@mikezimm/fps-styles/dist/fpsGeneralCSS.css');

export const ezAnalyticsItemHeaders: string[] = [ 'Id', 'Link', 'Gulp', 'Age', 'Who', 'lang', 'Loc', 'Web','Title', 'perf', 'CodeVersion' ];

export function createItemsRow( props: ISourceRowRender ): JSX.Element { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { item, onClick, searchText } = props; // details, showItemType, onOpenPanel

  const thisItem: IZFetchedAnalytics = item as IZFetchedAnalytics;

  const { Title, Id, Created, createdAge, SiteTitle, CodeVersion, } = thisItem; // , BannerImageUrl, PromotedState

  const isItem: boolean = Id ? true : false;
  const siteUrl = item.SiteLink ? `${item.SiteLink.Url}` : '';

  const row = !isItem ? undefined : <tr className={ 'ezAnalyticsItem' } onClick = { () => onClick( Id, 'generic', item ) }>
    <td title={ null } >{ getHighlightedText( `${thisItem.Id}`, searchText ) }</td>
    <td title={ null } >{ getSiteIcon( thisItem, false ) }</td>
    <td title={ null } >{ getSiteIcon( thisItem, true ) }</td>
    <td title={ Created } >{ createdAge.toFixed( 2 ) }</td>
    <td title={ null } >{ getHighlightedText( thisItem[ 'Author/Title' ], searchText ) }</td>
    <td title={ null } >{ getHighlightedText( thisItem[ 'language' ], searchText ) }</td>
    <td title={ null } >{ getHighlightedText( thisItem[ 'Author/Office' ], searchText ) }</td>
    <td className={ siteUrl ? 'fps-gen-goToLink' : '' } title={ siteUrl } onClick= { () => {  window.open( siteUrl ,'_blank') }}>{ getHighlightedText( SiteTitle, searchText ) }</td>
    <td title={ null } >{ getHighlightedText( Title, searchText ) }</td>
    <td title={ null } >{ `Add Perf here` }</td>
    <td title={ null } >{ CodeVersion }</td>

  </tr>;

  return row;

}

export const ProcessingRunIcon : string = 'ProcessingRun';
export const SharepointLogo : string = 'SharepointLogo';

export const gulpParam1 = 'debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js';

export function getSiteIcon( item: IZFetchedAnalytics, gulpMe: boolean ): JSX.Element {
  if ( !item ) { console.log(`EasyAnalytics ERROR: getSiteIcon item is undefined!`, item); return undefined; }

  const itemLinkInfo: IAnalyticsLinkIcon = getBestAnalyticsLinkAndIcon( item, gulpMe, [ 'PageURL' , 'PageLink' , 'SiteLink' ] );
  const { iconName, linkUrl } = itemLinkInfo;

  if ( !linkUrl ) { console.log(`EasyAnalytics ERROR: getSiteIcon linkUrl is undefined!`, item); return undefined; }

  const result = buildClickableIcon( 'EasyContents' , iconName, `Go to Site - ${linkUrl}`, null, () => { window.open( linkUrl ,'_blank') }, item.Id, item.SiteTitle, );
  return result;
}



