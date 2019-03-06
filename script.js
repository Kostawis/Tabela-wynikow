var c1 = [];
var c2 = [];
var c3 = [];
var c4 = [];
var c5 = [];
var c6 = [];
var c7 = [];
var c8 = [];
var c9 = [];
var c10 = [];
var c11 = [];
var ID = 0;
$(document).ready(function() {

    
 

    $("input").dblclick(function(){
        $(this).prop("readonly", false) 

        if($(this).prop("readonly", false)) {

            var id = $(this).attr('id')
            $(this).closest('.komurka').addClass(id + 'A')

            $(this).closest('.komurka').css({
                'border-radius' : '15px',
                'transform' : 'scale(1.15)'
            });
            
        }
    });
    $("input").focusout(function(){
        $(this).prop("readonly", true);
        

        if($(this).prop("readonly", true)) {

            var id = $(this).attr('id')
            $(this).closest('.komurka').removeClass(id + 'A')

            $(this).closest('.has-input').css({
                'border-radius' : '',
                'transform' : ''
            });
        }
    });
    
    $("input").on("change paste keyup", function() {
        //console.log($(this).val()); 
        sumaPunktow(this)
    });

   
    var i=0;
    $('input').each(function(){
        i++;
        var newData='nr'+i;
        $(this).attr("data-place", newData)
        
    });

    $('input[type="number"]').each(function(){  

        var data = $(this).attr('data-place');
        var value = localStorage.getItem(data);
        
        $(this).val(value);
        
    }); 
    
    sumaOnLoad()

});


   

$('.exit-button-stoper').click(function() {
    
    $('.stopwatch-container').animate({
        width: "300px",
        top: "20px",
        height: "70px",
        right: "40px",
        borderRadius: "5px"
      }, 400 );
      $('.time').animate({
        fontSize: "3em",
        width: "146px"
      }, 400 );
      $('.controls').slideUp(150);
      $('.exit-button').fadeOut(150);
      
     
});

$('.time').click(function() {

    $('.stopwatch-container').animate({
        width: "100%",
        height: "100vh",
        bottom: "",
        top: "0",
        right: "",
        borderRadius: ""
    }, 400 );
    $('.time').animate({
        fontSize: "180px",
        width: "550px"
    }, 400 );
    $(".controls").fadeIn({
        start: function () {
            $(this).css({
            display: "flex"
            }, 400)
        }
    });
    $('.exit-button-stoper').fadeIn(400);
    
});
$('.stoper-btn').click(function() {
    $('.time').click()
});

$('.clear').click(function() {
    deleteItem() 
})

$('.tabela-koncowa').click(function() {
    $('.tabela-overlay').fadeIn({
        start: function () {
            $(this).css({
            display: "flex"
            }, 400)
        }
    }) 

    dodajDoSzkola()

})
$('.exit-button-tabela').click(function() {
    $('.tabela-overlay').fadeOut(400);
})

$('input').keydown(function (e) {
    if (e.which === 13) {
        //$(this).next('.inputs').focus();
        var nastepny = $(this).closest('.komurka').nextAll().eq(0).find('input')
        var thisID = $(this).attr('id')
        var id = $(nastepny).attr('id')
        $(this).prop("readonly", true)
        $(this).closest('.komurka').removeClass(thisID + 'A')
        $(nastepny).prop("readonly", false)
        $(nastepny).focus()
        
        $(nastepny).closest('.komurka').addClass( id + 'A')

        $(nastepny).closest('.komurka').css({
            'border-radius' : '15px',
            'transform' : 'scale(1.15)'
        });
    }
});

function deleteItem() {
    if (confirm("Czy napewno chcesz usunąć wszystkie dane z tabeli?")) {
        // your deletion code
        clearLocalStorage()
        location.reload()
    }
    return false;
}
function clearLocalStorage(){
    localStorage.clear();
}

function sumaPunktow(komurka) {
    var komurkaID = $(komurka).attr('id');
    var sum = 0;
    var data = $(komurka).attr('data-place');
    var value = $(komurka).val();

    $(".main-row").find("#" + komurkaID).each(function(){
        sum += +$(this).val();
    });
    $('.' + komurkaID + '-sum').html(sum);

   localStorage.setItem(data, value);
    
}

function sumaOnLoad() {
    
    for ( var ID = 0, l = 11; ID < l; ID++ ) {
        var sum = 0;
        $(".main-row").find("#c" + ID).each(function(){
        sum += +$(this).val();
        });
        $('.c' + ID + '-sum').html(sum);
    }
    
   
}

$(function () {

    // Never assume one widget is just used once in the page. You might
    // think of adding a second one. So, we adjust accordingly.

    $('.stopwatch').each(function () {

        // Cache very important elements, especially the ones used always
        var element = $(this);
        var running = element.data('autostart');
        var minutesElement = element.find('.minutes');
        var secondsElement = element.find('.seconds');
        var toggleElement = element.find('.toggle');
        var resetElement = element.find('.reset');
        var pauseText = toggleElement.data('pausetext');
        var resumeText = toggleElement.data('resumetext');
        var startText = toggleElement.text();

        // And it's better to keep the state of time in variables 
        // than parsing them from the html.
        var minutes, seconds, timer;

        function prependZero(time, length) {
            // Quick way to turn number to string is to prepend it with a string
            // Also, a quick way to turn floats to integers is to complement with 0
            time = '' + (time | 0);
            // And strings have length too. Prepend 0 until right.
            while (time.length < length) time = '0' + time;
            return time;
        }

        function setStopwatch(minutes, seconds) {
            // Using text(). html() will construct HTML when it finds one, overhead.
            minutesElement.text(prependZero(minutes, 2));
            secondsElement.text(prependZero(seconds, 2));
        }

        // Update time in stopwatch periodically - every 25ms
        function runTimer() {
            // Using ES5 Date.now() to get current timestamp            
            var startTime = Date.now();
            var prevMinutes = minutes;
            var prevSeconds = seconds;

            timer = setInterval(function () {
                var timeElapsed = Date.now() - startTime;

                minutes = ((timeElapsed / 60000) + prevMinutes) % 60;
                seconds = ((timeElapsed / 1000) + prevSeconds) % 60;

                setStopwatch(minutes, seconds);
            }, 25);
        }

        // Split out timer functions into functions.
        // Easier to read and write down responsibilities
        function run() {
            running = true;
            runTimer();
            toggleElement.text(pauseText);
        }

        function pause() {
            running = false;
            clearTimeout(timer);
            toggleElement.text(resumeText);
        }

        function reset() {
            running = false;
            pause();
            minutes = seconds = 0;
            setStopwatch(minutes, seconds);
            toggleElement.text(startText);
        }

        // And button handlers merely call out the responsibilities
        toggleElement.on('click', function () {
            (running) ? pause() : run();
        });

        resetElement.on('click', function () {
            reset();
        });

        // Another advantageous thing about factoring out functions is that
        // They are reusable, callable elsewhere.
        reset();
        if(running) run();
    });

});

function Szkola(wynik, nazwa) {
    this.wynik = wynik;
    this.nazwa = nazwa;

}

function dodajDoSzkola() {  
    var szkoly = []
    for(i=1; i <= 11; i++) {
        var nazwa = $('.c' + i + '-klasa').html()
        var wynik = $('.c' + i + '-sum').html()
        window["szkola"+i] = new Szkola(wynik, nazwa);

        var d = window["szkola"+i]
        szkoly.push(d)
        
    }

    szkoly.sort(function(obj1, obj2) {
        return obj2.wynik - obj1.wynik;
    });  
    var nazwaSzkoly = szkoly
    $('.tabela-tymczasowe').remove()
    for(i=1; i <= 3; i++) {
        var nazwaSzkoly = szkoly[i-1].nazwa
        var uzyskanyWynik = szkoly[i-1].wynik
        
        $('.tabela-inside').append(dodanieElementuTabeli(i, nazwaSzkoly, uzyskanyWynik))
        $('.tabela-tymczasowe').hide()
        $('.tabela-tymczasowe').slideDown('slow')
    }
}

function dodanieElementuTabeli(i, szkola, wynik) {
    return  '<div class="tabela-element tabela-tymczasowe">'+
                '<div class="miejsce"> ' + i + '.</div>'+
                '<div class="klasa">' + szkola + '</div>'+
                '<div class="punkty">' + wynik + '</div>'+
            '</div>'
}

var typed = new Typed('.animate-h1', {
    strings: ["Omnibus Matematyczno-Przyrodniczy 2019", "Jakiś inny tekst który będzie się wyświetlał", "I na przykład jeszcze jeden, i tak w kółko ;D", "Tylko pewnie dużo wolniej, tak żemy nie raziło w oczy :D"],
    typeSpeed: 35,
    backDelay: 2000,
    startDelay: 500,
    loop: true,
  });