'use strict';

/**
 * @ngdoc account
 * @name ng311.Account
 */
angular.module('ng311').factory('Account', function($http, $resource, Utils) {
  // account accessors resource
  var Account = $resource(
    Utils.asLink(['v1', 'accounts']),
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
   * Normalize accessor object by adding verified field
   *
   * @function
   * @name normalizeAccessors
   *
   * @param {Array} accessors
   * @returns {Object} normalized accessors list
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  function normalizeAccessors(accessors) {
    return _.map(accessors, function(accessor) {
      if (accessor.verifiedAt) {
        return _.merge({}, accessor, { verified: true });
      }

      return _.merge({}, accessor, { verified: false });
    });
  }

  /**
   * Normalize bill items structure
   *
   * @function
   * @name normalizeBillItems
   *
   * @param {Object[]} items
   * @returns {Object} normalized bill items
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  function normalizeBillItems(items) {
    return _.map(items, function(item) {
      var defaultItem = { name: '', quantity: '', unit: '', price: 0 };
      return _.merge({}, defaultItem, item);
    });
  }

  /**
   * Retrieve account details
   *
   * @param {String} accountNumber Account Number
   * @returns {Promise} Resolves to customer Account Object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  Account.getDetails = function(accountNumber) {
    return $http
      .get(Utils.asLink(['v1', 'accounts']), {
        params: {
          filter: {
            number: accountNumber,
          },
        },
      })
      .then(function(response) {
        var customerAccount = _.first(response.data.data);

        customerAccount.accessors = normalizeAccessors(
          customerAccount.accessors
        );

        customerAccount.bills = _.map(customerAccount.bills, function(bill) {
          bill.items = normalizeBillItems(bill.items);
          return bill;
        });

        // create full address field
        customerAccount.fullAddress =
          customerAccount.neighborhood + ' - ' + customerAccount.address;

        customerAccount.outstandingBalance =
          _.first(customerAccount.bills).balance.outstand || 0;

        return customerAccount;
      })
      .catch(function(/*error*/) {
        //TODO handle error
      });
  };

  /**
   * Add new accessor to the account
   *
   * @param {ObjectId} id account unique identifier
   * @param {Object} accessor new accessor to be added
   * @returns {Promise} Resolves to accessors list
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  Account.addAccessor = function(id, accessor) {
    var url = Utils.asLink(['v1', 'accounts', id, 'accessors']);
    return $http.post(url, accessor).then(function(response) {
      response.data.accessors = normalizeAccessors(response.data.accessors);
      return response.data;
    });
  };

  /**
   * Verify account accessor by adding verifiedAt timestamp
   *
   * @param {ObjectId} id account unique identifier
   * @param {String} phoneNumber
   * @returns {Promise} Resolves to accessors list
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  Account.verifyAccessor = function(id, phoneNumber) {
    var url = Utils.asLink(['v1', 'accounts', id, 'accessors', phoneNumber]);
    return $http.put(url, { verifiedAt: new Date() }).then(function(response) {
      response.data.accessors = normalizeAccessors(response.data.accessors);

      return response.data;
    });
  };

  /**
   * Update account accessor details
   *
   * @param {ObjectId} id account unique identifier
   * @param {String} phoneNumber
   * @param {Object} updates
   * @returns {Promise} Resolves to accessors list
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  Account.updateAccessor = function(id, phoneNumber, updates) {
    var url = Utils.asLink(['v1', 'accounts', id, 'accessors', phoneNumber]);

    return $http.put(url, updates).then(function(response) {
      response.data.accessors = normalizeAccessors(response.data.accessors);

      return response.data;
    });
  };

  /**
   * Delete  account accessor
   *
   * @param {ObjectId} id account unique identifier
   * @param {String} phoneNumber
   * @param {Object} updates
   * @returns {Promise} Resolves to accessors list
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  Account.deleteAccessor = function(id, phoneNumber) {
    var url = Utils.asLink(['v1', 'accounts', id, 'accessors', phoneNumber]);

    return $http.delete(url).then(function(response) {
      response.data.accessors = normalizeAccessors(response.data.accessors);

      return response.data;
    });
  };

  return Account;
});
