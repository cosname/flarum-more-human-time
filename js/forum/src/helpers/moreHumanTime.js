/**
 * Derived from `humanTime` in Flarum Core, the `moreHumanTime` utility converts
 * a date to a (more) localized and human-readable time-ago string.
 *
 * @param {Date} time
 * @return {String}
 */
export default function moreHumanTime(time) {
  let m = moment(time);
  const now = moment();

  // To prevent showing things like "in a few seconds" due to small offsets
  // between client and server time, we always reset future dates to the
  // current time. This will result in "just now" being shown instead.
  if (m.isAfter(now)) {
    m = now;
  }

  const day = 864e5;
  const diff = m.diff(moment());
  let ago = null;

  // If this date was more than a month ago, we'll show the full date.
  // Another option is https://stackoverflow.com/a/29641375
  if (diff < -30 * day) {
    ago = m.format('LL');
  } else {
    ago = m.fromNow();
  }

  return ago;
};
