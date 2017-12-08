'use strict';

(function () {
  function ngGallery($document, $timeout, $q, $templateCache) {

    var defaults = {
      baseClass: 'ng-gallery',
      thumbClass: 'ng-thumb',
      templateUrl: 'ng-gallery.html'
    };

    var keysCodes = {
      enter: 13,
      esc: 27,
      left: 37,
      right: 39
    };

    function setScopeValues(scope /*, attrs*/ ) {
      scope.baseClass = scope.class || defaults.baseClass;
      scope.thumbClass = scope.thumbClass || defaults.thumbClass;
      scope.thumbsNum = scope.thumbsNum || 3; // should be odd
    }

    var templateUrl = defaults.templateUrl;
    // Set the default template
    $templateCache.put(templateUrl,
      '<div class="{{ baseClass }}">' +
      '  <div ng-repeat="i in images">' +
      '    <img data-ng-src="{{ i.thumb }}" class="{{ thumbClass }}" ng-click="openGallery($index)" alt="Image {{ $index + 1 }}" />' +
      '  </div>' +
      '<div ng-show="allowUpload" class="file-upload btn btn-default">' +
      '<span><i class="icon-cloud-upload"></i></span>' +
      '<input on-after-validate="onUpload" ng-model="upload" name="upload" accept="image/*" base-sixty-four-input type="file" title="Upload screenshot" class="upload" />' +
      '</div>' +
      '</div>' +
      '<div class="ng-overlay" ng-show="opened">' +
      '</div>' +
      '<div class="ng-gallery-content" unselectable="on" ng-show="opened" ng-swipe-left="nextImage()" ng-swipe-right="prevImage()">' +
      '  <div class="uil-ring-css" ng-show="loading"><div></div></div>' +
      '<a ng-click="whenRemove()" class="download-image" title="Remove"><i class="icon-trash"></i></a>' +
      '  <a class="close-popup" ng-click="closeGallery()" title="Close"><i class="ti-close"></i></a>' +
      '  <a class="nav-left" ng-click="prevImage()" title="Previous"><i class="ti-angle-left"></i></a>' +
      '  <img ondragstart="return false;" draggable="false" data-ng-src="{{ img }}" ng-click="nextImage()" ng-show="!loading" class="effect" />' +
      '  <a class="nav-right" ng-click="nextImage()" title="Next"><i class="ti-angle-right"></i></a>' +
      '  <span class="info-text">{{ index + 1 }}/{{ images.length }} - {{ description }}</span>' +
      '  <div class="ng-thumbnails-wrapper">' +
      '    <div class="ng-thumbnails slide-left">' +
      '      <div ng-repeat="i in images">' +
      '        <img data-ng-src="{{ i.thumb }}" ng-class="{\'active\': index === $index}" ng-click="changeImage($index)" />' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );

    return {
      restrict: 'EA',
      scope: {
        images: '=',
        upload: '=',
        allowUpload: '=',
        onUpload: '=',
        onRemove: '=',
        thumbsNum: '@',
        hideOverflow: '='
      },
      controller: [
        '$scope',
        function ($scope) {
          $scope.$on('openGallery', function (e, args) {
            $scope.openGallery(args.index);
          });
        }
      ],
      templateUrl: function (element, attrs) {
        return attrs.templateUrl || defaults.templateUrl;
      },
      link: function (scope, element, attrs) {
        setScopeValues(scope, attrs);

        if (scope.thumbsNum >= 11) {
          scope.thumbsNum = 11;
        }

        var $body = $document.find('body');
        var $thumbwrapper = angular.element(element[0].querySelectorAll(
          '.ng-thumbnails-wrapper'));
        var $thumbnails = angular.element(element[0].querySelectorAll(
          '.ng-thumbnails'));

        scope.index = 0;
        scope.opened = false;

        scope.thumbWrapperWidth = 0;
        scope.thumbsWidth = 0;

        var loadImage = function (i) {
          var deferred = $q.defer();
          var image = new Image();

          image.onload = function () {
            scope.loading = false;
            if (typeof this.complete === false || this.naturalWidth ===
              0) {
              deferred.reject();
            }
            deferred.resolve(image);
          };

          image.onerror = function () {
            deferred.reject();
          };

          image.src = scope.images[i].img;
          scope.loading = true;

          return deferred.promise;
        };

        var calculateThumbsWidth = function () {
          var width = 0,
            visibleWidth = 0;
          angular.forEach($thumbnails.find('img'), function (thumb) {
            width += thumb.clientWidth;
            width += 10; // margin-right
            visibleWidth = thumb.clientWidth + 10;
          });
          return {
            width: width,
            visibleWidth: visibleWidth * scope.thumbsNum
          };
        };

        var smartScroll = function (index) {
          $timeout(function () {
            var len = scope.images.length,
              width = scope.thumbsWidth,
              itemScroll = parseInt(width / len, 10),
              i = index + 1,
              s = Math.ceil(len / i);

            $thumbwrapper[0].scrollLeft = 0;
            $thumbwrapper[0].scrollLeft = i * itemScroll - (s *
              itemScroll);
          }, 100);
        };

        var showImage = function (i) {
          loadImage(scope.index).then(function (resp) {
            scope.img = resp.src;
            smartScroll(scope.index);
          });
          scope.description = scope.images[i].description || '';
        };

        scope.showImageDownloadButton = function () {
          if (scope.images[scope.index] === null || scope.images[scope.index]
            .downloadSrc === null) {
            return;
          }
          var image = scope.images[scope.index];
          return angular.isDefined(image.downloadSrc) && 0 < image.downloadSrc
            .length;
        };

        scope.whenRemove = function () {
          if (scope.images[scope.index] === null) {
            return;
          } else {
            scope.onRemove(scope.images[scope.index]);
            scope.closeGallery();
          }
        };

        scope.changeImage = function (i) {
          scope.index = i;
          showImage(i);
        };

        scope.nextImage = function () {
          scope.index += 1;
          if (scope.index === scope.images.length) {
            scope.index = 0;
          }
          showImage(scope.index);
        };

        scope.prevImage = function () {
          scope.index -= 1;
          if (scope.index < 0) {
            scope.index = scope.images.length - 1;
          }
          showImage(scope.index);
        };

        scope.openGallery = function (i) {
          if (typeof i !== undefined) {
            scope.index = i;
            showImage(scope.index);
          }
          scope.opened = true;
          if (scope.hideOverflow) {
            angular.element('body').css({ overflow: 'hidden' });
          }

          $timeout(function () {
            var calculatedWidth = calculateThumbsWidth();
            scope.thumbsWidth = calculatedWidth.width;
            //Add 1px, otherwise some browsers move the last image into a new line
            var thumbnailsWidth = calculatedWidth.width + 1;
            $thumbnails.css({ width: thumbnailsWidth + 'px' });
            $thumbwrapper.css({
              width: calculatedWidth.visibleWidth +
                'px'
            });
            smartScroll(scope.index);
          });
        };

        scope.closeGallery = function () {
          scope.opened = false;
          if (scope.hideOverflow) {
            angular.element('body').css({ overflow: '' });
          }
        };

        $body.bind('keydown', function (event) {
          if (!scope.opened) {
            return;
          }
          var which = event.which;
          if (which === keysCodes.esc) {
            scope.closeGallery();
          } else if (which === keysCodes.right || which === keysCodes.enter) {
            scope.nextImage();
          } else if (which === keysCodes.left) {
            scope.prevImage();
          }

          scope.$apply();
        });

      }
    };
  }

  angular.module('ng311').directive('ngGallery', ngGallery);

  ngGallery.$inject = ['$document', '$timeout', '$q', '$templateCache'];

})();
