

import * as React from 'react';

// import { Icon, } from 'office-ui-fabric-react/lib/Icon';
import { ISpinnerStyles, Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';

import { IStateSource } from '@mikezimm/fps-library-v2/lib/pnpjs/Common/IStateSource';
import { ISourceProps } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/Interface';
import { GetGoToListLink, GetGoToWebLink } from '@mikezimm/fps-library-v2/lib/components/atoms/Links/GoToLinks';

const SpinnerContainerStyles: React.CSSProperties = {
  display: 'flex',
  backgroundColor: 'lightyellow',
  textAlign: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  fontSize: 'larger',
  fontWeight: 600,
}

export function FPSFetchStatus( primarySource: ISourceProps, stateSource: IStateSource, disableSpinner?: boolean ): JSX.Element {

  if ( !primarySource || stateSource || ( stateSource && stateSource.errorInfo && stateSource.errorInfo.returnMess ) ) return FPSFetchError( primarySource , stateSource, ) ;
  if ( disableSpinner !== true && stateSource && stateSource.loaded !== true ) return FPSFetchSpinner( primarySource , stateSource, ) ;
  return undefined;

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FPSFetchSpinner( primarySource: ISourceProps, stateSource: IStateSource, ) : JSX.Element {

    // This is duplicated in SearchPage.tsx and SourcePages.tsx as well
  // const FetchingSpinner = primarySource !== null &&  stateSource !== null ? null : <div style={{display: 'inline'}}><Spinner size={SpinnerSize.large} label={"Fetching more information ..."} style={{ padding: 30 }} /></div>;
  const spinnerStyles : ISpinnerStyles = { label: {fontSize: '20px', fontWeight: '600',  }};
  const FetchingSpinner =  stateSource && stateSource.loaded === true ? undefined :
    ( primarySource === null || stateSource === null )  ? 
      <div style={ SpinnerContainerStyles }>
        { primarySource === null ? <div>NO Source Props defined</div> : <div>{ primarySource.key } is not defined</div> }
        { stateSource === null ? <div>NO State Source defined</div> : <div> State Source Status: { stateSource.status } </div> }
      </div>
    :
      // <div style={{display: 'inline', top: -10, position: 'relative'}}>
      <div style={ SpinnerContainerStyles }>
        <Spinner size={SpinnerSize.medium} label={"Fetching more information ..."} labelPosition= 'right' 
        style={{ paddingBottom: 10 }} styles={ spinnerStyles }/>
        { <div>{ primarySource.key } is not defined</div> }
        { <div> State Source Status: { stateSource.status } </div> }
      </div>;
  return FetchingSpinner;

}


export function FPSFetchError( primarySource: ISourceProps, stateSource: IStateSource, ) : JSX.Element {

  const GoToWebLink1 = GetGoToWebLink( { primarySource: primarySource, altWebText: 'Site Url:', }); // GetGoToListLink, GetGoToItemLink, GetGoToWebLink
  const GoToWebLink2 = GetGoToWebLink( { primarySource: primarySource, altWebText: 'Go to site:', showWebIcon: true, webLinkCSS: { color: null, fontSize: null, marginRight: '60px'} }); // GetGoToListLink, GetGoToItemLink, GetGoToWebLink

  const gotoListLink = GetGoToListLink( { primarySource: primarySource, }); // GetGoToListLink, GetGoToItemLink, GetGoToWebLink

  const errorMessage = stateSource && stateSource.errorInfo && stateSource.errorInfo.returnMess ? true : false;
  const theMessage = errorMessage === false ? '' : stateSource.errorInfo.returnMess.split('"value":"');

  const errorElement = errorMessage !== true ? undefined : <div style={{ background: 'yellow', color: 'red', height: '200px', paddingTop: '25px', textAlign: 'center' }}>
    { GoToWebLink1 }
    {/* <div style={{ color: 'black', paddingBottom: '5px', fontSize: 'large', fontWeight: 600 }}>Site Url: { webUrlLink }</div>
    <div style={{ color: 'black', paddingBottom: '15px', fontSize: 'large', fontWeight: 600  }}>Library: { listUrlLink }</div> */}
    <div style={{ fontSize: 'x-large', paddingBottom: '5px', fontWeight: 700 }}>{ stateSource.errorInfo.friendly }</div>
    <div style={{ fontSize: 'large', paddingBottom: '15px' }}>{ theMessage[ theMessage.length -1 ].replace('"}}}', '') }</div>
    { GoToWebLink2 }
    { gotoListLink }
  </div>;

  return errorElement;

}