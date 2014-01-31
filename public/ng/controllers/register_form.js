app.controller('RegisterForm', function($scope, $http) {
    $scope.form = {};

    $scope.isValidEmail = function() {
        return /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
            .test($scope.form.email);
    }
    $scope.isValidPassword = function() {
        return /^[a-zA-Z0-9]{6,30}$/.test($scope.form.password || '');
    }
    $scope.doPasswordsMatch = function() {
        return $scope.form.passwordConfirm != undefined && $scope.form.password == $scope.form.passwordConfirm;
    }

    $scope.submit = function() {
        if( !$scope.isValidEmail() || !$scope.isValidPassword() || !$scope.doPasswordsMatch() ) {
            return;
        }

        $http({
            method: 'POST',
            url: '/api/members',
            data: $scope.form
        })
            .success(function(body, code, headers) {
                console.log('success')
            })
            .error(function(body, code) {
                if( code == 403 ) {

                }
            })
    }
});