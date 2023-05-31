// import * as React from 'react';
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { useState, useEffect } from 'react';
// import { IStateSource } from '@mikezimm/fps-library-v2/lib/pnpjs/Common/IStateSource';
// // import { Icon  } from 'office-ui-fabric-react/lib/Icon';

// import Accordion from '@mikezimm/fps-library-v2/lib/components/molecules/Accordion/Accordion';

// import styles from './header.module.scss';

// import { ISourceProps } from '../../DataInterface';


// export interface IAdminsPageProps {

//   easyPagesPageProps: IEasyPagesPageProps;  // Props specific to this Source/Page component
//   easyPagesSourceProps: IEasyPagesSourceProps;  // General props which apply to all Sources/Pages
//   EasyIconsObject: IEasyIcons;

//   primarySource: ISourcePropsCOP;
//   fpsItemsReturn : IStateSource;

//   // topButtons: string[];

//   // pageWidth: number;

//   // deepProps: string[];

//   // bumpDeepLinks: any;
//   // jumpToDeepLink?: any;

//   // stateSource: IStateSource;

//   debugMode?: boolean; //Option to display visual ques in app like special color coding and text
//   mainPivotKey: ITabMain;
//   wpID: string; //Unique Web Part instance Id generated in main web part onInit to target specific Element IDs in this instance
// }

// /***
//  *    .d8888. d888888b  .d8b.  d8888b. d888888b      db   db  .d88b.   .d88b.  db   dD 
//  *    88'  YP `~~88~~' d8' `8b 88  `8D `~~88~~'      88   88 .8P  Y8. .8P  Y8. 88 ,8P' 
//  *    `8bo.      88    88ooo88 88oobY'    88         88ooo88 88    88 88    88 88,8P   
//  *      `Y8b.    88    88~~~88 88`8b      88         88~~~88 88    88 88    88 88`8b   
//  *    db   8D    88    88   88 88 `88.    88         88   88 `8b  d8' `8b  d8' 88 `88. 
//  *    `8888Y'    YP    YP   YP 88   YD    YP         YP   YP  `Y88P'   `Y88P'  YP   YD 
//  *                                                                                     
//  *                                                                                     
//  */

// const AdminsPageHook: React.FC<IAdminsPageProps> = ( props ) => {

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { debugMode, mainPivotKey, wpID, primarySource, easyPagesPageProps } = props; //appLinks, news 

//   const [ teachBubble, setTeachBubble ] = useState<number>( null );
//   const [ lastBubble, setLastBubble ] = useState<number>( 0 );

//   /***
//  *     .d88b.  d8b   db       .o88b. db      d888888b  .o88b. db   dD .d8888. 
//  *    .8P  Y8. 888o  88      d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 88'  YP 
//  *    88    88 88V8o 88      8P      88         88    8P      88,8P   `8bo.   
//  *    88    88 88 V8o88      8b      88         88    8b      88`8b     `Y8b. 
//  *    `8b  d8' 88  V888      Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. db   8D 
//  *     `Y88P'  VP   V8P       `Y88P' Y88888P Y888888P  `Y88P' YP   YD `8888Y' 
//  *                                                                            
//  *                                                                            
//  */

//   // useEffect(() => {
//   //   setExpandedState( easyPagesExpanded )
//   // }, [ debugMode ] );

//   const closeTour = ( ): void => {
//     const saveBubble = teachBubble + 0;
//     setLastBubble( saveBubble );
//     setTeachBubble( null );
//   }

//   const updateTour = ( newBubble: number ): void => { onParentCall( 'GoToItems', -1, '', item )
//     const saveBubble = newBubble + 0;
//     setLastBubble( saveBubble );
//     setTeachBubble( saveBubble );
//   }

//   /***
//  *    d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b 
//  *    88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~' 
//  *    88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88    
//  *    88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88    
//  *    88.     88booo. 88.     88  88  88 88.     88  V888    88    
//  *    Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP    
//  *                                                                 
//  *                                                                 
//  */
//   // const bannerImage: string = `https://www.tenant.com/sites/default/files/2022-04/background%402x.jpg`.replace(`tenant`,'vilotua'.split("").reverse().join(''));
//   // const backgroundImage: string = `url("${bannerImage}")`;

//   const TeachMe = teachBubble === null ? null : makeBubbleElementFromBubbles( lastBubble, getTeachBubbles( AllTeachBubbles ,'', 'Admins' ), updateTour, closeTour );

//   const EasyPages: JSX.Element = <EasyPagesPageHook
//     easyPagesPageProps = {{
//       expandedState: true,
//       tabs: primarySource.defSearchButtons,
//       source: primarySource,
//       sourceName: 'Alternate',
//       parentUrl: '',
//     }}
//     easyPagesSourceProps={ props.easyPagesSourceProps }  // General props which apply to all Sources/Pages
//     EasyIconsObject = { props.EasyIconsObject }
//     fpsItemsReturn={ props.fpsItemsReturn }
//     linkFormat={ PivotLinkFormat.tabs }
//   />

//   const AccordionContent: JSX.Element = <div>
//     <div>You are special!</div>
//     <ul>
//       <li>You have access to the Admins tab so you must be a Records site admin.</li>
//       <li>This tab gives you easy access to all of your site pages from any Compliance web part in the company.</li>
//       {/* <li>Click the buttons to filter your site pages by the WebPart Tab they fall under (like Instructions).</li> */}
//       <li>The Admin tab has information about how this web part and site are designed to work.</li>
//     </ul>
//   </div>;

//   const InfoElement: JSX.Element = <Accordion 
//     title = { 'More information about this tab' }
//     defaultIcon = 'Help'
//     showAccordion = { true }
//     content = { AccordionContent }
//     contentStyles = { { height: '125px' } }
//   />;

//   const AdminsPageElement: JSX.Element = mainPivotKey !== 'Admins' ? null : <div className = { styles.page } style={ null }>
//     { InfoElement }
//     { EasyPages }
//     {/* <div id={ 'ComplAdminStartTour' } ><Icon iconName={ 'MapPin' }/></div> */}
//     { TeachMe }
//   </div>;

//   return ( AdminsPageElement );

// }

// export default AdminsPageHook;