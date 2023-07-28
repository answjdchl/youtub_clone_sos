
$('#prev').on('click', function() {
    $('#menu ul').animate({
        scrollLeft: '-=100'
    }, 300, 'swing');
    });

$('#next').on('click', function() {
    $('#menu ul').animate({
        scrollLeft: '+=100'
    }, 300, 'swing');
    });