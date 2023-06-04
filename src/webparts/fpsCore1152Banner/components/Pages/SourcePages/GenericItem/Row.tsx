
// import * as React from 'react';

// import styles from './Row.module.scss';
// // import stylesSP from '../SourcePages.module.scss';

// import { getHighlightedText,  } from '../../../../fpsReferences'; //IAnySourceItem
// import { SourceIconElement } from '../IconElement';
// import { SearchTypesCOP } from '../../../DataInterface';
// import { ISourceRowRender } from '../ISourceRowRender';


// export function createAccountRow( props: ISourceRowRender ): JSX.Element { // eslint-disable-line @typescript-eslint/no-explicit-any
//   const { item, searchText, onClick, showItemType } = props; //details

//     /* eslint-disable @typescript-eslint/no-explicit-any */
//     const title: any = <div title="OneStream Account / AccountType">{ getHighlightedText( `${ item.Title } / ${ item.AccountType }`, searchText )  }</div>;
//     const accountName: any = <div title="Name">{  getHighlightedText( `${ item.Name1 }`, searchText )  }</div>;  // 
//     const RCM: any = item['RCM'] ? getHighlightedText( `${ item['RCM'] }`, searchText ) : ''; // eslint-disable-line dot-notation 
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const description: string | JSX.Element = !item.Description ? '---' : getHighlightedText( `${ item.Description }`, searchText );

//     /* eslint-disable @typescript-eslint/no-explicit-any */
//     // const descElement: JSX.Element = <div className={ details === true ? stylesSP.showDetails : stylesSP.textEllipse }>
//     //   { description }
//     // </div>;

//     const row = <div className={ styles.genericItem } style={{cursor: 'pointer' }} onClick = { () => onClick( item.ID, 'generic', item ) }>

//         { SourceIconElement( SearchTypesCOP.objs[item.typeIdx].icon, showItemType && item.File_x0020_Type ? item.File_x0020_Type : showItemType && item.type ? item.type : '' )}
//         <div className={ styles.genericDetails}>
//           <div className={ styles.genericRow1 }>
//             { title }
//             { accountName }
//             { RCM }
//           </div>
//           {/* { descElement } */}
//         </div>
//     </div>;

//     return row;

// }