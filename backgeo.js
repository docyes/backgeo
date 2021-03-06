define(['underscore', 'jquery'], function(_, $) {
    return {
        sync: function(method, model, options) {
            var $deferred = $.Deferred();
            _.defaults(options || (options = {}), {
                enableHighAccuracy: true,
                maximumAge: 0
            });
            if (method !== 'read') {
                options.error({code: 0.1, message: 'Geolocation method ' + method + ' not supported.'});
                $deferred.reject();
            }
            if (!!navigator.geolocation) {
                options.error({code: 0.2, message: 'Geolocation not supported/enabled on this device.'});
                $deferred.reject();
            }
            if ($deferred.isRejected()) {
                return $deferred.promise();
            }
            var success = options.success, 
                wrappedSuccess = function(position) {
                    var coords = position.coords,
                        resp = {
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            altitude: coords.altitude,
                            accuracy: coords.accuracy,
                            altitudeAccuracy: coords.altitudeAccuracy,
                            heading: coords.heading,
                            speed: coords.speed,
                            timestamp: position.timestamp
                        };
                    success(resp);
                    $deferred.resolve();
                },
                error = options.error,
                wrappedError = function(positionError) {
                    error(positionError);
                    $deferred.reject();
                };
            delete options.success;
            delete options.error;
            navigator.geolocation.getCurrentPosition(wrappedSuccess, wrappedError, option);
            return $deferred.promise();
        }       
    };
});
