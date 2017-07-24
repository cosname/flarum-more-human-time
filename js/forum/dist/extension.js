'use strict';

System.register('cosname/humantime/helpers/moreHumanTime', ['cosname/humantime/helpers/moreHumanTimeUtil'], function (_export, _context) {
  "use strict";

  var moreHumanTimeUtil;
  function moreHumanTime(time) {
    var mo = moment(time);

    var datetime = mo.format();
    var full = mo.format('LLLL');
    var ago = moreHumanTimeUtil(time);

    return m(
      'time',
      { pubdate: true, datetime: datetime, title: full, 'data-humantime': true },
      ago
    );
  }

  _export('default', moreHumanTime);

  return {
    setters: [function (_cosnameHumantimeHelpersMoreHumanTimeUtil) {
      moreHumanTimeUtil = _cosnameHumantimeHelpersMoreHumanTimeUtil.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('cosname/humantime/helpers/moreHumanTimeUtil', [], function (_export, _context) {
  "use strict";

  function moreHumanTimeUtil(time) {
    var mo = moment(time);
    var now = moment();

    // To prevent showing things like "in a few seconds" due to small offsets
    // between client and server time, we always reset future dates to the
    // current time. This will result in "just now" being shown instead.
    if (mo.isAfter(now)) {
      mo = now;
    }

    var day = 864e5;
    var diff = mo.diff(moment());
    var ago = null;

    // If this date was more than a month ago, we'll show the name of the month
    // in the string. If it wasn't this year, we'll show the year as well.
    // Take Chinese dates into consideration.
    // Another option is https://stackoverflow.com/a/29641375
    if (diff < -30 * day) {
      var is_zh = moment.locale().slice(0, 2) == 'zh';
      if (mo.year() === moment().year()) {
        ago = is_zh ? mo.format('MMMD日') : mo.format('D MMM');
      } else {
        ago = is_zh ? mo.format('YYYY年MMM') : mo.format('MMM \'YY');
      }
    } else {
      ago = mo.fromNow();
    }

    return ago;
  }
  _export('default', moreHumanTimeUtil);

  return {
    setters: [],
    execute: function () {
      ; /**
         * Derived from `humanTime` in Flarum Core, the `moreHumanTimeUtil` utility converts
         * a date to a (more) localized and human-readable time-ago string.
         *
         * @param {Date} time
         * @return {String}
         */
    }
  };
});;
'use strict';

System.register('cosname/humantime/main', ['flarum/extend', 'flarum/helpers/icon', 'flarum/components/UserCard', 'flarum/components/TerminalPost', 'flarum/components/PostMeta', 'cosname/humantime/helpers/moreHumanTimeUtil', 'cosname/humantime/helpers/moreHumanTime', 'cosname/humantime/helpers/moreHumanTimeTimer'], function (_export, _context) {
  "use strict";

  var extend, icon, UserCard, TerminalPost, PostMeta, moreHumanTimeUtil, moreHumanTime, moreHumanTimeTimer;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }, function (_flarumComponentsUserCard) {
      UserCard = _flarumComponentsUserCard.default;
    }, function (_flarumComponentsTerminalPost) {
      TerminalPost = _flarumComponentsTerminalPost.default;
    }, function (_flarumComponentsPostMeta) {
      PostMeta = _flarumComponentsPostMeta.default;
    }, function (_cosnameHumantimeHelpersMoreHumanTimeUtil) {
      moreHumanTimeUtil = _cosnameHumantimeHelpersMoreHumanTimeUtil.default;
    }, function (_cosnameHumantimeHelpersMoreHumanTime) {
      moreHumanTime = _cosnameHumantimeHelpersMoreHumanTime.default;
    }, function (_cosnameHumantimeHelpersMoreHumanTimeTimer) {
      moreHumanTimeTimer = _cosnameHumantimeHelpersMoreHumanTimeTimer.default;
    }],
    execute: function () {

      // Replace the update timer
      /*
      * Copyright (c) 2017 Yixuan Qiu
      */
      if (app.initializers.has('humanTime')) {
        app.initializers.replace('humanTime', moreHumanTimeTimer);
      }

      app.initializers.add('cosname-humantime', function () {
        // Modify the format of 'joined' and 'lastSeen' dates for users
        extend(UserCard.prototype, 'infoItems', function (items) {

          var user = this.props.user;
          var lastSeenTime = user.lastSeenTime();
          // Time joined
          if (items.has('joined')) {
            var txt = app.translator.trans('core.forum.user.joined_date_text', { ago: moreHumanTimeUtil(user.joinTime()) });
            items.replace('joined', txt);
          }
          // Time last seen
          if (lastSeenTime && items.has('lastSeen')) {
            var online = user.isOnline();
            items.replace('lastSeen', m(
              'span',
              { className: 'UserCard-lastSeen' + (online ? ' online' : '') },
              online ? [icon('circle'), ' ', app.translator.trans('core.forum.user.online_text')] : [icon('clock-o'), ' ', moreHumanTimeUtil(lastSeenTime)]
            ));
          }
        });

        // Modify the dates in discussion list
        TerminalPost.prototype.view = function () {
          var discussion = this.props.discussion;
          var lastPost = this.props.lastPost && discussion.repliesCount();

          var user = discussion[lastPost ? 'lastUser' : 'startUser']();
          var time = discussion[lastPost ? 'lastTime' : 'startTime']();

          return m(
            'span',
            null,
            lastPost ? icon('reply') : '',
            ' ',
            app.translator.trans('core.forum.discussion_list.' + (lastPost ? 'replied' : 'started') + '_text', {
              user: user,
              ago: moreHumanTime(time)
            })
          );
        };

        // Modify the format of post dates
        extend(PostMeta.prototype, 'view', function (vdom) {

          if (vdom.children && vdom.children[0].attrs && vdom.children[0].attrs.className == 'Dropdown-toggle') {
            var post = this.props.post;
            var time = post.time();
            vdom.children[0].children[0] = moreHumanTime(time);
          }

          return vdom;
        });

        // TODO: DiscussionListItem, Notification, PostEdited
      });
    }
  };
});;
'use strict';

System.register('cosname/humantime/helpers/moreHumanTimeTimer', ['cosname/humantime/helpers/moreHumanTimeUtil'], function (_export, _context) {
  "use strict";

  var moreHumanTimeUtil;


  function updateHumanTimes() {
    $('[data-humantime]').each(function () {
      var $this = $(this);
      var ago = moreHumanTimeUtil($this.attr('datetime'));

      $this.html(ago);
    });
  }

  /**
   * The `moreHumanTimeTimer` initializer sets up a loop every 10 second to update
   * timestamps rendered with the `moreHumanTimeUtil` helper.
   */
  function moreHumanTimeTimer() {
    setInterval(updateHumanTimes, 10000);
  }

  _export('default', moreHumanTimeTimer);

  return {
    setters: [function (_cosnameHumantimeHelpersMoreHumanTimeUtil) {
      moreHumanTimeUtil = _cosnameHumantimeHelpersMoreHumanTimeUtil.default;
    }],
    execute: function () {}
  };
});