app.controller('Schedule', function($scope) {
    $scope.items = [];

    var day = 1;
    for(var i = 0; i < 10; i++) {
        if( Math.random() < .45 ) {
            day++;
            if( Math.random() < .33 ) {
                day++;
            }
        }

        $scope.items.push({
            type: 'event',
            title: 'Lorem Ipsum '+i,
            when: new Date('Feb '+day),
            slots: {
                total: 4,
                taken: parseInt(Math.random()*5)
            },
            description: 'Lorem ipsum dolor inquit sit amet. Lorem ipsum dolor inquit sit amet. Lorem ipsum dolor inquit sit amet. Lorem ipsum dolor inquit sit amet.'
        });
    }
});