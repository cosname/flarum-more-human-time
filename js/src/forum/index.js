/*
* Copyright (c) 2017-2018 Yixuan Qiu
*/
import { extend } from 'flarum/extend';
import icon from 'flarum/helpers/icon';
import UserCard from 'flarum/components/UserCard';
import TerminalPost from 'flarum/components/TerminalPost';
import PostMeta from 'flarum/components/PostMeta';
import moreHumanTimeUtil from './helpers/moreHumanTimeUtil';
import moreHumanTime from './helpers/moreHumanTime';
import moreHumanTimeTimer from './helpers/moreHumanTimeTimer';

// Replace the update timer or create a new one
if (app.initializers.has('humanTime')) {
  app.initializers.replace('humanTime', moreHumanTimeTimer);
} else {
  app.initializers.add('humanTime', moreHumanTimeTimer);
}

app.initializers.add('cosname-humantime', function() {
  // Modify the format of 'joined' and 'lastSeen' dates for users
  extend(UserCard.prototype, 'infoItems', function(items) {

    const user = this.props.user;
    const lastSeenAt = user.lastSeenAt();
    // Time joined
    if (items.has('joined')) {
      const txt = app.translator.trans('core.forum.user.joined_date_text',
        {ago: moreHumanTimeUtil(user.joinTime())});
      items.replace('joined', txt);
    }
    // Time last seen
    if (lastSeenAt && items.has('lastSeen')) {
      const online = user.isOnline();
      items.replace('lastSeen', (
        <span className={'UserCard-lastSeen' + (online ? ' online' : '')}>
          {online
            ? [icon('fas fa-circle'), ' ', app.translator.trans('core.forum.user.online_text')]
            : [icon('far fa-clock'), ' ', moreHumanTimeUtil(lastSeenAt)]}
        </span>
      ));
    }

  });

  // Modify the dates in discussion list
  TerminalPost.prototype.view = function() {
    const discussion = this.props.discussion;
    const lastPost = this.props.lastPost && discussion.replyCount();

    const user = discussion[lastPost ? 'lastPostedUser' : 'user']();
    const time = discussion[lastPost ? 'lastPostedAt' : 'createdAt']();

    return (
      <span>
        {lastPost ? icon('fas fa-reply') : ''}{' '}
        {app.translator.trans('core.forum.discussion_list.' + (lastPost ? 'replied' : 'started') + '_text', {
          user,
          ago: moreHumanTime(time)
        })}
      </span>
    );
  };

  // Modify the format of post dates
  extend(PostMeta.prototype, 'view', function(vdom) {

    if (vdom.children && vdom.children[0].attrs && vdom.children[0].attrs.className == 'Dropdown-toggle') {
      const post = this.props.post;
      const time = post.createdAt();
      vdom.children[0].children[0] = moreHumanTime(time);
    }

    return vdom;
  });

  // TODO: DiscussionListItem, Notification, PostEdited

});
