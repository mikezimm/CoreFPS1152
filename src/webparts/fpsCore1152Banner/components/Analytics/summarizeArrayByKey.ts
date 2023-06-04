
import { IAnySourceItem } from "@mikezimm/fps-library-v2/lib/components/molecules/SourceList/IAnyContent";
import { IPerformanceOp, makeid, sortObjectArrayByNumberKey } from "../../fpsReferences";
import { IPerformanceSettings } from "@mikezimm/fps-library-v2/lib/components/molecules/Performance/IPerformanceSettings";
import { startPerformOpV2, updatePerformanceEndV2 } from "@mikezimm/fps-library-v2/lib/components/molecules/Performance/functions";
import { getBestAnalyticsLinkAndIcon } from "./getBestAnalyticsLinkAndIcon";
import { IZFetchedAnalytics } from "@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/interfaces/IStateSourceA";
import { check4This } from "@mikezimm/fps-pnp2/lib/services/sp/CheckSearch";

export interface IOjbectKeySummaryItem {
  primaryKey: string;
  link?: string;
  countT: number; // count of items that are included in the summary
  countI: number; // items that actually have a value in the key
  countV: number; // items that actually have a value in the key
  percentT: number; // percent of total items
  percentV: number; // percent of total value
  percentB: number; // percent of max bar length ( largest value in summary )
  sum: number;
  avg: number;
  labelV: string;
  searchTextLC: string;
  items: IAnySourceItem[];
  key0?: string[];
  key1?: string[];
  key2?: string[];
  key3?: string[];
  key4?: string[];
  key5?: string[];
  keyZ: string;
}

export interface IObjArraySummary {
  keys: string[];
  summaries: IOjbectKeySummaryItem[];
  topLabels: string[];
}

export function createKeyObject(keyZ: string, prime: string, labelV: string, otherKeys: string[]): IOjbectKeySummaryItem {
  prime = prime ? prime : `<< EMPTY ${ keyZ } >>`;
  const result: IOjbectKeySummaryItem = {
    primaryKey: prime,
    link: '',
    countT: 0,
    countI: 0,
    countV: 0,
    percentT: 0,
    percentV: 0,
    percentB: 0,
    labelV: labelV,
    searchTextLC: '',
    sum: 0,
    avg: 0,
    items: [],
    keyZ: keyZ,
  };
  // create empty arrays as needed
  [ 0,1,2,3,4,5 ].map( num => { 
    if ( otherKeys.length > num ) { 
      result[ `key${num}` as 'key0' ] = [];
    }});

  return result;
}

export interface IAnalyticsSummary {
  Titles: IObjArraySummary;
  Sites: IObjArraySummary;
  Offices: IObjArraySummary;
  Languages: IObjArraySummary;
  Users: IObjArraySummary;
  Dates: IObjArraySummary;
  CodeVersion: IObjArraySummary;
  performanceOp: IPerformanceOp;
  refreshId: string;
  stats: {
    Titles: number;
    Sites: number;
    Offices: number;
    Languages: number;
    Users: number;
    Dates: number;
    CodeVersion: number;
  }
}

export function easyAnalyticsSummary( items: IAnySourceItem[] ) : IAnalyticsSummary {

  const performanceSettings: IPerformanceSettings = {  label: 'summary', updateMiliseconds: true, includeMsStr: true, op: 'analyze' };
  let performanceOp = performanceSettings ? startPerformOpV2( performanceSettings ) : null;

  const Titles = summarizeArrayByKey( items, 'Titles', 'Title',[ 'Author/Office', 'Author/Title', 'language', 'CodeVersion' ] );
  const Sites = summarizeArrayByKey( items, 'SiteTitle', 'Title',[ 'Author/Office', 'Author/Title', 'language', 'CodeVersion' ] );
  const Offices = summarizeArrayByKey( items, 'Author/Office', 'Title',[ 'SiteTitle', 'Author/Title', 'language', 'CodeVersion' ] );
  const Languages = summarizeArrayByKey( items, 'language', 'Title',[ 'SiteTitle', 'Author/Title', 'Author/Office', 'CodeVersion' ] );
  const Users = summarizeArrayByKey( items, 'Author/Title', 'Title',[ 'Author/Office', 'SiteTitle', 'language', 'CodeVersion' ] );
  const Dates = summarizeArrayByKey( items, 'createdAge', 'Title',[ 'Author/Office', 'SiteTitle', 'language', 'Author/Title', 'CodeVersion' ] );
  const CodeVersion = summarizeArrayByKey( items, 'CodeVersion', 'Title',[ 'Author/Office', 'SiteTitle', 'language', 'Author/Title', 'createdAge' ] );

  performanceOp = updatePerformanceEndV2( { op: performanceOp, updateMiliseconds: performanceSettings.updateMiliseconds, count: items.length * 6 });

  const result: IAnalyticsSummary = {
    Titles: Titles,
    Sites: Sites,
    Offices: Offices,
    Languages: Languages,
    Users: Users,
    Dates: Dates,
    CodeVersion: CodeVersion,
    performanceOp: performanceOp,
    refreshId: makeid(5),
    stats: {
      Titles: Titles.keys.length,
      Sites: Sites.keys.length,
      Offices: Offices.keys.length,
      Languages: Languages.keys.length,
      Users: Users.keys.length,
      Dates: Dates.keys.length,
      CodeVersion: CodeVersion.keys.length,
    }
  }

  if ( check4This( 'sourceResults=true' ) === true )  console.log( 'sourceResults easyAnalyticsSummary', result, );

  return result;
}


export function summarizeArrayByKey( items: IAnySourceItem[], key: string, valProp: string, otherKeys: string[] ): IObjArraySummary {

  const summary: IObjArraySummary = {
    keys: [],
    summaries: [],
    topLabels: [],
  };

  const keyIsDate: boolean = key.indexOf('Age') > -1 ? true : false;

  items.map(( item: IAnySourceItem, idx0: number ) => {

    let itemValue = item[key];

    // if itemValue is a date, then convert to integer to group by date in the past
    if ( keyIsDate === true ) itemValue = parseInt( itemValue , 10) + 0; // Added 0 to make this non mutating

    // Get index of this item and create object if it does not exist
    let idx: number = summary.keys.indexOf( itemValue );

    if (idx < 0) {
      idx = summary.keys.length;
      summary.keys.push( itemValue );
      const keyItem: IOjbectKeySummaryItem = createKeyObject(key,  keyIsDate === true ? getDateLabel(itemValue) : itemValue, valProp, otherKeys );

      // Only add link if it is for a site.
      if ( key === 'SiteTitle' ) keyItem.link = getBestAnalyticsLinkAndIcon( item as IZFetchedAnalytics, false, [ 'SiteLink', 'PageLink', 'PageURL' ] ).linkUrl;
      summary.summaries.push( keyItem );
    }

    item.primeIdx = idx0;
    const thisSum = summary.summaries[idx];
    thisSum.countT++;
    if (item[key])
      thisSum.countI++;
    if (typeof item[key] === 'number' || typeof item[key] === 'bigint') {
      thisSum.countV++;
      thisSum.sum += item[key];
    }

    // Add other keys for additional information
    otherKeys.map((oKey: string, idx: number) => {
      if (item[oKey] && thisSum[`key${idx}` as 'key0'].indexOf(item[oKey]) < 0) {
        thisSum[`key${idx}` as 'key0'].push(item[oKey]);
      }
    });

    thisSum.items.push(item);
  });

  summary.summaries.map(thisSum => {
    if (thisSum.sum > 0) thisSum.avg = thisSum.sum / thisSum.countV;
  });

  // Sort by count unless it's an age, then asc sort by date ( which is the avg value of the column )
  summary.summaries = sortObjectArrayByNumberKey( summary.summaries, 'dec', keyIsDate === true ? 'avg' : 'countT' );

  // Get top 10 labels by count
  summary.topLabels = summary.summaries.slice( 0, 9 ).map( item => { return item.primaryKey });

  // Get % T - 100 = max item:  https://stackoverflow.com/a/16751601
  const sumCountT: number = summary.summaries.map( sum => { return sum.countT }).reduce((partialSum, a) => partialSum + a, 0);
  const countMax: number = Math.max( ...summary.summaries.map( sum => { return sum.countT }) );
  if ( sumCountT !== 0 ) summary.summaries.map( summary => { summary.percentT = ( summary.countT / sumCountT ) * 100 });
  if ( countMax !== 0 )  summary.summaries.map( summary => { summary.percentB = ( summary.countT / countMax ) * 100 });
  summary.summaries.map( summary => { summary.searchTextLC = summary.primaryKey.toLowerCase() });
  
  return summary;

}

function getDateLabel(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString();
}