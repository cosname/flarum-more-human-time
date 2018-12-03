import moreHumanTimeUtil from './moreHumanTimeUtil';

/**
 * The `moreHumanTime` helper displays a time in a (more) human-friendly time-ago format
 * (e.g. '12 days ago'), wrapped in a <time> tag with other information about
 * the time.
 *
 * @param {Date} time
 * @return {Object}
 */
export default function moreHumanTime(time) {
  const mo = moment(time);

  const datetime = mo.format();
  const full = mo.format('LLLL');
  const ago = moreHumanTimeUtil(time);

  return <time pubdate datetime={datetime} title={full} data-humantime>{ago}</time>;
}
