

import * as React from 'react';

import { ISpinnerStyles, Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';

import { IStateSource } from '@mikezimm/fps-library-v2/lib/pnpjs/Common/IStateSource';
import { ISourceProps } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/Interface';
import { GetGoToListLink, GetGoToWebLink } from '@mikezimm/fps-library-v2/lib/components/atoms/Links/GoToLinks';
import { check4This } from "@mikezimm/fps-pnp2/lib/services/sp/CheckSearch";

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

  if ( !primarySource || !stateSource || ( stateSource && stateSource.errorInfo && stateSource.errorInfo.returnMess ) ) {
    if ( check4This(`testingLog=true`) === true ) console.log( 'testingLog FPSFetchStatus 1:', primarySource, stateSource );
    return FPSFetchError( primarySource , stateSource, ) ;
  }
  if ( disableSpinner !== true && stateSource && stateSource.loaded !== true ) {
    if ( check4This(`testingLog=true`) === true ) console.log( 'testingLog FPSFetchStatus 2:', disableSpinner, stateSource );
    return FPSFetchSpinner( primarySource , stateSource, ) ;

  }
  if ( check4This(`testingLog=true`) === true ) console.log( 'testingLog FPSFetchStatus 3:', primarySource, disableSpinner, stateSource );
  return undefined;

}

export function FPSFetchSpinner( primarySource: ISourceProps, stateSource: IStateSource, ) : JSX.Element {

  // This is duplicated in SearchPage.tsx and SourcePages.tsx as well
  const spinnerStyles : ISpinnerStyles = { label: {fontSize: '20px', fontWeight: '600',  }};
  const FetchingSpinner =  stateSource && stateSource.loaded === true ? undefined :
    ( primarySource === null || stateSource === null )  ? 
      <div style={ SpinnerContainerStyles }>
        { primarySource === null ? <div>NO Source Props defined</div> : <div>{ primarySource.key } is not defined</div> }
        { stateSource === null ? <div>NO State Source defined</div> : <div> State Source Status: { stateSource.status } </div> }
      </div>
    :
      <div style={ SpinnerContainerStyles }>
        <Spinner size={SpinnerSize.medium} label={"Fetching more information ..."} labelPosition= 'right' 
        style={{ paddingBottom: 10 }} styles={ spinnerStyles }/>
        { <div>Currently trying to fetch:  { primarySource.key }</div> }
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
    <div style={{ fontSize: 'x-large', paddingBottom: '5px', fontWeight: 700 }}>{ stateSource.errorInfo.friendly }</div>
    <div style={{ fontSize: 'large', paddingBottom: '15px' }}>{ theMessage[ theMessage.length -1 ].replace('"}}}', '') }</div>
    { GoToWebLink2 }
    { gotoListLink }
  </div>;

  return errorElement;

}