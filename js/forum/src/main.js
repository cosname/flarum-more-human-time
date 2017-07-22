/*
* Copyright (c) 2017 Yixuan Qiu
*/
import { extend } from 'flarum/extend';
import icon from 'flarum/helpers/icon';
import UserCard from 'flarum/components/UserCard';
import moreHumanTime from 'cosname/humantime/helpers/moreHumanTime';

app.initializers.add('cosname-humantime', function() {
  // Modify the 'joined' and 'lastSeen' items that represent the dates
  extend(UserCard.prototype, 'infoItems', function(items) {

    const user = this.props.user;
    const lastSeenTime = user.lastSeenTime();
    // Time joined
    if (items.has('joined')) {
      const txt = app.translator.trans('core.forum.user.joined_date_text',
        {ago: moreHumanTime(user.joinTime())});
      items.replace('joined', txt);
    }
    // Time last seen
    if (lastSeenTime && items.has('lastSeen')) {
      const online = user.isOnline();
      items.replace('lastSeen', (
        <span className={'UserCard-lastSeen' + (online ? ' online' : '')}>
          {online
            ? [icon('circle'), ' ', app.translator.trans('core.forum.user.online_text')]
            : [icon('clock-o'), ' ', moreHumanTime(lastSeenTime)]}
        </span>
      ));
    }
  });

});
