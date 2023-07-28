
$('#prev').on('click', function() {
    $('#tagNav').animate({
        scrollLeft: '-=100'
    }, 300, 'swing');
    });

$('#next').on('click', function() {
    $('#tagNav').animate({
        scrollLeft: '+=100'
    }, 300, 'swing');
    });