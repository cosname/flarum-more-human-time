/*
* Copyright (c) 2017 Yixuan Qiu
*/
import { extend } from 'flarum/extend';
import UserCard from 'flarum/components/UserCard';
import moreHumanTime from 'cosname/humantime/helpers/moreHumanTime';

app.initializers.add('cosname-humantime', function() {
  // Modify the 'joined' item that represents the date
  extend(UserCard.prototype, 'infoItems', function(items) {
    if (items.has('joined')) {
      const user = this.props.user;
      console.log(user);
      const txt = app.translator.trans('core.forum.user.joined_date_text',
        {ago: moreHumanTime(user.joinTime())});
      items.replace('joined', txt);
    }
  });

});
