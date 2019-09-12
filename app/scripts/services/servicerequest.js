'use strict';

/**
 * @ngdoc service request
 * @name ng311.ServiceRequest
 * @description
 * # ServiceRequest
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('ServiceRequest', function(
    $http,
    $resource,
    $filter,
    Utils,
    Mailto,
    Upload
  ) {
    //create servicerequest resource
    var ServiceRequest = $resource(
      Utils.asLink(['servicerequests', ':id']),
      {
        id: '@_id',
      },
      {
        update: {
          method: 'PUT',
        },
      }
    );

    /**
     * @description find servicerequest with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    ServiceRequest.find = function(params) {
      return $http
        .get(Utils.asLink('servicerequests'), {
          params: params,
        })
        .then(function(response) {
          //map plain servicerequest object to resource instances
          var servicerequests = response.data.servicerequests.map(function(
            servicerequest
          ) {
            //create servicerequest as a resource instance
            return new ServiceRequest(servicerequest);
          });

          //return paginated response
          return {
            servicerequests: servicerequests,
            total: response.data.count,
            pages: response.data.pages,
          };
        });
    };

    /**
     * @description patch service request with specific changes
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    ServiceRequest.changelog = function(id, changelog) {
      var url = Utils.asLink(['servicerequests', id, 'changelogs']);

      return Upload.upload({
        url: url,
        data: changelog,
      }).then(function(response) {
        return new ServiceRequest(response.data);
      });
    };

    /**
     * @description convert a report to email
     * @param  {Object} report current report in the scope
     * @return {String} valid mailto string to bind into href
     */
    ServiceRequest.toEmail = function(issue, sender) {
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
        '\r\n\r\n',
        'Please assist in resolving customer complaint #',
        issue.code || 'N/A',
        '.',
        '\r\n\r\n',
        'Time: ',
        time || 'N/A',
        '\r\n',
        'Date: ',
        date || 'N/A',
        '\r\n',
        'Account Number/Location: ',
        address || 'N/A',
        '\r\n',
        'Area: ',
        (issue.jurisdiction || {}).name || 'N/A',
        '\r\n',
        'Customer Name: ',
        issue.reporter.name || 'N/A',
        '\r\n',
        'Phone No.: ',
        issue.reporter.phone || 'N/A',
        '\r\n',
        'Nature of Complaint: ',
        issue.service.name || 'N/A',
        '\r\n',
        'Complaint Details: ',
        issue.description || 'N/A',
        '\r\n\r\n',
        'Regards,',
        '\r\n',
        sender.name,
        '.',
      ].join('');

      //TODO add a link to actual problem

      //prepare e-mail send option
      var recipient = _.get(issue, 'jurisdiction.email', '');
      var options = {
        sender: sender.email,
        to: recipient,
        subject: [issue.service.name, issue.code].join(' - #'),
        body: body,
        type: 'EMAIL',
        bulk: issue._id,
      };
      /*jshint camelcase:true*/

      // var href = Mailto.url(recipient, options);

      return options;
    };

    return ServiceRequest;
  });
