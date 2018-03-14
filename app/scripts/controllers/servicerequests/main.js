'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceRequestMainCtrl
 * @description
 * # ServiceRequestMainCtrl
 * ServiceRequest main controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceRequestMainCtrl', function (
    $rootScope, $scope, $state, $stateParams, prompt, leafletBoundsHelpers,
    Party, ServiceRequest, Comment, Summary, endpoints, party
  ) {

    //servicerequests in the scope
    $scope.spin = false;
    $scope.servicerequests = [];
    $scope.comments = [];
    $scope.servicerequest = new ServiceRequest({
      call: {
        startedAt: new Date()
      }
    });
    $scope.page = 1;
    $scope.limit = 10;
    $scope.total = 0;
    $scope.note = {};
    $scope.updated = false;

    $scope.search = {};
    $scope.map = {};

    //signal create mode
    $scope.create = false;

    //track current misc fillter(all, inbox, unattended, unresolved, resolved)
    $scope.misc = 'inbox';

    //bind states
    $scope.priorities = endpoints.priorities.priorities;
    $scope.statuses = endpoints.statuses.statuses;
    $scope.services = endpoints.services.services;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.party = party;
    // $scope.assignees = assignee.parties;
    $scope.summaries = endpoints.summaries;


    //listen for create event
    $rootScope.$on('servicerequest:create', function () {
      $scope.servicerequest = new ServiceRequest({
        call: {
          startedAt: new Date()
        }
      });
      $scope.create = true;
    });

    $rootScope.$on('servicerequest:list', function () {
      $scope.find();
      $scope.create = false;
    });

    /**
     * listen for received call picked events and filter
     * issue list based on reporter details(i.e phone number)
     */
    var callPickedDeregister = $rootScope.$on('call picked', function (event,
      data) {

      if (data && data.phone) {
        $scope.filterByReporter(data.phone, {
          'reporter.phone': data.phone
        });
      }

    });
    $scope.$on('$destroy', callPickedDeregister);


    /**
     * set current service request
     */
    $scope.select = function (servicerequest) {

      //clear note
      $scope.note = {};

      //sort comments in desc order
      if (servicerequest && servicerequest._id) {
        //update scope service request ref
        $scope.servicerequest = servicerequest;

        $scope.mailTo = ServiceRequest.toEmail(servicerequest);

        //update markers & map center
        if (servicerequest.longitude && servicerequest.latitude) {

          //prepare bounds
          var bounds = leafletBoundsHelpers.createBoundsFromArray([
            [servicerequest.latitude + 0.029, servicerequest.longitude],
            [servicerequest.latitude - 0.029, servicerequest.longitude]
          ]);


          //set marker point
          $scope.map = {
            bounds: bounds,
            markers: {
              servicerequest: {
                lat: servicerequest.latitude,
                lng: servicerequest.longitude,
                focus: true,
                draggable: false
              }
            },
            center: {
              lat: servicerequest.latitude,
              lng: servicerequest.longitude,
              zoom: 1
            }
          };


        }

        //ensure attachements has correct data for displaying
        var hasAttachments = (servicerequest && servicerequest.attachments &&
          servicerequest.attachments.length > 0);
        if (hasAttachments) {
          servicerequest.attachments =
            _.map(servicerequest.attachments, function (attachment) {


              //obtain media thumb url from base64 encoded image
              if (!_.isEmpty(attachment.content)) {
                if (!_.startsWith(attachment.content, 'data:')) {
                  attachment.thumb = ['data:', attachment.mime,
                    ';base64,',
                    attachment.content
                  ].join('');
                } else {
                  attachment.thumb = attachment.content;
                }
              }

              //obtain media thumb from url
              if (!_.isEmpty(attachment.url) && _.startsWith(attachment.url,
                  'http')) {
                attachment.thumb = attachment.url;
              }

              attachment.description = attachment.caption;

              return attachment;

            });
        }

        //load service request comments
        $scope.loadComment(servicerequest);

      }

      $scope.create = false;

    };

    /**
     * cancel create operation
     */
    $scope.cancel = function () {
      // $scope.servicerequest = _.first($scope.servicerequests);
      $scope.select(_.first($scope.servicerequests));
      $scope.create = false;
    };

    /**
     * assign a person to work on the issue
     */
    $scope.assign = function (assignee) {
      if (assignee) {
        $scope.servicerequest.assignee = assignee._id;
        if (!$scope.servicerequest.resolvedAt) {

          var changelog = { //TODO flag internal or public
            changer: party._id,
            assignee: $scope.servicerequest.assignee
          };

          //update changelog
          var _id = $scope.servicerequest._id;
          ServiceRequest.changelog(_id, changelog).then(function (response) {
            // $scope.servicerequest = response;
            $scope.select(response);
            $scope.updated = true;
            $rootScope.$broadcast('app:servicerequests:reload');
          });
        }
      }
    };

    /**
     * comment on the issues
     */
    $scope.comment = function () {

      //TODO notify about the comment saved
      if ($scope.note && $scope.note.content) {

        var changelog = { //TODO flag internal or public
          changer: party._id,
          comment: $scope.note.content
        };

        //update changelog
        var _id = $scope.servicerequest._id;
        ServiceRequest.changelog(_id, changelog).then(function (response) {
          //TODO notify success
          $scope.note = {};
          $scope.select(response);
          $scope.updated = true;
        }).catch(function (error) {
          //TODO notify error
          console.log(error);
        });

      }
    };

    $scope.changePriority = function (priority) {

      if (priority._id === $scope.servicerequest.priority._id) {
        return;
      }

      if (priority) {
        $scope.servicerequest.priority = priority;
      }


      if (!$scope.servicerequest.resolvedAt) {

        var changelog = { //TODO flag internal or public
          changer: party._id,
          priority: $scope.servicerequest.priority
        };
        var _id = $scope.servicerequest._id;

        ServiceRequest.changelog(_id, changelog).then(function (response) {
          // $scope.servicerequest = response;
          $scope.select(response);
          $scope.updated = true;
          $rootScope.$broadcast('app:servicerequests:reload');
        });
      }

    };

    $scope.changeStatus = function (status) {

      if (status._id === $scope.servicerequest.status._id) {
        return;
      }

      if (status) {
        $scope.servicerequest.status = status;
      }

      if (!$scope.servicerequest.resolvedAt) {
        var changelog = { //TODO flag internal or public
          changer: party._id,
          status: $scope.servicerequest.status
        };
        var _id = $scope.servicerequest._id;

        ServiceRequest.changelog(_id, changelog).then(function (response) {
          // $scope.servicerequest = response;
          $scope.select(response);
          $scope.updated = true;
          $rootScope.$broadcast('app:servicerequests:reload');
        });
      }
    };

    /**
     * close and resolve issue
     */
    $scope.onClose = function () {
      prompt({
        title: 'Resolve Issue',
        message: 'Are you sure you want to mark this issue as resolved?',
        buttons: [{
          label: 'Yes',
          primary: true,
        }, {
          label: 'No',
          cancel: true
        }]
      }).then(function () {
        if (!$scope.servicerequest.resolvedAt) {

          var changelog = { //TODO flag internal or public
            changer: party._id,
            resolvedAt: new Date()
          };

          //update changelog
          var _id = $scope.servicerequest._id;
          ServiceRequest.changelog(_id, changelog).then(function (
            response) {
            // $scope.servicerequest = response;
            $scope.select(response);
            $scope.updated = true;
            $rootScope.$broadcast('app:servicerequests:reload');

            response = response || {};

            response.message =
              response.message || 'Issue Marked As Resolved';

            $rootScope.$broadcast('appSuccess', response);

          });
        }
      }).catch(function () {});
    };

    /**
     * re-open close issue
     */
    $scope.onReOpen = function () {
      prompt({
        title: 'Re-Open Issue',
        message: 'Are you sure you want to re-open this issue?',
        buttons: [{
          label: 'Yes',
          primary: true,
        }, {
          label: 'No',
          cancel: true
        }]
      }).then(function () {
        if ($scope.servicerequest.resolvedAt) {

          var changelog = { //TODO flag internal or public
            changer: party._id,
            resolvedAt: null
          };

          //update changelog
          var _id = $scope.servicerequest._id;
          ServiceRequest.changelog(_id, changelog).then(function (
            response) {
            // $scope.servicerequest = response;
            $scope.select(response);
            $scope.updated = true;
            $rootScope.$broadcast('app:servicerequests:reload');

            response = response || {};

            response.message =
              response.message || 'Issue Re-Open Successfully';

            $rootScope.$broadcast('appSuccess', response);

          });
        }
      }).catch(function () {});
    };


    /**
     * Initialize new issue creation with reporter details
     */
    $scope.onCopy = function () {
      $state.go('app.create_servicerequests', {
        reporter: $scope.servicerequest.reporter,
        jurisdiction: $scope.servicerequest.jurisdiction
      });
    };

    /**
     * Initialize new issue attending with operator details
     */
    $scope.onAttend = function () {
      //prevent attachements and changelogs on attending
      var servicerequest =
        _.omit($scope.servicerequest, ['attachments', 'changelogs']);
      $state.go('app.create_servicerequests', servicerequest);
    };

    /**
     * @description delete servicerequest
     */
    $scope.delete = function (servicerequest) {
      servicerequest
        .$delete()
        .then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Issue Deleted Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('servicerequest:delete:success',
            response);

          $rootScope.$broadcast('app:servicerequests:reload');

        })
        .catch(function (error) {
          if (error) {
            $rootScope.$broadcast('appError', error);
            $rootScope.$broadcast('servicerequest:delete:error',
              error);

          }
        });
    };


    /**
     * search servicerequests
     * @return {[type]} [description]
     */
    $scope.onSearch = function () {
      if ($scope.search.q && $scope.search.q.length >= 2) {
        $scope.q = $scope.search.q;
        $scope.find();
      } else {
        $scope.q = undefined;
        $scope.find();
      }
    };

    /**
     * filter issue by provided reporter details
     * @param  {[type]} query [description]
     * @return {[type]}       [description]
     */
    $scope.filterByReporter = function (q, query) {
      $scope.search.q = q;
      $scope.load(query, true);
    };

    /**
     * search assignes
     * @return {[type]} [description]
     */
    $scope.onSearchAssignees = function () {
      //TODO allow party where jurisdiction = null
      if ($scope.search.party && $scope.search.party.length >= 2) {
        Party.find({
          query: {
            deletedAt: {
              $eq: null
            }
          },
          q: $scope.search.party
        }).then(function (response) {
          $scope.assignees = response.parties;
        }).catch(function ( /*error*/ ) {
          $scope.assignees = [];
        });
      }
    };


    $scope.load = function (query, skipClearSearch) {
      if (!skipClearSearch) {
        $scope.search = {};
        $scope.q = undefined;
      }
      $scope.find(query);
    };

    $scope.loadComment = function (servicerequest) {
      $scope.comments =
        _.orderBy($scope.servicerequest.changelogs, 'createdAt', 'desc');
    };

    /**
     * Load all service request based on current filters
     * @return {[type]} [description]
     */
    $scope.all = function () {
      $scope.page = 1;
      $scope.limit = $scope.total;
      $scope.find();
    };

    /**
     * @description load servicerequests
     */
    $scope.find = function (query) {

      //ensure query
      var isSearchable = ($scope.search.q && $scope.search.q.length >= 2);
      var extras = isSearchable ? $scope.query : {};
      query = _.merge({}, { misc: $scope.misc }, extras, query);

      //start sho spinner
      $scope.spin = true;

      //activate all filter
      $scope.misc = query.misc;
      delete query.misc;

      //reset pagination
      if (query && query.resetPage) {
        $scope.page = 1;
        $scope.limit = 10;
        delete query.resetPage;
      }

      //track active ui based on query
      if (query.reset) {

        delete query.reset;

        $scope.query = query;

      } else {
        $scope.query = _.merge({}, $scope.query, query);
      }

      ServiceRequest.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          createdAt: -1
        },
        query: $scope.query,
        q: $scope.q
      }).then(function (response) {
        //update scope with servicerequests when done loading
        $scope.servicerequests = response.servicerequests;
        if ($scope.updated) {
          $scope.updated = false;
        } else {
          $scope.select(_.first($scope.servicerequests));
        }
        $scope.total = response.total;
        $scope.spin = false;
      }).catch(function (error) {
        $scope.spin = false;
      });
    };


    //check whether servicerequests will paginate
    $scope.willPaginate = function () {
      var willPaginate =
        ($scope.servicerequests && $scope.total && $scope.total >
          $scope.limit);
      return willPaginate;
    };

    //export current filtered issues
    $scope.export = function () {
      var _exports =
        _.map($scope.servicerequests, function (servicerequest) {
          return {
            code: servicerequest.code,
            reportedAt: servicerequest.createdAt,
            callStart: (servicerequest.call || {}).startedAt,
            callEnd: (servicerequest.call || {}).endedAt,
            callDurationMinutes: ((servicerequest.call || {}).duration ||
                {})
              .minutes,
            callDurationSeconds: ((servicerequest.call || {}).duration ||
                {})
              .seconds,
            reporterName: (servicerequest.reporter || {}).name,
            reporterPhone: (servicerequest.reporter || {}).phone,
            reporterAccount: (servicerequest.reporter || {}).account,
            operator: (servicerequest.operator || {}).name,
            area: (servicerequest.jurisdiction || {}).name,
            group: (servicerequest.group || {}).name,
            service: (servicerequest.service || {}).name,
            assignee: (servicerequest.assignee || {}).name,
            description: servicerequest.description,
            address: servicerequest.address,
            status: (servicerequest.status || {}).name,
            priority: (servicerequest.priority || {}).name,
            resolvedAt: servicerequest.resolvedAt,
            ttrDays: (servicerequest.ttr || {}).days,
            ttrHours: (servicerequest.ttr || {}).hours,
            ttrMinutes: (servicerequest.ttr || {}).minutes,
            ttrSeconds: (servicerequest.ttr || {}).seconds
          };
        });
      return _exports;
    };


    $scope.isEmpty = function (value) {
      return _.isEmpty(value);
    };


    //pre load un resolved servicerequests on state activation
    $scope.find({
      operator: party._id,
      resolvedAt: null,
      resetPage: true,
      reset: true,
      misc: $scope.misc
    });

    //listen for events
    $rootScope.$on('app:servicerequests:reload', function () {

      //re-load current operator service requests(inbox)
      $scope.find({
        $or: [{ operator: party._id }, { assignee: party._id }],
        resolvedAt: null,
        resetPage: true,
        reset: true,
        misc: $scope.misc
      });

    });

    //reload summaries
    $rootScope.$on('app:servicerequests:reload', function () {
      //TODO pass params based on fillter
      Summary.issues().then(function (summaries) {
        $scope.summaries = summaries;
      });
    });

  });
