app.directive('agendaHeader', function() {
    return {
        restrict: 'EA',
        templateUrl: '/partials/agenda_header',
        scope: {
            item: '='
        },
        link: function(scope, element, attrs) {
            element.addClass( scope.item.title.toLowerCase() );
        }
    }
});