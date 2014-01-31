app.controller('AgendaView', function($scope) {
    var lastEnd = 0;

    $scope.dayOfWeek = function(day) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        day %= 7;
        return days[day];
    }

    $scope.columns = [{
        index: 0
    },{
        index: 1
    },{
        index: 2
    }];
    $scope.columnStyles = [];
    $scope.columnStyle = {
        width: (100 / $scope.columns.length) + '%'
    };

    $scope.itemsInColumn = function(index) {
        if(index == 0) lastEnd = 0;
        var maxHeight = 560, headerHeight = 30, eventHeight = 140, list = $scope.items,
            start = lastEnd || 0, end = list.length - 1, height = 0;

        for(var i = start; i <= end; i++) {
            var item = list[i];
            height += item.type == 'event' ? eventHeight : headerHeight;

            if(height > maxHeight) {
                end = i;

                console.log(list[i-1]);
                console.log(list[i]);
                console.log(list[i+1]);
                console.log("\n\n--\n\n")

                if(list[i-1].type == 'header' && item.type == 'event') {
                    console.log('adjust header');
                    end--;
                }

                break;
            }
        }

        $scope.columns[index].class = (list[end-1].type == 'event' ? $scope.dayOfWeek(list[end-1].when.getDay()) : list[end-1].title).toLowerCase();

        lastEnd = end;
        return $scope.items.slice( start, end );
    }

    // Format listView to add in headers
    var formatList = function(list) {
        function insertHeader(day, index) {
            console.log('insert header for '+$scope.dayOfWeek(day) + 'at '+index)
            list.splice(index, 0, { type: 'header', title: $scope.dayOfWeek(day) });
        }

        var lastDay = list[0].when.getDay();
        insertHeader(lastDay, 0);
        for(var i = 0; i < list.length; i++) {
            var item = list[i], when = item.when;
            if( when == undefined ) continue;

            var day = when.getDay();
            if(when.getDay() < lastDay) {
                day += 7;
            }
            var between = day - lastDay;
            if( between > 0 ) {
                var start = lastDay + 1;
                for(var d = lastDay + 1; d <= day; d++) {
                    insertHeader(d, i++);
                }
                lastDay = when.getDay();
            }
        }

    }

    $scope.$watch('items', function(items) {
        formatList(items);
    })
});