/* eslint-disable dot-notation */

import * as React from 'react';

import { getHighlightedText } from '@mikezimm/fps-library-v2/lib/components/atoms/Elements/HighlightedText';
import { IAnySourceItem } from '@mikezimm/fps-library-v2/lib/components/molecules/SourceList/IAnyContent';

// import { ISourceRowRender } from '../SourcePages/ISourceRowRender';
import { buildClickableIcon } from '@mikezimm/fps-library-v2/lib/components/atoms/Icons/stdIconsBuildersV02';
import { IZFetchedAnalytics } from '@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/IStateSourceA';
import { ISourceRowRender } from '../Pages/SourcePages/ISourceRowRender';
import { addGulpParam, removeGulpParam } from '@mikezimm/fps-library-v2/lib/components/atoms/Links/GulpLinks';

require ('./AnalyticsRow.css');
require ('@mikezimm/fps-styles/dist/fpsGeneralCSS.css');

export const ezAnalyticsItemHeaders: string[] = [ 'Id', 'Link', 'Gulp', 'Age', 'Who', 'lang', 'Web','Title', 'perf', 'screenSize' ];

export function createItemsRow( props: ISourceRowRender ): JSX.Element { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { item, onClick, searchText } = props; // details, showItemType, onOpenPanel

  const thisItem: IZFetchedAnalytics = item as IZFetchedAnalytics;

  const { Title, Id, Created, createdAge, SiteTitle, screenSize, } = thisItem; // , BannerImageUrl, PromotedState

  const siteUrl = item.SiteLink ? `${item.SiteLink.Url}` : '';

  const row = <tr className={ 'ezAnalyticsItem' } onClick = { () => onClick( Id, 'generic', item ) }>
    <td title={ null } >{ Id }</td>
    <td title={ null } >{ getSiteIcon( thisItem, false ) }</td>
    <td title={ null } >{ getSiteIcon( thisItem, true ) }</td>
    <td title={ Created } >{ createdAge.toFixed( 2 ) }</td>
    <td title={ null } >{ getHighlightedText( thisItem[ 'Author/Title' ], searchText ) }</td>
    <td title={ null } >{ getHighlightedText( thisItem[ 'language' ], searchText ) }</td>
    <td className={ siteUrl ? 'fps-gen-goToLink' : '' } onClick= { () => {  window.open( siteUrl ,'_blank') }}>{ getHighlightedText( SiteTitle, searchText ) }</td>
    <td title={ null } >{ getHighlightedText( Title, searchText ) }</td>
    <td title={ null } >{ `Add Perf here` }</td>
    <td title={ null } >{ screenSize }</td>


  </tr>;

  return row;

}

export const BulletedList : string = 'BulletedList';
export const OrgIcon : string = 'Org';
export const FolderIcon : string = 'Folder';
export const TagIcon : string = 'Tag';
export const ProcessingRunIcon : string = 'ProcessingRun';
export const SharepointLogo : string = 'SharepointLogo';

export const gulpParam1 = 'debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js';

export function getSiteIcon( item: IZFetchedAnalytics, gulpMe: boolean ): JSX.Element {
  if ( !item ) { console.log(`EasyAnalytics ERROR: getSiteIcon item is undefined!`, item); return undefined; }
  let linkUrl: string = '';
  let iconName: string = undefined;
  if ( item.PageURL ) {
    linkUrl = gulpMe === true ? `${item.PageURL}?${gulpParam1}` : item.PageURL ;
    iconName = gulpMe === true ? ProcessingRunIcon : 'Page';

  } else if ( item.PageLink ) {
    linkUrl = gulpMe === true ? addGulpParam( linkUrl ) : removeGulpParam( linkUrl );
    iconName = gulpMe === true ? ProcessingRunIcon : 'Page';

  } else if ( item.SiteLink ) {
    linkUrl = gulpMe === true ? `${item.SiteLink.Url}?${gulpParam1}` : item.SiteLink.Url ;
    iconName = gulpMe === true ? ProcessingRunIcon : 'SharepointLogo';
  }


  if ( !linkUrl ) { console.log(`EasyAnalytics ERROR: getSiteIcon linkUrl is undefined!`, item); return undefined; }

  const result = buildClickableIcon( 'EasyContents' , iconName, 'Go to Site', null, () => { window.open( linkUrl ,'_blank') }, item.Id, item.SiteTitle, );
  return result;
}
