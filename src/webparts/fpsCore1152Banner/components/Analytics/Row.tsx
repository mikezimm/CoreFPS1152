
// import * as React from 'react';
// import styles from './Row.module.scss';

// import { getHighlightedText, IAnySourceItem } from '../../../fpsReferences';
// import { ISourceRowRender } from '../SourcePages/ISourceRowRender';
// // import { buildClickableIcon } from '@mikezimm/fps-library-v2/lib/components/atoms/Icons/stdIconsBuildersV02';

// export interface IThisItemInterface extends IAnySourceItem {
//   ID: number;
//   Status: string;
//   'File/ServerRelativeUrl': string;
//   WebPartTab: string;
//   SortOrder: number;
//   BannerImageUrl: string;
//   FirstPublishedDate: string;
//   PromotedState: number;
//   OData__OriginalSourceUrl: string;
//   'Editor/Title': string;
// }

// export function createAdminsRow( props: ISourceRowRender ): JSX.Element { // eslint-disable-line @typescript-eslint/no-explicit-any
//   const { item, onClick, searchText } = props; // details, showItemType, onOpenPanel

//   const thisItem: IThisItemInterface = item as IThisItemInterface;

//   const { Title, Description, FirstPublishedDate } = thisItem; // , BannerImageUrl, PromotedState
//   // const isNewsLink = thisItem.OData__OriginalSourceUrl !== null ? true : false;
//   // const isNews =  isNewsLink === false && ( PromotedState === 1 || PromotedState === 2 ) ? true : false; //
//   // const isOldLink = false;


//   const row = <div className={ styles.genericItem } onClick = { () => onClick( thisItem.ID, 'generic', item ) }>
//     <div title={ null } >{ getHighlightedText( Title, searchText ) }</div>
//     <div title={ null } >{ getHighlightedText( Description, searchText ) }</div>
//     <div title={ null } >{ FirstPublishedDate }</div>
//     <div title={ null } >{ FirstPublishedDate }</div>
//     <div title={ null } >{ FirstPublishedDate }</div>
//     <div title={ `${thisItem.FileRef}`} onClick={ () => window.open( thisItem.ServerRedirectedEmbedUrl, '_blank' )}
//       style={{ cursor: 'pointer' }}>{ getHighlightedText( thisItem.FileLeafRef, searchText )  }</div>
//   </div>;

//   return row;

// }