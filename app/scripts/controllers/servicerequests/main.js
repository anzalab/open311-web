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
    $rootScope, $scope, $state, ServiceRequest, Comment, Summary,
    jurisdictions, groups, services, statuses, priorities,
    party, assignee, summaries
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
    $scope.priorities = priorities.priorities;
    $scope.statuses = statuses.statuses;
    $scope.services = services.services;
    $scope.jurisdictions = jurisdictions.jurisdictions;
    $scope.assignees = assignee.parties;
    $scope.summaries = summaries;

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
        $scope.servicerequest.$update().then(function (response) {
          // $scope.servicerequest = response;
          $scope.select(response);
          $scope.updated = true;
          $rootScope.$broadcast('app:servicerequests:reload');
        });
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

        comment.$save().then(function (response) {
          $scope.select($scope.servicerequest);
          $scope.note = {};
          $scope.updated = true;
          $rootScope.$broadcast('app:servicerequests:reload');
        });

      }
    };

    $scope.changePriority = function (priority) {
      if (priority) {
        $scope.servicerequest.priority = priority;
      }
      $scope.servicerequest.$update().then(function (response) {
        // $scope.servicerequest = response;
        $scope.select(response);
        $scope.updated = true;
        $rootScope.$broadcast('app:servicerequests:reload');
      });
    };

    $scope.changeStatus = function (status) {
      if (status) {
        $scope.servicerequest.status = status;
      }
      $scope.servicerequest.$update().then(function (response) {
        // $scope.servicerequest = response;
        $scope.select(response);
        $scope.updated = true;
        $rootScope.$broadcast('app:servicerequests:reload');
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


    $scope.load = function (query) {
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

      query = _.merge({}, query);

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
