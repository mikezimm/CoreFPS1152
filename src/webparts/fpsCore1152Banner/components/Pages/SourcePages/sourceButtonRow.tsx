import * as React from 'react';

export interface ISourceButtonRowProps {
  title: string;
  Labels: string[];
  onClick ( index: number,): void;
  selected?: number;
  infoEle?: JSX.Element | string;
  rowClass?: string;
  selectedClass?: string; // pass in background and color theme from SPFx
}

export function sourceButtonRow( props: ISourceButtonRowProps ): JSX.Element  {
  const { title, Labels, selected, selectedClass, onClick } = props;

  const result: JSX.Element = <div style={{ }} className= { [ 'sourceButtonRow', props.rowClass ].join( ' ' ) } >{ title }
  { Labels.map( ( label, index ) => { 
    return <button key={ label } onClick={ () => onClick( index )} 
      className={ [ 'button', index === selected ? 'isSelected' : '' , index === selected ? selectedClass : '' ].join( ' ' ) } >{ label }</button> 
  } ) }
  { props.infoEle ? props.infoEle : undefined }
  </div>;

  return result;

}