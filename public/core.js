var alchemyMachine = angular.module('alchemyMachine', []);

function mainController($scope, $http) {
    // when landing on the page, get all info and show them
    $http.get('/api/donnes')
        .success(function(data) {
            $scope.info = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // hits the route to make a potion
    $scope.createPotion = function() {
        $http.post('/api/donnes/mix', $scope.info)
            .success(function(data) {
                $scope.formData = {}; 
                $scope.info = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
