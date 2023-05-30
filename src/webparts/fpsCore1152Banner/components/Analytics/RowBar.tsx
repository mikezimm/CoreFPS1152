/* eslint-disable dot-notation */

import * as React from 'react';

import { getHighlightedText } from '@mikezimm/fps-library-v2/lib/components/atoms/Elements/HighlightedText';
import { IAnySourceItem } from '@mikezimm/fps-library-v2/lib/components/molecules/SourceList/IAnyContent';

// import { ISourceRowRender } from '../SourcePages/ISourceRowRender';
import { buildClickableIcon } from '@mikezimm/fps-library-v2/lib/components/atoms/Icons/stdIconsBuildersV02';
import { IZFetchedAnalytics } from '@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/IStateSourceA';
import { ISourceRowRender } from '../Pages/SourcePages/ISourceRowRender';
import { addGulpParam, removeGulpParam } from '@mikezimm/fps-library-v2/lib/components/atoms/Links/GulpLinks';
import { IOjbectKeySummaryItem } from './summarizeArrayByKey';

require ('./AnalyticsRow.css');
require ('@mikezimm/fps-styles/dist/fpsGeneralCSS.css');

export const ezAnalyticsBarHeaders: string[] = [ 'Item', 'Count', '', 'Avg', 'Sum', ];

export function createBarsRow( props: ISourceRowRender ): JSX.Element { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { item, onClick, searchText } = props; // details, showItemType, onOpenPanel

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thisItem: IOjbectKeySummaryItem = item as any;

  const { primaryKey, percentB, countI, link } = thisItem; // , BannerImageUrl, PromotedState

  const siteUrl = item.SiteLink ? `${item.SiteLink.Url}` : '';

  const row = <tr className={ 'ezAnalyticsBarRow' } onClick = { () => onClick( -1 , 'generic', item ) }>
    <td title={ null } style={{ maxWidth: '300px' }}>{ getHighlightedText( primaryKey, searchText ) }</td>
    <td title={ null } >{ countI }</td>
    <td title={ null } className={ 'ezAnalyticsBarCell' } ><div className={ 'eazyBar' } style={{ 'width': `calc(${percentB}% - 20px)` } }/></td>
  </tr>;

  return row;

}
