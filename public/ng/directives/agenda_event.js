app.directive('agendaEvent', function() {
    return {
        restrict: 'EA',
        templateUrl: '/partials/agenda_event',
        scope: {
            item: '='
        },
        link: function(scope, element, attrs) {
            var dayOfWeek = function(day) {
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                day %= 7;
                return days[day];
            }

            element.addClass( dayOfWeek(scope.item.when.getDay()).toLowerCase() );

            scope.blurb = function(item) {
                return item.description.substring(0, 80);
            }
            scope.register = function(item) {
                if(item.slots.available < item.slots.total) {
                    item.slots.taken++;
                }
            }
            scope.available = function(item) {
                return item.slots.total - item.slots.taken;
            }
        }
    }
});