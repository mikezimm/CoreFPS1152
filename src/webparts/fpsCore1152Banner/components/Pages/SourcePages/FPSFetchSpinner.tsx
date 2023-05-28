

import * as React from 'react';

// import { Icon, } from 'office-ui-fabric-react/lib/Icon';
import { ISpinnerStyles, Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';

import { IStateSource } from '@mikezimm/fps-library-v2/lib/pnpjs/Common/IStateSource';
import { ISourceProps } from '@mikezimm/fps-library-v2/lib/pnpjs/SourceItems/Interface';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FPSFetchSpinner( stateSource: IStateSource, sourceProps: ISourceProps ) : JSX.Element {

    // This is duplicated in SearchPage.tsx and SourcePages.tsx as well
  // const FetchingSpinner = sourceProps !== null &&  stateSource !== null ? null : <div style={{display: 'inline'}}><Spinner size={SpinnerSize.large} label={"Fetching more information ..."} style={{ padding: 30 }} /></div>;
  const spinnerStyles : ISpinnerStyles = { label: {fontSize: '20px', fontWeight: '600',  }};
  const FetchingSpinner =  stateSource && stateSource.loaded === true ? undefined :
    ( sourceProps === null || stateSource === null )  ? 
      <div style={ SpinnerContainerStyles }>
        { sourceProps === null ? <div>NO Source Props defined</div> : <div>{ sourceProps.key } is not defined</div> }
        { stateSource === null ? <div>NO State Source defined</div> : <div> State Source Status: { stateSource.status } </div> }
      </div>
    :
      // <div style={{display: 'inline', top: -10, position: 'relative'}}>
      <div style={ SpinnerContainerStyles }>
        <Spinner size={SpinnerSize.medium} label={"Fetching more information ..."} labelPosition= 'right' 
        style={{ paddingBottom: 10 }} styles={ spinnerStyles }/>
        { <div>{ sourceProps.key } is not defined</div> }
        { <div> State Source Status: { stateSource.status } </div> }
      </div>;
  return FetchingSpinner;

}


