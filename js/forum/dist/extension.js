'use strict';

System.register('cosname/humantime/helpers/moreHumanTime', [], function (_export, _context) {
  "use strict";

  function moreHumanTime(time) {
    var m = moment(time);
    var now = moment();

    // To prevent showing things like "in a few seconds" due to small offsets
    // between client and server time, we always reset future dates to the
    // current time. This will result in "just now" being shown instead.
    if (m.isAfter(now)) {
      m = now;
    }

    var day = 864e5;
    var diff = m.diff(moment());
    var ago = null;

    // If this date was more than a month ago, we'll show the full date.
    // Another option is https://stackoverflow.com/a/29641375
    if (diff < -30 * day) {
      ago = m.format('LL');
    } else {
      ago = m.fromNow();
    }

    return ago;
  }
  _export('default', moreHumanTime);

  return {
    setters: [],
    execute: function () {
      ; /**
         * Derived from `humanTime` in Flarum Core, the `moreHumanTime` utility converts
         * a date to a (more) localized and human-readable time-ago string.
         *
         * @param {Date} time
         * @return {String}
         */
    }
  };
});;
'use strict';

System.register('cosname/humantime/main', ['flarum/extend', 'flarum/helpers/icon', 'flarum/components/UserCard', 'cosname/humantime/helpers/moreHumanTime'], function (_export, _context) {
  "use strict";

  var extend, icon, UserCard, moreHumanTime;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }, function (_flarumComponentsUserCard) {
      UserCard = _flarumComponentsUserCard.default;
    }, function (_cosnameHumantimeHelpersMoreHumanTime) {
      moreHumanTime = _cosnameHumantimeHelpersMoreHumanTime.default;
    }],
    execute: function () {
      /*
      * Copyright (c) 2017 Yixuan Qiu
      */
      app.initializers.add('cosname-humantime', function () {
        // Modify the 'joined' and 'lastSeen' items that represent the dates
        extend(UserCard.prototype, 'infoItems', function (items) {

          var user = this.props.user;
          var lastSeenTime = user.lastSeenTime();
          // Time joined
          if (items.has('joined')) {
            var txt = app.translator.trans('core.forum.user.joined_date_text', { ago: moreHumanTime(user.joinTime()) });
            items.replace('joined', txt);
          }
          // Time last seen
          if (lastSeenTime && items.has('lastSeen')) {
            var online = user.isOnline();
            items.replace('lastSeen', m(
              'span',
              { className: 'UserCard-lastSeen' + (online ? ' online' : '') },
              online ? [icon('circle'), ' ', app.translator.trans('core.forum.user.online_text')] : [icon('clock-o'), ' ', moreHumanTime(lastSeenTime)]
            ));
          }
        });
      });
    }
  };
});