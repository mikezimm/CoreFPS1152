import { IZFetchedAnalytics } from '@mikezimm/fps-library-v2/lib/banner/components/EasyPages/Analytics/interfaces/IStateSourceA';
import { addGulpParam, removeGulpParam } from '@mikezimm/fps-library-v2/lib/components/atoms/Links/GulpLinks';
import { gulpParam1, ProcessingRunIcon } from './Row';

export interface IAnalyticsLinkIcon {
  linkUrl: string;
  iconName: string;
}

export type IAnalyticsLinkIconPriority = 'PageURL' | 'PageLink' | 'SiteLink';

export function getBestAnalyticsLinkAndIcon(item: IZFetchedAnalytics, gulpMe: boolean, priority: IAnalyticsLinkIconPriority[]): IAnalyticsLinkIcon {

  const result: IAnalyticsLinkIcon = {
    linkUrl: '',
    iconName: '',
  };

  priority.map((col: IAnalyticsLinkIconPriority) => {
    if (col === 'PageURL' && item.PageURL) {
      result.linkUrl = gulpMe === true ? `${item.PageURL}?${gulpParam1}` : item.PageURL;
      result.iconName = gulpMe === true ? ProcessingRunIcon : 'Page';

    } else if (col === 'PageLink' && item.PageLink) {
      result.linkUrl = gulpMe === true ? addGulpParam(item.PageLink.Url) : removeGulpParam(item.PageLink.Url);
      result.iconName = gulpMe === true ? ProcessingRunIcon : 'Page';

    } else if (col === 'SiteLink' && item.SiteLink) {
      result.linkUrl = gulpMe === true ? `${item.SiteLink.Url}?${gulpParam1}` : item.SiteLink.Url;
      result.iconName = gulpMe === true ? ProcessingRunIcon : 'SharepointLogo';
    }
  });

  return result;

}
