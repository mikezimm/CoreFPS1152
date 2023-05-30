
import { IAnySourceItem } from '@mikezimm/fps-library-v2/lib/components/molecules/SourceList/IAnyContent';
// import { ICanvasContentOptions } from "../INTERFACES/IModernPage";
// import { IFinManSearch } from "../INTERFACES/IFinManSearch";
import { IMinPageArrowsState, IPageArrowsParentProps } from '@mikezimm/fps-library-v2/lib/components/molecules/Arrows/PageArrows';
import { ISourceRowRender } from "./ISourceRowRender";
import { IStateSource } from '@mikezimm/fps-library-v2/lib/pnpjs/Common/IStateSource';
import { ISourceProps } from "@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/Interface";
// import { ISourcePanelRender } from "./ISourcePanelRender";

export type ITableHeaderElement  = string | JSX.Element ;

// export interface ISourcePagePanelSettings {
//   renderItemPanel( props: ISourcePanelRender ): JSX.Element;
//   listLink: boolean;
//   itemLink: boolean;
//   itemDetails: boolean;
// }

export interface ISourcePagesProps extends IPageArrowsParentProps {
  // refreshId: string;

  resetArrows?: string; //unique Id used to reset arrows to starting position

  ageSlider?: boolean;
  searchAgeProp?: string;  // Defaults searchAgeProp to 'modifiedAge' if nothing is provided but ageSearch is enabled.
  searchAgeOp?: 'show >' | 'show <';  // Defaults searchAgeOp to 'show <' if nothing is provided but ageSearch is enabled.
  ageIndexDefault?: number;

  startQty: number;  //Number of items to show for paging

  showItemType: boolean; // was previously - search: IFinManSearch ;

  primarySource: ISourceProps;
  topButtons: string[];

  pageWidth: number;

  deepProps: string[];

  // bumpDeepLinks: any;
  // jumpToDeepLink?: any;

  stateSource: IStateSource;
  renderRow( props: ISourceRowRender ): JSX.Element;

  disableSpinner?: boolean; // default === false.  Set to true to disable fetching spinner

  tableHeaderElements?: ITableHeaderElement[];
  tableClassName?: string;
  tableHeaderClassName?: string;

  selectedClass: string; // pass in background and color theme from SPFx for selected buttons

  // onParentCall is a pass down from the parent web part component and SHOULD look for this signature.
  onParentCall(command: string, Id: number, type: string, item: IAnySourceItem) : void;

  // canvasOptions: ICanvasContentOptions;

  debugMode?: boolean; //Option to display visual ques in app like special color coding and text

  showGoToList?: boolean; // shows the 'Go to full list' link next to the label.  Default === true

  headingElement?: JSX.Element; //Element visible above the list
  footerElement?: JSX.Element; //Element visible below the list
}

export type ISort = 'asc' | 'dec' | '-';

export interface ISourcePagesState extends IMinPageArrowsState {
  // description: string;

  resetArrows?: string; //unique Id used to reset arrows to starting position

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filtered: any[];
  topSearch: string[];

  showItemPanel: boolean;
  showThisItem: IAnySourceItem;
  showCanvasContent1: boolean;
  showPanelJSON: boolean;

  sortNum: ISort;
  sortName: ISort;
  sortGroup: ISort;

  searchText: string;
  searchTime: number;
  searchAge: number;

  refreshId: string;

  detailToggle: boolean;

  enableAge: boolean;

  // firstVisible: number; //Index of item to start showing ( for paging )
  // lastVisible: number; //Index of item to start showing ( for paging )

}
