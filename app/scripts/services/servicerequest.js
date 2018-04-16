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
      //TODO add internal notes & use template if possible
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


    /**
     * @description Lookup for customer account details
     * @param {String} account - Customer Account Number
     * @return {Object} valid customer account profile | empty object
     */
    ServiceRequest.lookupCustomer = function (account) {
      console.log(account);
      var url = 'http://localhost:5000/v1.0.0/accounts';

      return $http.get(url, {
        params: {
          filter: {
            number: account
          }
        }
      }).then(function (response) {
        var customerAccount = _.first(response.data.data);

        // create full address field
        customerAccount.fullAddress = customerAccount.neighborhood +
          ' - ' + customerAccount.address;

        customerAccount.outstandingBalance = _.first(customerAccount.bills)
          .balance.outstand || 0;

        return customerAccount;
      }).catch(function ( /*error*/ ) {
        //TODO handle error
      });
    };

    return ServiceRequest;

  });
