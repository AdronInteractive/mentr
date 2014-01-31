app.controller('LoginForm', function($scope, $http) {
    $scope.form = {};

    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/login',
            headers: {
                password: $scope.form.password
            },
            data: {
                email: $scope.form.email
            }
        })
            .success(function(body, code, headers) {
                console.log('success', arguments)
                window.location = '/';
            })
            .error(function(body, code) {
                console.log('error', arguments);
            })
    }
});