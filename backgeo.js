define(function() {
    return {
        sync: function(method, model, options) {
            var $deferred = Deferred();
            _.defaults(options || (options = {}), {
                enableHighAccuracy: true,
                maximumAge: 0
            });
            if (method !== 'read') {
                options.error(code: 0.1, message: 'Geolocation method ' + method + ' not supported.'});
                $deferred.reject();
            }
            if (!!navigator.geolocation) {
                options.error({code: 0.2, message: 'Geolocation not supported/enabled on this device.'});
                $deferred.reject();
            }
            if ($deferred.isRejected()) {
                return $deferred;
            }
            var success = options.success, 
                wrappedSuccess = function(position) {
                    success(position);
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
            return $deferred;
        }       
    };
});
