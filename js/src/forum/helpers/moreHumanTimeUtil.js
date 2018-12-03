/**
 * Derived from `humanTime` in Flarum Core, the `moreHumanTimeUtil` utility converts
 * a date to a (more) localized and human-readable time-ago string.
 *
 * @param {Date} time
 * @return {String}
 */
export default function moreHumanTimeUtil(time) {
  let mo = moment(time);
  const now = moment();

  // To prevent showing things like "in a few seconds" due to small offsets
  // between client and server time, we always reset future dates to the
  // current time. This will result in "just now" being shown instead.
  if (mo.isAfter(now)) {
    mo = now;
  }

  const day = 864e5;
  const diff = mo.diff(moment());
  let ago = null;

  // If this date was more than a month ago, we'll show the name of the month
  // in the string. If it wasn't this year, we'll show the year as well.
  // Take Chinese dates into consideration.
  // Another option is https://stackoverflow.com/a/29641375
  if (diff < -30 * day) {
    const is_zh = (moment.locale().slice(0, 2) == 'zh');
    if (mo.year() === moment().year()) {
      ago = is_zh ? mo.format('MMMD日') : mo.format('D MMM');
    } else {
      ago = is_zh ? mo.format('YYYY年MMM'): mo.format('MMM \'YY');
    }
  } else {
    ago = mo.fromNow();
  }

  return ago;
};
