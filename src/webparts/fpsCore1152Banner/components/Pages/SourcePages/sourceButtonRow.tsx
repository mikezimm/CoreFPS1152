import * as React from 'react';

export interface ISourceButtonRowProps {
  title: string;
  Labels: string[];
  onClick ( index: number,): void;
  selected?: number;
  infoEle?: JSX.Element | string;
  rowClass?: string;
}

export function sourceButtonRow( props: ISourceButtonRowProps ): JSX.Element  {
  const { title, Labels, selected, onClick } = props;

  const result: JSX.Element = <div style={{ }} className= { [ 'sourceButtonRow', props.rowClass ].join( ' ' ) } >{ title }
  { Labels.map( ( label, index ) => { 
    return <button key={ label } onClick={ () => onClick( index )} 
      className={ index === selected ? 'isSelected' : '' } >{ label }</button> 
  } ) }
  { props.infoEle ? props.infoEle : undefined}
  </div>

  return result;

}