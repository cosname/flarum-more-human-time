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

System.register('cosname/humantime/main', ['flarum/extend', 'flarum/components/UserCard', 'cosname/humantime/helpers/moreHumanTime'], function (_export, _context) {
  "use strict";

  var extend, UserCard, moreHumanTime;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsUserCard) {
      UserCard = _flarumComponentsUserCard.default;
    }, function (_cosnameHumantimeHelpersMoreHumanTime) {
      moreHumanTime = _cosnameHumantimeHelpersMoreHumanTime.default;
    }],
    execute: function () {

      app.initializers.add('cosname-humantime', function () {
        // Modify the 'joined' item that represents the date
        extend(UserCard.prototype, 'infoItems', function (items) {
          if (items.has('joined')) {
            var user = this.props.user;
            console.log(user);
            var txt = app.translator.trans('core.forum.user.joined_date_text', { ago: moreHumanTime(user.joinTime()) });
            items.replace('joined', txt);
          }
        });
      }); /*
          * Copyright (c) 2017 Yixuan Qiu
          */
    }
  };
});