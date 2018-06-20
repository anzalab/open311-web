'use strict';

/**
 * @ngdoc account
 * @name ng311.Account
 */
angular
  .module('ng311')
  .factory('Account', function ($http, $resource) {

    // var ACCOUNT_END_POINT = 'http://majifix-account.herokuapp/v1/accounts';
    var ACCOUNT_END_POINT = 'http://0.0.0.0:5000/v1/accounts/';

    // account accessors resource
    var Account = $resource(ACCOUNT_END_POINT, {
      id: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
      });


    /**
     * Shape accessor object by adding verified field
     * @param {Array} accessors
     */
    function normalizeAccessors(accessors) {
      return _.map(accessors, function (accessor) {
        if (accessor.verifiedAt) {
          return _.merge({}, accessor, { verified: true });
        }

        return _.merge({}, accessor, { verified: false });
      });
    }

    function normalizeBillItems(items) {
      return _.map(items, function (item) {
        var defaultItem = { name: '', quantity: '', unit: '', price: 0 };
        return _.merge({}, defaultItem, item);
      });
    }


    /**
     * Retrieve account details
     * @param {String} accountNumber Account Number
     */
    Account.getDetails = function (accountNumber) {
      return $http.get(ACCOUNT_END_POINT, {
        params: {
          filter: {
            number: accountNumber
          }
        }
      }).then(function (response) {
        var customerAccount = _.first(response.data.data);

        customerAccount.accessors = normalizeAccessors(customerAccount.accessors);

        customerAccount.bills = _.map(customerAccount.bills, function (bill) {
          bill.items = normalizeBillItems(bill.items);
          return bill;
        });

        // create full address field
        customerAccount.fullAddress = customerAccount.neighborhood +
          ' - ' + customerAccount.address;

        customerAccount.outstandingBalance = _.first(customerAccount.bills)
          .balance.outstand || 0;

        return customerAccount;
      }).catch(function ( /*error*/) {
        //TODO handle error
      });
    };


    /**
     * Add new accessor to the account
     * @param {ObjectId} id account unique identifier
     * @param {Object} accessor new accessor to be added
     */
    Account.addAccessor = function (id, accessor) {
      var url = 'http://0.0.0.0:5000/v1/accounts/' + id + '/accessors';
      return $http.post(url, accessor).then(function (response) {
        response.data.accessors = normalizeAccessors(response.data.accessors);

        return response.data;
      });
    };


    /**
     * Verify accessor by adding verifiedAt timestamp
     * @param {ObjectId} id account unique identifier
     * @param {String} phoneNumber
     */
    Account.verifyAccessor = function (id, phoneNumber) {
      var url = 'http://0.0.0.0:5000/v1/accounts/' + id + '/accessors/' + phoneNumber;

      return $http.put(url, { verifiedAt: new Date() })
        .then(function (response) {

          response.data.accessors = normalizeAccessors(response.data.accessors);

          return response.data;
        });
    };


    /**
     * Update accessor details
     * @param {ObjectId} id account unique identifier
     * @param {String} phoneNumber
     * @param {Object} updates
     */
    Account.updateAccessor = function (id, phoneNumber, updates) {
      var url = 'http://0.0.0.0:5000/v1/accounts/' + id + '/accessors/' + phoneNumber;

      return $http.put(url, updates)
        .then(function (response) {
          response.data.accessors = normalizeAccessors(response.data.accessors);

          return response.data;
        });
    };


    Account.deleteAccessor = function (id, phoneNumber) {
      var url = 'http://0.0.0.0:5000/v1/accounts/' + id + '/accessors/' + phoneNumber;

      return $http.delete(url)
        .then(function (response) {
          response.data.accessors = normalizeAccessors(response.data.accessors);

          return response.data;
        });
    };

    return Account;
  });
