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
  .controller('ServiceRequestMainCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $uibModal,
    prompt,
    leafletBoundsHelpers,
    Utils,
    Party,
    ServiceRequest,
    Comment,
    Summary,
    endpoints,
    party,
    items
  ) {
    //servicerequests in the scope
    $scope.spin = false;
    $scope.servicerequests = [];
    $scope.comments = [];
    $scope.worklogs = [];
    $scope.worklog = {};
    $scope.servicerequest = new ServiceRequest({
      call: {
        startedAt: new Date(),
      },
    });
    $scope.page = 1;
    $scope.limit = 10;
    $scope.total = 0;
    $scope.note = {};
    $scope.updated = false;
    $scope.dateFilters = {
      reportedAt: {
        from: moment()
          .utc()
          .startOf('date')
          .toDate(),
        to: moment()
          .utc()
          .startOf('date')
          .toDate(),
      },
      resolvedAt: {
        from: moment()
          .utc()
          .startOf('date')
          .toDate(),
        to: moment()
          .utc()
          .startOf('date')
          .toDate(),
      },
    };

    $scope.search = {};
    $scope.map = {};
    $scope.assignees = [];
    $scope.isOperatorFilter = true;

    //signal create mode
    $scope.create = false;

    //track current misc filter(all, inbox, unattended, unresolved, resolved)
    $scope.misc = 'inbox';

    //bind states
    $scope.priorities = endpoints.priorities.priorities;
    $scope.statuses = endpoints.statuses.statuses;
    $scope.services = endpoints.services.services;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.items = items.items;
    $scope.party = party;
    // $scope.assignees = assignee.parties;
    $scope.summaries = endpoints.summaries;

    //listen for create event
    $rootScope.$on('servicerequest:create', function() {
      $scope.servicerequest = new ServiceRequest({
        call: {
          startedAt: new Date(),
        },
      });
      $scope.create = true;
    });

    $rootScope.$on('servicerequest:list', function() {
      $scope.find();
      $scope.create = false;
    });

    /**
     * listen for received call picked events and filter
     * issue list based on reporter details(i.e phone number)
     */
    var callPickedDeregister = $rootScope.$on('call picked', function(
      event,
      data
    ) {
      if (data && data.phone) {
        $scope.filterByReporter(data.phone, {
          'reporter.phone': data.phone,
        });
      }
    });
    $scope.$on('$destroy', callPickedDeregister);

    /**
     * set current service request
     */
    $scope.select = function(servicerequest) {
      //clear note
      $scope.note = {};

      //clear comments
      $scope.comments = [];

      // clear worklog
      $scope.worklog = {};

      // clear worklogs
      $scope.worklogs = [];

      //sort comments in desc order
      if (servicerequest && servicerequest._id) {
        //update scope service request ref
        $scope.servicerequest = servicerequest;

        $scope.mailTo = ServiceRequest.toEmail(servicerequest);

        //update markers & map center
        if (servicerequest.location && servicerequest.location.coordinates) {
          // obtain longitude and latitude
          var longitude = servicerequest.location.coordinates[0];
          var latitude = servicerequest.location.coordinates[1];

          //prepare bounds
          var bounds = leafletBoundsHelpers.createBoundsFromArray([
            [latitude + 0.029, longitude],
            [latitude - 0.029, longitude],
          ]);

          //set marker point
          $scope.map = {
            bounds: bounds,
            markers: {
              servicerequest: {
                lat: latitude,
                lng: longitude,
                focus: true,
                draggable: false,
              },
            },
            center: {
              lat: latitude,
              lng: longitude,
              zoom: 1,
            },
            defaults: {
              scrollWheelZoom: false,
            },
          };
        }

        // load service request worklogs
        $scope.loadWorkLog(servicerequest);

        //load service request images
        $scope.loadImages(servicerequest);

        //load service request documents
        $scope.loadDocuments(servicerequest);

        //load service request comments
        $scope.loadComment(servicerequest);
      }

      $scope.create = false;
    };

    /**
     * cancel create operation
     */
    $scope.cancel = function() {
      // $scope.servicerequest = _.first($scope.servicerequests);
      $scope.select(_.first($scope.servicerequests));
      $scope.create = false;
    };

    /**
     * assign a person to work on the issue
     */
    $scope.assign = function(assignee) {
      if (assignee) {
        $scope.servicerequest.assignee = assignee._id;
        if (!$scope.servicerequest.resolvedAt) {
          var changelog = {
            //TODO flag internal or public
            changer: party._id,
            assignee: $scope.servicerequest.assignee,
            //TODO: set notify to true
          };

          //update changelog
          var _id = $scope.servicerequest._id;
          ServiceRequest.changelog(_id, changelog).then(function(response) {
            $scope.modal.close();
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
    $scope.comment = function() {
      //TODO notify about the comment saved
      if ($scope.note && $scope.note.content) {
        var changelog = {
          //TODO flag internal or public
          changer: party._id,
          comment: $scope.note.content,
        };

        //update changelog
        var _id = $scope.servicerequest._id;
        ServiceRequest.changelog(_id, changelog)
          .then(function(response) {
            //TODO notify success
            $scope.note = {};
            $scope.select(response);
            $scope.updated = true;
          })
          .catch(function(error) {
            //TODO notify error
            // console.log(error);
          });
      }
    };

    /**
     * attach image on issues
     */
    $scope.onImage = function(image) {
      if (image) {
        var changelog = {
          //TODO flag internal or public
          changer: party._id,
          image: image,
        };

        //update changelog
        var _id = $scope.servicerequest._id;
        ServiceRequest.changelog(_id, changelog)
          .then(function(response) {
            //TODO notify success
            $scope.note = {};
            $scope.select(response);
            $scope.updated = true;
          })
          .catch(function(error) {
            //TODO notify error
            // console.log(error);
          });
      }
    };

    /**
     * attach document on issues
     */
    $scope.onDocument = function(doc) {
      if (document) {
        var changelog = {
          //TODO flag internal or public
          changer: party._id,
          document: doc,
        };

        //update changelog
        var _id = $scope.servicerequest._id;
        ServiceRequest.changelog(_id, changelog)
          .then(function(response) {
            //TODO notify success
            $scope.note = {};
            $scope.select(response);
            $scope.updated = true;
          })
          .catch(function(error) {
            //TODO notify error
            // console.log(error);
          });
      }
    };

    /**
     * change issue priority
     */
    $scope.changePriority = function(priority) {
      if (priority._id === $scope.servicerequest.priority._id) {
        return;
      }

      if (priority) {
        $scope.servicerequest.priority = priority;
      }

      if (!$scope.servicerequest.resolvedAt) {
        var changelog = {
          //TODO flag internal or public
          changer: party._id,
          priority: $scope.servicerequest.priority,
        };
        var _id = $scope.servicerequest._id;

        ServiceRequest.changelog(_id, changelog).then(function(response) {
          // $scope.servicerequest = response;
          $scope.select(response);
          $scope.updated = true;
          $rootScope.$broadcast('app:servicerequests:reload');
        });
      }
    };

    /**
     * change issue status
     */
    $scope.changeStatus = function(status) {
      if (status._id === $scope.servicerequest.status._id) {
        return;
      }

      if (status) {
        $scope.servicerequest.status = status;
      }

      if (!$scope.servicerequest.resolvedAt) {
        var changelog = {
          //TODO flag internal or public
          changer: party._id,
          status: $scope.servicerequest.status,
        };
        var _id = $scope.servicerequest._id;

        ServiceRequest.changelog(_id, changelog).then(function(response) {
          // $scope.servicerequest = response;
          $scope.select(response);
          $scope.updated = true;
          $rootScope.$broadcast('app:servicerequests:reload');
        });
      }
    };

    /**
     * complete issue and signal work done
     */
    $scope.onComplete = function() {
      prompt({
        title: 'Complete Issue',
        message: 'Are you sure you want to mark this issue as completed?',
        buttons: [
          {
            label: 'Yes',
            primary: true,
          },
          {
            label: 'No',
            cancel: true,
          },
        ],
      })
        .then(function() {
          if (!$scope.servicerequest.completedAt) {
            var changelog = {
              //TODO flag internal or public
              changer: party._id,
              completedAt: new Date(),
            };

            //update changelog
            var _id = $scope.servicerequest._id;
            ServiceRequest.changelog(_id, changelog).then(function(response) {
              // $scope.servicerequest = response;
              $scope.select(response);
              $scope.updated = true;
              $rootScope.$broadcast('app:servicerequests:reload');

              response = response || {};

              response.message =
                response.message || 'Issue Marked As Completed';

              $rootScope.$broadcast('appSuccess', response);
            });
          }
        })
        .catch(function() {});
    };

    /**
     * attend issue and signal work in progress
     */
    $scope.onAttended = function() {
      prompt({
        title: 'Attend Issue',
        message: 'Are you sure you want to attend this issue?',
        buttons: [
          {
            label: 'Yes',
            primary: true,
          },
          {
            label: 'No',
            cancel: true,
          },
        ],
      })
        .then(function() {
          if (!$scope.servicerequest.attendedAt) {
            var changelog = {
              //TODO flag internal or public
              changer: party._id,
              attendedAt: new Date(),
            };

            //update changelog
            var _id = $scope.servicerequest._id;
            ServiceRequest.changelog(_id, changelog).then(function(response) {
              // $scope.servicerequest = response;
              $scope.select(response);
              $scope.updated = true;
              $rootScope.$broadcast('app:servicerequests:reload');

              response = response || {};

              response.message = response.message || 'Issue Marked As Attended';

              $rootScope.$broadcast('appSuccess', response);
            });
          }
        })
        .catch(function() {});
    };

    /**
     * verify issue and signal work done is ok
     */
    $scope.onVerify = function() {
      prompt({
        title: 'Verify Issue',
        message: 'Are you sure you want to mark this issue as verified?',
        buttons: [
          {
            label: 'Yes',
            primary: true,
          },
          {
            label: 'No',
            cancel: true,
          },
        ],
      })
        .then(function() {
          if (!$scope.servicerequest.vefifiedAt) {
            var changelog = {
              //TODO flag internal or public
              changer: party._id,
              verifiedAt: new Date(),
            };

            //update changelog
            var _id = $scope.servicerequest._id;
            ServiceRequest.changelog(_id, changelog).then(function(response) {
              // $scope.servicerequest = response;
              $scope.select(response);
              $scope.updated = true;
              $rootScope.$broadcast('app:servicerequests:reload');

              response = response || {};

              response.message = response.message || 'Issue Marked As Verified';

              $rootScope.$broadcast('appSuccess', response);
            });
          }
        })
        .catch(function() {});
    };

    /**
     * approve issue and signal work done final
     */
    $scope.onApprove = function() {
      prompt({
        title: 'Approve Issue',
        message: 'Are you sure you want to mark this issue as approved?',
        buttons: [
          {
            label: 'Yes',
            primary: true,
          },
          {
            label: 'No',
            cancel: true,
          },
        ],
      })
        .then(function() {
          if (!$scope.servicerequest.vefifiedAt) {
            var changelog = {
              //TODO flag internal or public
              changer: party._id,
              approvedAt: new Date(),
            };

            //update changelog
            var _id = $scope.servicerequest._id;
            ServiceRequest.changelog(_id, changelog).then(function(response) {
              // $scope.servicerequest = response;
              $scope.select(response);
              $scope.updated = true;
              $rootScope.$broadcast('app:servicerequests:reload');

              response = response || {};

              response.message = response.message || 'Issue Marked As Approved';

              $rootScope.$broadcast('appSuccess', response);
            });
          }
        })
        .catch(function() {});
    };

    /**
     * close and resolve issue
     */
    $scope.onResolve = function() {
      prompt({
        title: 'Resolve Issue',
        message: 'Are you sure you want to mark this issue as resolved?',
        buttons: [
          {
            label: 'Yes',
            primary: true,
          },
          {
            label: 'No',
            cancel: true,
          },
        ],
      })
        .then(function() {
          if (!$scope.servicerequest.resolvedAt) {
            var changelog = {
              //TODO flag internal or public
              changer: party._id,
              resolvedAt: new Date(),
            };

            //update changelog
            var _id = $scope.servicerequest._id;
            ServiceRequest.changelog(_id, changelog).then(function(response) {
              // $scope.servicerequest = response;
              $scope.select(response);
              $scope.updated = true;
              $rootScope.$broadcast('app:servicerequests:reload');

              response = response || {};

              response.message = response.message || 'Issue Marked As Resolved';

              $rootScope.$broadcast('appSuccess', response);
            });
          }
        })
        .catch(function() {});
    };

    /**
     * re-open close issue
     */
    $scope.onReOpen = function() {
      prompt({
        title: 'Re-Open Issue',
        message: 'Are you sure you want to re-open this issue?',
        buttons: [
          {
            label: 'Yes',
            primary: true,
          },
          {
            label: 'No',
            cancel: true,
          },
        ],
      })
        .then(function() {
          if ($scope.servicerequest.resolvedAt) {
            var changelog = {
              //TODO flag internal or public
              changer: party._id,
              resolvedAt: null,
            };

            //update changelog
            var _id = $scope.servicerequest._id;
            ServiceRequest.changelog(_id, changelog).then(function(response) {
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
        })
        .catch(function() {});
    };

    /**
     * Initialize new issue creation with reporter details
     */
    $scope.onCopy = function() {
      $state.go('app.create_servicerequests', {
        reporter: $scope.servicerequest.reporter,
        jurisdiction: $scope.servicerequest.jurisdiction,
      });
    };

    /**
     * Initialize new issue attending with operator details
     */
    $scope.onAttend = function() {
      //prevent attachments and changelogs on attending
      var servicerequest = _.omit($scope.servicerequest, [
        'attachments',
        'changelogs',
      ]);
      $state.go('app.create_servicerequests', servicerequest);
    };

    /**
     * @description delete servicerequest
     */
    $scope.delete = function(servicerequest) {
      servicerequest
        .$delete()
        .then(function(response) {
          response = response || {};

          response.message = response.message || 'Issue Deleted Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('servicerequest:delete:success', response);

          $rootScope.$broadcast('app:servicerequests:reload');
        })
        .catch(function(error) {
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
    $scope.onSearch = function() {
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
    $scope.filterByReporter = function(q, query) {
      $scope.search.q = q;
      $scope.load(query, true);
    };

    /**
     * search assignees
     * @return {[type]} [description]
     */
    $scope.onSearchAssignees = function() {
      //TODO allow party where jurisdiction = null
      if ($scope.search.party && $scope.search.party.length >= 2) {
        Party.find({
          filter: {
            deletedAt: {
              $eq: null,
            },
          },
          q: $scope.search.party,
        })
          .then(function(response) {
            $scope.assignees = response.parties;
          })
          .catch(function(/*error*/) {
            $scope.assignees = [];
          });
      }
    };

    $scope.load = function(query, skipClearSearch) {
      if (!skipClearSearch) {
        $scope.search = {};
        $scope.q = undefined;
      }
      $scope.find(query);
    };

    $scope.loadComment = function(servicerequest) {
      var changelogs = [].concat(servicerequest.changelogs);
      var comments = _.orderBy(changelogs, 'createdAt', 'desc');
      comments = _.map(comments, function(comment) {
        comment.color = undefined;
        comment.color = comment.status ? comment.status.color : comment.color;
        comment.color = comment.priority
          ? comment.priority.color
          : comment.color;
        comment.color = comment.reopenedAt ? '#F44336' : comment.color;
        comment.color = comment.resolvedAt ? '#4CAF50' : comment.color;
        comment.color = comment.attendedAt ? '#F9A825' : comment.color;
        comment.color = comment.completedAt ? '#0D47A3' : comment.color;
        comment.color = comment.verifiedAt ? '#EF6C01' : comment.color;
        comment.color = comment.approvedAt ? '#1B5E1F' : comment.color;
        if (comment.item) {
          comment.item = _.merge({}, comment.item, {
            properties: { unit: 'PCS' }, // TODO: fix unit not found
          });
        }
        if (comment.image) {
          if (!_.startsWith(comment.image.stream, 'http')) {
            comment.image.stream = Utils.asLink(['v1', comment.image.stream]);
          }
        }

        if (comment.document) {
          if (!_.startsWith(comment.document.download, 'http')) {
            comment.document.download = Utils.asLink([
              'v1',
              comment.document.download,
            ]);
          }
        }
        return comment;
      });
      $scope.comments = comments;
    };

    /**
     * @description prepare worklog of specified service request
     */
    $scope.loadWorkLog = function(servicerequest) {
      // filter only with item
      var changelogs = [].concat(servicerequest.changelogs);
      var worklogs = _.filter(changelogs, function(changelog) {
        return !_.isEmpty(changelog.item);
      });

      // sort by latest dates
      worklogs = _.orderBy(worklogs, 'createdAt', 'desc');

      // ensure unit
      worklogs = _.map(worklogs, function(worklog) {
        worklog = _.merge({}, worklog, {
          item: { properties: { unit: 'PCS' } }, // TODO: fix unit not found
        });
        return worklog;
      });

      // return work logs
      $scope.worklogs = worklogs;
    };

    /**
     * @description prepare images of specified service request
     */
    $scope.loadImages = function(servicerequest) {
      // filter only with image
      var changelogs = [].concat(servicerequest.changelogs);
      var worklogs = _.filter(changelogs, function(changelog) {
        return !_.isEmpty(changelog.image);
      });

      // sort by latest dates
      worklogs = _.orderBy(worklogs, 'createdAt', 'desc');

      // map to images
      var images = _.compact(_.map(worklogs, 'image'));

      // merge original service request image
      images = _.uniqBy([].concat(servicerequest.image).concat(images), '_id');
      images = _.compact(images);

      // format for gallery view
      images = _.map(images, function(image) {
        var thumb = image.stream;
        if (!_.startsWith(image.stream, 'http')) {
          thumb = Utils.asLink(['v1', image.stream]);
        }
        return {
          thumb: thumb,
          description: image.filename,
        };
      });

      // compact images
      images = _.compact(images);

      // update gallery attachments
      return ($scope.images = images);
    };

    /**
     * @description prepare documents of specified service request
     */
    $scope.loadDocuments = function(servicerequest) {
      // filter only with document
      var changelogs = [].concat(servicerequest.changelogs);
      var worklogs = _.filter(changelogs, function(changelog) {
        return !_.isEmpty(changelog.document);
      });

      // sort by latest dates
      worklogs = _.orderBy(worklogs, 'createdAt', 'desc');

      // map to documents
      var documents = _.compact(_.map(worklogs, 'document'));

      // merge original service request document
      documents = _.uniqBy(
        [].concat(servicerequest.document).concat(documents),
        '_id'
      );
      documents = _.compact(documents);

      // format for gallery view
      documents = _.map(documents, function(doc) {
        doc.type = _.toUpper(_.last(_.split(doc.filename, '.')));
        // doc.size = doc.length * 0.001;
        if (!_.startsWith(doc.stream, 'http')) {
          doc.stream = Utils.asLink(['v1', doc.stream]);
        }
        if (!_.startsWith(doc.download, 'http')) {
          doc.download = Utils.asLink(['v1', doc.download]);
        }
        return doc;
      });

      // compact documents
      documents = _.compact(documents);

      // update gallery attachments
      $scope.documents = documents;
    };

    /**
     * Load all service request based on current filters
     * @return {[type]} [description]
     */
    $scope.all = function() {
      $scope.page = 1;
      $scope.limit = $scope.total;
      $scope.find();
    };

    /**
     * @description load servicerequests
     */
    $scope.find = function(query) {
      //ensure query
      var isSearchable = $scope.search.q && $scope.search.q.length >= 2;
      var extras = isSearchable ? $scope.query : {};
      query = _.merge({}, { misc: $scope.misc }, extras, query);

      //ensure operator _id
      if (query.operator) {
        query.operator = _.get(query, 'operator._id', query.operator);
      }

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

      // rebind search
      if (isSearchable) {
        $scope.q = $scope.search.q;
      }

      ServiceRequest.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          updatedAt: -1,
        },
        filter: $scope.query,
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with servicerequests when done loading
          $scope.servicerequests = response.servicerequests;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.servicerequests));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether servicerequests will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.servicerequests && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //export current filtered issues
    $scope.export = function() {
      var _exports = _.map($scope.servicerequests, function(servicerequest) {
        return {
          code: servicerequest.code,
          reportedAt: servicerequest.createdAt,
          callStart: (servicerequest.call || {}).startedAt,
          callEnd: (servicerequest.call || {}).endedAt,
          callDurationMinutes: ((servicerequest.call || {}).duration || {})
            .minutes,
          callDurationSeconds: ((servicerequest.call || {}).duration || {})
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
          ttrSeconds: (servicerequest.ttr || {}).seconds,
        };
      });
      return _exports;
    };

    $scope.isEmpty = function(value) {
      return _.isEmpty(value);
    };

    /**
     * @function
     * @name showResolvedAtFilter
     * @description Open modal window to show resolved at date filter
     */
    $scope.showResolvedAtFilter = function() {
      $scope.modal = $uibModal.open({
        templateUrl: 'views/servicerequests/_partials/resolve_time_filter.html',
        scope: $scope,
        size: 'lg',
      });

      $scope.modal.result.then(
        function onClose() {},
        function onDismissed() {}
      );
    };

    /**
     * @function
     * @name showReportedAtFilter
     * @description Open modal window to show reported at date filter
     */
    $scope.showReportedAtFilter = function() {
      $scope.modal = $uibModal.open({
        templateUrl:
          'views/servicerequests/_partials/reported_time_filter.html',
        scope: $scope,
        size: 'lg',
      });

      $scope.modal.result.then(
        function onClose() {},
        function onDismissed() {}
      );
    };

    /**
     * @function
     * @name showOperatorFilter
     * @description Open modal window for selecting operator for filtering
     * workspace
     */
    $scope.showOperatorFilter = function() {
      $scope.isOperatorFilter = true;
      $scope.modal = $uibModal.open({
        templateUrl: 'views/servicerequests/_partials/operator_filter.html',
        scope: $scope,
        size: 'lg',
      });

      $scope.modal.result.then(
        function onClose() {},
        function onDismissed() {}
      );
    };

    /**
     * @function
     * @name showAssigneeFilter
     * @description Open modal window for selecting assignee for filtering
     * workspace
     */
    $scope.showAssigneeFilter = function() {
      $scope.isOperatorFilter = false;
      $scope.modal = $uibModal.open({
        templateUrl: 'views/servicerequests/_partials/operator_filter.html',
        scope: $scope,
        size: 'lg',
      });

      $scope.modal.result.then(
        function onClose() {},
        function onDismissed() {}
      );
    };

    /**
     * @function
     * @name showAssigneeFilter
     * @description Open modal window for selecting assignee for filtering
     * workspace
     */
    $scope.showAssigneeModal = function() {
      if (!$scope.servicerequest.resolvedAt) {
        $scope.modal = $uibModal.open({
          templateUrl: 'views/servicerequests/_partials/assignee_modal.html',
          scope: $scope,
          size: 'lg',
        });

        $scope.modal.result.then(
          function onClose() {},
          function onDismissed() {}
        );
      }
    };

    /**
     * @function
     * @name filterByWorker
     * @description Filter Workspace service request by worker either
     * assignee or operator
     */
    $scope.filterByWorker = function(party) {
      if ($scope.isOperatorFilter) {
        $scope.operator = party;
      } else {
        $scope.assignee = party;
      }

      $scope.modal.close();
      // reset flag back to it's initial value
      $scope.isOperatorFilter = true;
    };

    /**
     * @description Present worklog modal
     */
    $scope.showWorklogModal = function() {
      //open worklog modal
      $scope.modal = $uibModal.open({
        templateUrl: 'views/servicerequests/_partials/worklog_modal.html',
        scope: $scope,
        size: 'lg',
      });

      //handle modal close and dismissed
      $scope.modal.result.then(
        function onClose(/*selectedItem*/) {},
        function onDismissed() {}
      );
    };

    $scope.onWorklog = function() {
      //ensure service request
      if ($scope.servicerequest && !$scope.servicerequest.resolvedAt) {
        var changelog = {
          item: $scope.worklog.item,
          quantity: $scope.worklog.quantity,
          comment: $scope.worklog.comment,
        };

        //update changelog
        if (changelog.item && changelog.quantity > 0) {
          var _id = $scope.servicerequest._id;
          ServiceRequest.changelog(_id, changelog).then(function(response) {
            $scope.modal.close();
            // $scope.servicerequest = response;
            $scope.select(response);
            $scope.updated = true;
            $rootScope.$broadcast('app:servicerequests:reload');
          });
        } else {
          $scope.modal.close();
        }
      }
    };

    //pre load un resolved servicerequests on state activation
    $scope.find({
      $or: [{ operator: party._id }, { assignee: party._id }],
      resolvedAt: { $eq: null },
      resetPage: true,
      reset: true,
      misc: 'inbox',
    });

    //listen for events
    $rootScope.$on('app:servicerequests:reload', function() {
      //re-load current operator service requests(inbox)
      $scope.find({
        $or: [{ operator: party._id }, { assignee: party._id }],
        resolvedAt: { $eq: null },
        resetPage: true,
        reset: true,
        misc: 'inbox',
      });
    });

    //reload summaries
    $rootScope.$on('app:servicerequests:reload', function() {
      //TODO pass params based on filter
      Summary.issues().then(function(summaries) {
        $scope.summaries = summaries;
      });
    });
  });
