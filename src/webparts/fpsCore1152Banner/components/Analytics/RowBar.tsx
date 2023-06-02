/* eslint-disable dot-notation */

import * as React from 'react';

import { getHighlightedText } from '@mikezimm/fps-library-v2/lib/components/atoms/Elements/HighlightedText';
import { ISourceRowRender } from '../Pages/SourcePages/ISourceRowRender';
import { IOjbectKeySummaryItem } from './summarizeArrayByKey';

require ('@mikezimm/fps-styles/dist/easyAnalytics.css');
require ('@mikezimm/fps-styles/dist/fpsGeneralCSS.css');

export const ezAnalyticsBarHeaders: string[] = [ 'Item', 'Count', 'Count pareto', 'TBD-Avg', 'TBD-Sum', ];

export function createBarsRow( props: ISourceRowRender ): JSX.Element { 
  const { item, onClick, searchText } = props; 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thisItem: IOjbectKeySummaryItem = item as any;

  const { primaryKey, percentB, countI, link } = thisItem;

  const isLink: boolean = link || item.keyZ !== 'createdAge' ? true : false;

  const row = <tr className={ 'ezAnalyticsBarRow' } onClick = { () => onClick( -1 , 'generic', item ) }>
    <td className={ isLink === true ? 'fps-gen-goToLink' : '' } title={ link }
      onClick= { isLink === true ? () => props.onParentCall( 'GoToItems', -1, '', item ) : undefined } >{ getHighlightedText( primaryKey, searchText ) }</td>
    <td style={ { width: '50px' } } >{ countI }</td>
    <td title={ null } className={ 'ezAnalyticsBarCell' } ><div className={ 'eazyBar' } style={{ 'width': `calc(${percentB}% - 20px)` } }/></td>
  </tr>;

  return row;

}
