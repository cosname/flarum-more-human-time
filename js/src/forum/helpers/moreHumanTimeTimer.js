import moreHumanTimeUtil from './moreHumanTimeUtil';

function updateHumanTimes() {
  $('[data-humantime]').each(function() {
    const $this = $(this);
    const ago = moreHumanTimeUtil($this.attr('datetime'));

    $this.html(ago);
  });
}

/**
 * The `moreHumanTimeTimer` initializer sets up a loop every 10 second to update
 * timestamps rendered with the `moreHumanTimeUtil` helper.
 */
export default function moreHumanTimeTimer() {
  setInterval(updateHumanTimes, 10000);
}
