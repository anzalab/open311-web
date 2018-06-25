'use strict';

/**
 * @ngdoc service
 * @name ng311.ServiceRequest
 * @description
 * # ServiceRequest
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('ServiceRequest', function (
    $http, $resource, $filter, Utils, Mailto
  ) {

    //create servicerequest resource
    var ServiceRequest = $resource(Utils.asLink(['servicerequests', ':id']), {
      id: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
    });


    /**
     * @description find servicerequest with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    ServiceRequest.find = function (params) {
      return $http.get(Utils.asLink('servicerequests'), {
          params: params
        })
        .then(function (response) {

          //map plain servicerequest object to resource instances
          var servicerequests = response.data.servicerequests.map(
            function (servicerequest) {
              //create servicerequest as a resource instance
              return new ServiceRequest(servicerequest);
            });

          //return paginated response
          return {
            servicerequests: servicerequests,
            total: response.data.count,
            pages: response.data.pages
          };
        });
    };


    /**
     * @description patch service request with specific changes
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    ServiceRequest.changelog = function (id, changelog) {

      var url = Utils.asLink(['servicerequests', id, 'changelogs']);

      return $http.patch(url, changelog).then(function (response) {
        return new ServiceRequest(response.data);
      });

    };


    /**
     * @description convert a report to email
     * @param  {Object} report current report in the scope
     * @return {String} valid mailto string to bind into href
     */
    ServiceRequest.toEmail = function (issue) {
      /*jshint camelcase:false */

      //prepare complaint address
      var address = '';
      if (issue.reporter.account) {
        address = address + issue.reporter.account;
      }
      if (issue.address) {
        if (address) {
          address = address + '/' + issue.address;
        } else {
          address = address + issue.address;
        }
      }

      var time = 'N/A';
      var date = 'N/A';
      try {
        time = $filter('date')(issue.createdAt, 'hh:mm:ss a');
        date = $filter('date')(issue.createdAt, 'dd/MM/yyyy');
      } catch (error) {}

      //prepare e-mail body
      var body = [
        'Hello,',
        '\n\n',
        'Please assist in resolving customer complaint #',
        issue.code || 'N/A',
        '.',
        '\n\n',
        'Time: ',
        time || 'N/A',
        '\n',
        'Date: ',
        date || 'N/A',
        '\n',
        'Account Number/Location: ',
        address || 'N/A',
        '\n',
        'Area: ',
        (issue.jurisdiction || {}).name || 'N/A',
        '\n',
        'Customer Name: ',
        issue.reporter.name || 'N/A',
        '\n',
        'Phone No.: ',
        issue.reporter.phone || 'N/A',
        '\n',
        'Nature of Complaint: ',
        issue.service.name || 'N/A',
        '\n',
        'Complaint Details: ',
        issue.description || 'N/A',
        '\n\n',
        'Regards.'
      ].join('');

      //add internal notes
      var changelogs =
        _.orderBy([].concat(issue.changelogs), 'createdAt', 'desc');
      var notes = _.map(changelogs, function (changelog) {
        var note = [];

        //handle changelog
        if (changelog.comment) {
          note = note.concat([
            changelog.changer.name,
            ' on ',
            $filter('date')(changelog.createdAt,
              'dd MMM yyyy hh:mm:ss a'),
            ': ',
            'Write: ',
            changelog.comment,
          ].join(''));
        }

        //handle status
        if (changelog.status) {
          note = note.concat([
            changelog.changer.name,
            ' on ',
            $filter('date')(changelog.createdAt,
              'dd MMM yyyy hh:mm:ss a'),
            ': ',
            'Change status to ',
            changelog.status.name,
          ].join(''));
        }

        //handle priority
        if (changelog.priority) {
          note = note.concat([
            changelog.changer.name,
            ' on ',
            $filter('date')(changelog.createdAt,
              'dd MMM yyyy hh:mm:ss a'),
            ': ',
            'Change priority to ',
            changelog.priority.name,
          ].join(''));
        }

        //handle assignee
        if (changelog.assignee) {
          note = note.concat([
            changelog.changer.name,
            ' on ',
            $filter('date')(changelog.createdAt,
              'dd MMM yyyy hh:mm:ss a'),
            ': ',
            'Assignee to ',
            changelog.assignee.name,
          ].join(''));
        }

        //handle resolved
        if (changelog.resolvedAt) {
          note = note.concat([
            changelog.changer.name,
            ' on ',
            $filter('date')(changelog.createdAt,
              'dd MMM yyyy hh:mm:ss a'),
            ': ',
            'Change status to ',
            'Resolved',
          ].join(''));
        }

        //handle resolved
        if (changelog.reopenedAt) {
          note = note.concat([
            changelog.changer.name,
            ' on ',
            $filter('date')(changelog.createdAt,
              'dd MMM yyyy hh:mm:ss a'),
            ': ',
            'Change status to ',
            'Reopened',
          ].join(''));
        }

        note = _.filter(note, function (line) { return !_.isEmpty(line); });
        note = note.length > 0 ? note.join(',\n') : undefined;
        return note;

      });

      notes = _.compact(notes);

      body = body + '\n\n' + 'Change Logs: ' + '\n\n' + notes.join(',\n');

      //TODO add a link to actual problem

      //prepare e-mail send option
      var recipient = _.get(issue, 'jurisdiction.email', '');
      var options = {
        subject: [issue.service.name, issue.code].join(' - #'),
        body: body
      };
      /*jshint camelcase:true*/

      var href = Mailto.url(recipient, options);

      return href;
    };

    return ServiceRequest;

  });
