var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");

var Constants = Marty.createConstants([
  'ANNOUNCEMENT_RECEIVE',
  'ANNOUNCEMENT_UPDATE',
  'ANNOUNCEMENT_CREATE',
  'ANNOUNCEMENT_DELETE'
  'REQUEST_FAILED',
  'LOGIN_REQUIRED'
]);

//////////////////////////////////////////////////////////////////
// Announcements API
//////////////////////////////////////////////////////////////////

class AnnouncementAPI extends Marty.HttpStateSource {
   getAnnouncements() {
        return this.get(Config.baseURL + '/announcements');
   }

	createAnnouncement(ann) {
		return this.request({
		'url': Config.baseURL + '/announcements',
		'method': 'POST',
		'body': ann
		});
	}

  updateAnnouncement(ann) {
    return this.request({
		'url': Config.baseURL + '/announcements/' + ann.announcement_id,
		'method': 'PUT',
		'body': ann
		});
  }

  deleteAnnouncement(ann_id) {
    return this.request({
		'url': Config.baseURL + '/announcements/' + ann_id,
		'method': 'DELETE'
		});
  }
}


//////////////////////////////////
// Queries
//////////////////////////////////

// UserQueries sends HTTP requests to the server and dispatches actions
// based on server response
class AnnouncementQueries extends Marty.Queries {
  getAnnouncements() {
    return this.app.AnnouncementAPI.getAnnouncements()
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(UserConstants.ANNOUNCEMENT_RECEIVE, res.body);
            break;
          case 401:
            this.dispatch(UserConstants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not get the current announcements").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(UserConstants.REQUEST_FAILED, err)
      });
  }

  createAnnouncement(ann) {
    return this.app.AnnouncementAPI.createAnnouncement(ann)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(UserConstants.ANNOUNCEMENT_CREATE, res.body);
            break;
          case 401:
            this.dispatch(UserConstants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not create announcement").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(UserConstants.REQUEST_FAILED, err)
      });
  }


  updateAccouncement(ann) {
    return this.app.AnnouncementAPI.updateAnnouncement(ann)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(UserConstants.ANNOUNCEMENT_UPDATE, res.body);
            break;
          case 401:
            this.dispatch(UserConstants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not update announcement").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(UserConstants.REQUEST_FAILED, err)
      });
  }

  deleteAnnouncement(ann_id) {
    return this.app.AnnouncementAPI.deleteAnnouncement(ann_id)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(UserConstants.ANNOUNCEMENT_DELETE, res.body);
            break;
          case 401:
            this.dispatch(UserConstants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not get list of all users").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(UserConstants.REQUEST_FAILED, err)
      });
  }

}



///////////////////////////////////
// Store
///////////////////////////////////
class AnnouncementStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      _handleReceive: Constants.ANNOUNCEMENT_RECEIVE,
      _handleCreate: Constants.ANNOUNCEMENT_CREATE,
	    _handleUpdate: Constants.ANNOUNCEMENT_UPDATE,
      _handleDelete: Constants.ANNOUNCEMENT_DELETE
    };
  }

  // Action Handlers
  _handleReceive(res) {
    if (res.qty === 0) {
      this.state['ann'] = [];
    } else {
      this.state['ann'] = res.announcements;
    }
    this.hasChanged();
  }

  _handleCreate(ann) {
    this.state['ann'] = this.state['ann'].concat(ann);
    this.hasChanged();
  }

  _handleUpdate(ann) {
  	this.state['ann'] = _.reject(this.state['ann'], (ann1) => { ann1.announcement_id === ann.announcement_id });
    this.state['ann'] = this.state['ann'].concat(ann);
  	this.hasChanged();
  }

  _handleDelete(ann) {
    this.state['ann'] = _.reject(this.state['ann'], (ann1) => {ann1.announcement_id === ann.announcement_id });
    this.hasChanged();
  }


  // Methods
  getAnnouncements() {
    return this.fetch({
      id: 'announcements',
      locally: function() {
        return this.state['ann'];
      },
      remotely: function() {
        return this.app.AnnouncementQueries.getAnnouncements();
      }
    });
  }
}

module.exports.AnnouncementStore = AnnouncementStore;
module.exports.AnnouncementQueries = AnnouncementQueries;
module.exports.AnnouncementAPI = AnnouncementAPI;
