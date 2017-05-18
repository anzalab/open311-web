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
    $rootScope, $scope, $state, prompt, Party, ServiceRequest,
    Comment, Summary, endpoints, party
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

    //signal create mode
    $scope.create = false;

    //bind states
    $scope.priorities = endpoints.priorities.priorities;
    $scope.statuses = endpoints.statuses.statuses;
    $scope.services = endpoints.services.services;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
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
     * set current service request
     */
    $scope.select = function (servicerequest) {

      //sort comments in desc order
      if (servicerequest && servicerequest._id) {
        //update scope service request ref
        $scope.servicerequest = servicerequest;

        $scope.mailTo = ServiceRequest.toEmail(servicerequest);

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
          $scope.servicerequest.$update().then(function (response) {
            // $scope.servicerequest = response;
            $scope.select(response);
            $scope.updated = true;
            $rootScope.$broadcast('app:servicerequests:reload');
          });
        }
      }
    };

    /**
     * @description save created servicerequest
     */
    $scope.save = function () {

      $scope.create = false;
      $scope.updated = true;

      //set call end time
      if (!$scope.servicerequest._id) {
        $scope.servicerequest.call.endedAt = new Date();
      }

      $scope.servicerequest.$save().then(function (response) {

          response = response || {};

          $scope.select(response);

          response.message =
            response.message || 'Service Request Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('servicerequest:create:success', response);

          $rootScope.$broadcast('app:servicerequests:reload');

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
          $rootScope.$broadcast('servicerequest:create:error', error);
        });
    };

    /**
     * comment on the issues
     */
    $scope.comment = function () {

      //TODO notify about the comment saved
      if ($scope.note && $scope.note.content) {
        var comment = new Comment({
          request: $scope.servicerequest._id,
          commentator: party._id,
          content: $scope.note.content
        });

        //clear note
        $scope.note = {};

        comment.$save().then(function (response) {
          $scope.select($scope.servicerequest);
          $scope.note = {};
          $scope.updated = true;
          $rootScope.$broadcast('app:comments:reload');
        }).catch(function ( /*error*/ ) {
          //TODO signal error
          $scope.note = {};
        });

      }
    };

    $scope.changePriority = function (priority) {
      if (priority) {
        $scope.servicerequest.priority = priority;
      }

      if (!$scope.servicerequest.resolvedAt) {
        $scope.servicerequest.$update().then(function (response) {
          // $scope.servicerequest = response;
          $scope.select(response);
          $scope.updated = true;
          $rootScope.$broadcast('app:servicerequests:reload');
        });
      }
    };

    $scope.changeStatus = function (status) {
      if (status) {
        $scope.servicerequest.status = status;
      }

      if (!$scope.servicerequest.resolvedAt) {
        $scope.servicerequest.$update().then(function (response) {
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
          $scope.servicerequest.resolvedAt = new Date();
          $scope.servicerequest.$update().then(function (response) {
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
          $scope.servicerequest.resolvedAt = null;
          $scope.servicerequest.$update().then(function (response) {
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
        reporter: $scope.servicerequest.reporter
      });
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

          $rootScope.$broadcast('servicerequest:delete:success', response);

          $rootScope.$broadcast('app:servicerequests:reload');

        })
        .catch(function (error) {
          if (error) {
            $rootScope.$broadcast('appError', error);
            $rootScope.$broadcast('servicerequest:delete:error', error);

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
      if ($scope.search.party && $scope.search.party.length >= 2) {
        Party.find({
          query: {
            deletedAt: {
              $eq: null
            },
            'relation.name': 'Internal',
            'relation.type': 'Worker'
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
      }
      $scope.find(query);
    };

    $scope.loadComment = function (servicerequest) {
      if (servicerequest && servicerequest._id) {
        Comment.find({
          sort: {
            createdAt: -1
          },
          query: {
            request: servicerequest._id
          }
        }).then(function (response) {
          $scope.comments = response.comments;
        });
      }
    };


    /**
     * @description load servicerequests
     */
    $scope.find = function (query) {
      //start sho spinner
      $scope.spin = true;

      //track active ui based on query
      $scope.query = query;

      query = _.merge({}, { resolvedAt: null }, query);

      ServiceRequest.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          createdAt: -1
        },
        query: query,
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
        ($scope.servicerequests && $scope.total && $scope.total > $scope.limit);
      return willPaginate;
    };

    //export current filtered issues
    //TODO if no filter export all
    $scope.export = function () {
      var _exports =
        _.map($scope.servicerequests, function (servicerequest) {
          return {
            code: servicerequest.code,
            callStart: (servicerequest.call || {}).startedAt,
            callEnd: (servicerequest.call || {}).endedAt,
            reporterName: servicerequest.reporter.name,
            reporterPhone: servicerequest.reporter.phone,
            reporterAccount: servicerequest.reporter.account,
            operator: servicerequest.operator.name,
            area: servicerequest.jurisdiction.name,
            nature: servicerequest.service.name,
            assignee: (servicerequest.assignee || {}).name,
            description: servicerequest.description,
            address: servicerequest.address,
            status: servicerequest.status.name,
            priority: servicerequest.priority.name
          };
        });
      return _exports;
    };


    //pre load servicerequests on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:servicerequests:reload', function () {
      $scope.find();
    });

    //reload summaries
    $rootScope.$on('app:servicerequests:reload', function () {
      Summary.issues().then(function (summaries) {
        $scope.summaries = summaries;
      });
    });

  });
