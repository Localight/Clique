// 'use strict';

// var Persona = require('.../public/demo23_files/.../public/demo23_files/server/models/persona');

AppView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        /* 
        Pass variables in using Underscore.js Template
        These are available within the #clique_main_template
        I used these to specify default values to some of the input fields and labels in the template
        */
        variables = {
        	clique_to_label: 'To', 
        	clique_to_label_name: 'First name',
        	clique_amt_label: '$', 
        	clique_amt_label_name: 'Amount',
        	clique_from_label: 'From', 
        	clique_from_label_name: 'Your name',
        	clique_code_label: 'Clique', 
        	clique_code_label_name: 'Code',
        	clique_occasion_label: 'Occasion',
        	clique_senddate_label: 'Send',
        	clique_paymenttype_label: 'Check or Card?',
        	clique_ccnumber_label: 'xxxx xxxx xxxx xxxx',
        	clique_expiredatemonth_label: 'MM',
        	clique_expiredateyear_label: 'YY',
        	clique_expiredatecvv_label: 'CVV',
        	clique_expiredatezip_label: 'ZIPCODE',
        	clique_ordersummaryphone_label: '(xxx)-xxx-xxxx',
        	clique_ordersummarysendreceipt_label: 'Send receipt to',
        	clique_ordersummarysendgift_label: 'Send this gift of',
        	clique_ordersummaryfrom_label: 'From',
        	clique_ordersummaryemail_label: 'you@email.com'
        };
        
        // Compile the template using underscore
        var cliquemaintemplate = _.template( $('#clique_main_template').html(), variables);
        // Load the compiled HTML into the Backbone "el"
        this.$el.html( cliquemaintemplate );
        
        // scale to viewport size
        if($(window).width() < 360)
        	$('.wrapper').css('min-width', $(window).width() + 'px');
        
        this.loadinitialelements();
        
    },
    loadinitialelements: function(){
    	$('.wrapper #localstreet').animate({'top':'200px'}, 400, 'swing', function() {
        	$('#clique_logo').animate({'top':'0px'}, 300, function() {
            	$('#clique_to, #clique_amt_scrollwindow, span.rightarrow, span.leftarrow, img.bowtie').show();
            });
       	});
        var elemsToHide = '#finalOverlay, #cliqueOverlay';
        $(elemsToHide).hide();
    },
    /*
    Specify any events that are needed in the block below. Format of events are:
    '<event> <selector>': '<function name>'
    Function implementations can go anywhere within the backbone view code block
    */
    events: {
        'focus #clique_input_to': 'inputfocus_to',
        'blur #clique_input_to': 'inputblur_to',
        'focus #clique_input_from': 'inputfocus_from',
        'blur #clique_input_from': 'inputblur_from',
        'focus #clique_input_code': 'inputfocus_code',
        'blur #clique_input_code': 'inputblur_code',
        'click .checkmark': 'checkmarkclick_code',
        'click #clique_occasion_selection > div': 'occasionselection',
        'focus #clique_input_occasion': 'inputfocus_occasion',
        'blur #clique_input_occasion': 'inputblur_occasion',
        'click #clique_occasion .inputlabel': 'showoccasionselection',
        'click .sendtoday': 'click_sendtoday',
        'click .choosedate': 'click_choosedate',
        'click img.changedate': 'click_changedate',
        'click #clique_input_date': 'click_changedate',
        'focus #cliquedate': 'inputfocus_datepicker',
        'blur #cliquedate': 'inputblur_datepicker',
        'focus #clique_input_enterdate': 'inputfocus_enterdate',
        'blur #clique_input_enterdate': 'inputblur_enterdate',
        'click .paybycheck': 'click_paybycheck',
        'click .paybycard': 'click_paybycard',
        'click .creditcardnumbercontainer': 'click_creditcardnumber',
        'click .expiredatecontainer': 'click_expiredate',
        'focus #expiredate_month': 'inputfocus_expiredate_month',
        'focus #expiredate_year': 'inputfocus_expiredate_year',
        'focus #expiredate_cvv': 'inputfocus_expiredate_cvv',
        'focus #expiredate_zip': 'inputfocus_expiredate_zip',
        'blur #expiredate_month': 'inputblur_expiredate_month',
        'blur #expiredate_year': 'inputblur_expiredate_year',
        'blur #expiredate_cvv': 'inputblur_expiredate_cvv',
        'blur #expiredate_zip': 'inputblur_expiredate_zip',
        'blur #clique_input_creditcardnumber': 'blur_inputcreditcardnumber',
        'blur .clique_input_expiredate': 'blur_inputexpiredate',
        'click #clique_revieworder img.revieworder': 'click_revieworder',
        'focus #clique_input_phonenumber': 'inputfocus_phonenumber',
        'blur #clique_input_phonenumber': 'inputblur_phonenumber',
        'focus #clique_input_email': 'inputfocus_email',
        'blur #clique_input_email': 'inputblur_email',
        'click #clique_schedulegift img.scheduleorder': 'click_schedulegift',
        'keypress #clique_input_to': 'inputkeypress_to',
        'keypress #clique_input_from': 'inputkeypress_from',
        'keyup #clique_input_code': 'inputkeypress_code',
        'keypress #clique_input_occasion': 'inputkeypress_occasion',
        'keydown #clique_input_occasion': 'inputkeypress_occasion',
        'click #clique_amt': 'amtfocus',
        'click #clique_amt_scrollwindow > div > div': 'amtchoose'
    },
    inputfocus_to: function(event){
    	var elem = $(event.currentTarget);
    	$('#clique_to').removeClass('filledin').addClass('currentinput');
    	$('#clique_from').show();
    	if(elem.val() == variables.clique_to_label_name)
    		elem.prop('value','');
    },
    inputblur_to: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == '' || !elem.val())
    		elem.prop('value', variables.clique_to_label_name);
    	else
    		$('#clique_to').removeClass('currentinput').addClass('filledin');
    },
    inputkeypress_to: function(event){
    	if($('#clique_amt_scrollwindow').hasClass('inactive'))
    		$('#clique_amt_scrollwindow').removeClass('inactive');
    },
    inputfocus_from: function(event){
        var elem = $(event.currentTarget);
        $('#clique_from').removeClass('filledin').addClass('currentinput');
    	if(elem.val() == variables.clique_from_label_name)
    		elem.prop('value','');
    		
        if($('#clique_input_code').val() == 'Code') {
        	// $('#clique_code').show();
          $('#clique_occasion_selection').show();
        }
    },
    inputblur_from: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == '' || !elem.val())
    		elem.prop('value', variables.clique_from_label_name);
    	else
    		$('#clique_from').removeClass('currentinput').addClass('filledin');
    },
    inputkeypress_from: function(event){
    	if($('#clique_code').hasClass('nextinput'))
    		$('#clique_code').removeClass('inactive nextinput').addClass('currentinput');
    },
    inputfocus_code: function(event){
    	var elem = $(event.currentTarget);
        $('#clique_code').removeClass('filledin').addClass('currentinput');
    	if(elem.val() == 'Code') {
    		elem.prop('value','');
    		$('#clique_code span.inputlabel').html('Code');
    	}
    	
    	$('.flip-container').show();
    	window.setTimeout(function() {
    		$('.flip-container').addClass('flip');
    		$('.flip-container .flipper .back img').hide();
    		window.setTimeout(function() {
    			$('.flip-container .flipper .back img').show();
    		}, 700);
    	}, 700);
    },
    inputblur_code: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == '' || !elem.val()) {
    		$('#clique_code span.inputlabel').html('Clique');
    		elem.prop('value', 'Code');
    	} else {
    		$('#clique_code span.inputlabel').html('Code');
    		$('#clique_code').removeClass('currentinput').addClass('filledin');
    		
    		// hide clique card animation
    		$('.flip-container').hide();
    	}
    	
    	// display occasion field
    	if(!$('#clique_input_occasion').val()) {
        	$('#clique_occasion_selection').show();
        }
    },
    inputkeypress_code: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val().length >= 5) {
    		$('.checkmark').show();
    	} else {
    		$('.checkmark').hide();
    	}
    },
    checkmarkclick_code: function(event){
    	$('#clique_code').hide();
    },
    occasionselection: function(event){
    	var elemName = $(event.currentTarget).attr('name');
    	if(elemName == 'birthday') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_bday_selected.png" />');
            $('#clique_input_occasion').val('Variety is the spice of life. So I’m giving you the gift of choice!');
            $('#occasion_icon').val('birthday');
    	} else if(elemName == 'wedding') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_wedding_selected.png" />');
            $('#clique_input_occasion').val('Falling in love is EASY. But staying in love is EXTRAORDINARY. Congratulations on your marriage!');
            $('#occasion_icon').val('wedding');
    	} else if(elemName == 'anniversary') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_anniversary_selected.png" />');
            $('#clique_input_occasion').val('You remind me of time itself for you are my Past, Present, Future, and Forever. I love you. Happy Anniversary.');
            $('#occasion_icon').val('anniversary');
    	} else if(elemName == 'baby') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_baby_selected.png" />');
    		$('#clique_input_occasion').val('Congratulations on the birth of your child!');
        $('#occasion_icon').val('baby');
    	} else if(elemName == 'love') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_love_selected.png" />');
            $('#clique_input_occasion').val('I love you! "Whatever our souls are made of, yours & mine are the same." ~ Emily Bronte');
            $('#occasion_icon').val('love');
    	} else if(elemName == 'sympathy') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_sympathy_selected.png" />');
            $('#clique_input_occasion').val('Our collective hearts are heavy with sympathy.');
            $('#occasion_icon').val('sympathy');
    	} else if(elemName == 'getwell') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_getwell_selected.png" />');
            $('#clique_input_occasion').val('Your family and friends miss you and look forward to your speedy recovery. Get well soon!');
            $('#occasion_icon').val('getwell');
    	} else if(elemName == 'thankyou') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_thankyou_selected.png" />');
            $('#clique_input_occasion').val('You’re the best! You deserve some retail therapy.');
            $('#occasion_icon').val('thankyou');
    	} else if(elemName == 'congrats') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_congrats_selected.png" />');
            $('#clique_input_occasion').val('Spread joy. Chase your wildest dreams. Congratulations!');
            $('#occasion_icon').val('congrats');
    	} else if(elemName == 'custom') {
    		$('#clique_occasion span.inputlabel').html('<img src="../public/demo23_files/occasion_custom_selected.png" />');
            $('#clique_input_occasion').val('If you want to be loved for who you are, just be yourself.');
            $('#occasion_icon').val('custom');
    	}
    		
    	$('#clique_occasion').show();
    	$('#clique_input_occasion').focus();
    	$('#clique_occasion_selection').hide();
    	$('#clique_senddate').show();
    	
    	if(!$('#clique_input_date').val())
    		$('#clique_input_date').hide();
    },
    inputfocus_occasion: function(event){
    	var elem = $(event.currentTarget);
    	$('.charactercounter').show();
    	$('#clique_occasion_selection').show();
    	$('#clique_occasion').removeClass('filledin').addClass('currentinput');
    	var numchar = elem.val().length;
    	if(numchar >= 80) {
    		$('.charactercounter').html('0');
    		var newstring = elem.val().substring(0, 80);
    		elem.attr('value', newstring);
    	} else {
    		var charsleft = numchar*1;
    		charsleft = 80 - charsleft;
    		$('.charactercounter').html(charsleft);
    	}
    },
    inputblur_occasion: function(event){
    	var elem = $(event.currentTarget);
    	$('#clique_occasion_selection').hide();
    	$('#clique_occasion').removeClass('currentinput').addClass('filledin');
    	$('#clique_senddate').show();
    	$('.charactercounter').hide();
    	if(!$('#clique_input_date').val())
    		$('#clique_input_date').hide();
    },
    showoccasionselection: function(event){
    	$('#clique_occasion_selection').show();
    },
    inputkeypress_occasion: function(event){
    	var elem = $(event.currentTarget);
    	var numchar = elem.val().length;
    	if(numchar >= 80) {
    		$('.charactercounter').html('0');
    		var newstring = elem.val();
    		newstring = newstring.substring(0, 80);
    		elem.val(newstring);
    	} else {
    		var charsleft = numchar*1;
    		charsleft = 80 - charsleft;
    		$('.charactercounter').html(charsleft);
    	}
    },
    click_sendtoday: function(event){
    	// get current date in js
    	var monthstrings = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    	var today = new Date();
		var dd = today.getDate();
		var mm = monthstrings[today.getMonth()];
		var yyyy = today.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+' '+dd+', '+yyyy;
		$('.sendtoday, .choosedate').hide();
		$('#clique_senddate span.inputlabel').html('<img class="changedate" src="../public/demo23_files/send_today_blk.png" alt="Chosen Date" />');
		$('#clique_input_date').attr('value', 'Send on ' + today).show();
		$('#clique_senddate').removeClass('nextinput').addClass('filledin');
		

    // var height = $('#clique_paymenttypeselectedcard')[0].scrollHeight;  
    // display payment type field
    this.click_paybycard();

    var div = $('#clique_paymenttypeselectedcard');
    var height = div[0].scrollHeight;
    console.log(height);
    $('body').scrollTop(height);

    },
    click_choosedate: function(event){
    	var elem = event.currentTarget;
    	if($('#cliquedate').attr('type') != 'date') { // user browser does not support html5 native datepicker
    		$('.choosedate > img, .sendtoday, #clique_input_date').hide();
    		$('#clique_input_enterdate').addClass('heart').show()/*.css({'width':'100% !important', 'color':'#dddddd'})*/;
    		$('#clique_senddate').removeClass('nextinput').addClass('currentinput');
    		$('.choosedate').css({'width':'72%', 'padding-top':'0', 'margin-left':'0'});
    	} else { // user browser supports html5 native datepicker
    		$('.choosedate > img, .sendtoday, #clique_input_date').hide();
    		
    		var todaysDate = new Date(),
    			yyyy = todaysDate.getFullYear(),
    			mm = todaysDate.getMonth()+1,
    			dd = todaysDate.getDate();
    		
    		$('#cliquedate').remove();
    		var dateVal = yyyy + '-' + mm + '-' + dd;
    		
    		var datePickerStr = '<input type="date" id="cliquedate" min="2014-02-01" value="' + dateVal + '" />';
    		$('.sendOnDate').after(datePickerStr);
    		$('#clique_senddate span.inputlabel').html('<img class="changedate" src="../public/demo23_files/send_on_date_blk.png" alt="Chosen Date" />');
    	}
    	
    	$('.choosedate').removeClass('choosedate').addClass('choosedateactive');
    },
    click_changedate: function(event){
    	$('.choosedateactive').removeClass('choosedateactive').addClass('choosedate');
    	
    	$('#clique_senddate span.inputlabel').html(variables.clique_senddate_label);
    	$('.sendtoday, .choosedate, .choosedate > img').show();
    	$('#clique_input_date, #cliquedate').hide();
    	$('#clique_senddate').addClass('nextinput').removeClass('filledin');
    },
    inputfocus_enterdate: function(event){
    	var elem = $(event.currentTarget);
    	$('#clique_senddate').removeClass('filledin').addClass('currentinput');
    	if(elem.val() == 'mm/dd/yyyy') {
    		$('#clique_input_enterdate').attr('value','').css('color','black');
    	}
    },
    inputblur_enterdate: function(event){
    	var elem = $(event.currentTarget);
    	if(!elem.val()) {
    		elem.attr('value','mm/dd/yyyy').css('color','#dddddd');
    	} else
    		$('#clique_senddate').removeClass('currentinput').addClass('filledin');
    },
    inputfocus_datepicker: function(event){
    	var elem = $(event.currentTarget);
    },
    inputblur_datepicker: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val()) {
			var dateString = elem.val().replace(/-/g, "/"),
				chosenDate = new Date(dateString),
				yyyy = chosenDate.getFullYear(),
	    		mm = chosenDate.getMonth()+1,
	    		dd = chosenDate.getDate(),
	    		month = convertMonth(mm);
			
			$('#clique_input_date').attr('value', 'Send on ' + month + ' ' + dd + ', ' + yyyy).show();
			$('#clique_senddate').removeClass('nextinput').addClass('filledin');
			$('div.choosedate, #cliquedate').hide();
			
			// display payment type field
			this.click_paybycard();
		}
    },
    click_paybycheck: function(event){
    	// functionality not implemented yet
    },
    click_paybycard: function(event){
    	$('#clique_paymenttypeselectedcard').show();
    	$('.creditcardnumbercontainer').css('background-color','white');
    	$('#clique_input_creditcardnumber').css('color','black')
    	$('.expiredatecontainer').css('background-color','transparent');
    	$('#clique_paymenttype').hide();
    },
    click_creditcardnumber: function(event){
    	$('.creditcardnumbercontainer').css('background-color','white');
    	$('#clique_input_creditcardnumber').css('color','black');
    	$('.clique_input_expiredate').css('color','white');
    	$('img.creditcardnumber').remove();
    	$('.creditcardnumbercontainer span.inputlabel').html('<img class="creditcardnumber" alt="Pay by Check" src="../public/demo23_files/paybycard_black.png" style="height:25px;" />');
    	$('.expiredatecontainer span.inputlabel').html('<img class="creditcardnumber" alt="Pay by Check" src="../public/demo23_files/paybycard.png" style="height:25px;" />');
    	$('.expiredatecontainer').css('background-color','transparent');
    	
    	if($('#clique_input_creditcardnumber').val().toLowerCase() == variables.clique_ccnumber_label) {
    		$('#clique_input_creditcardnumber').attr('value','');
    	}
    	
    	$('#clique_input_creditcardnumber').focus();
    },
    click_expiredate: function(event){
    	$('.expiredatecontainer').css('background-color','white');
    	$('.clique_input_expiredate').css('color','black');
    	$('#clique_input_creditcardnumber').css('color','white');
    	$('img.expiredate').remove();
    	$('.creditcardnumbercontainer span.inputlabel').html('<img class="creditcardnumber" alt="Pay by Card" src="../public/demo23_files/paybycard.png" style="height:25px;" />');
    	$('.expiredatecontainer span.inputlabel').html('<img class="creditcardnumber" alt="Pay by Card" src="../public/demo23_files/paybycard_black.png" style="height:25px;" />');
    	$('.creditcardnumbercontainer').css('background-color','transparent');
    	
    	$('#clique_input_expiredate').focus();
    },
    blur_inputcreditcardnumber: function(event){
    	var elem = $(event.currentTarget);
    	$('#creditcardnumbercontainer').css('background-color','black');
    	$('#expiredatecontainer').css('background-color','transparent');
    	
    	if(!elem.val() || elem.val() == '') {
    		//elem.attr('value',variables.clique_ccnumber_label);
    		$('#clique_input_creditcardnumber').attr('value', variables.clique_ccnumber_label);
    	} else if(elem.val().substring(0,1) == '3') {
    		// american express
    		$('.creditcardnumbercontainer span.inputlabel').html('<img class="creditcardnumber" alt="Amex" src="../public/demo23_files/amex.png" style="height:25px;" />');
    	} else if(elem.val().substring(0,1) == '4') {
    		// visa
    		$('.creditcardnumbercontainer span.inputlabel').html('<img class="creditcardnumber" alt="Visa" src="../public/demo23_files/visa.png" style="height:25px;" />');
    	} else if(elem.val().substring(0,1) == '5') {
    		// master card
    		$('.creditcardnumbercontainer span.inputlabel').html('<img class="creditcardnumber" alt="Master Card" src="../public/demo23_files/mastercard.png" style="height:25px;" />');
    	} else if(elem.val().substring(0,1) == '6') {
    		// discover
    		$('.creditcardnumbercontainer span.inputlabel').html('<img class="creditcardnumber" alt="Discover" src="../public/demo23_files/discover.png" style="height:25px;" />');
    	}
    	
    	checkCCInfo();
    	/*
    	// display "Review Order" button if credit card information is entered
    	var a = $('#expiredate_month').val(),
    		b = $('#expiredate_year').val(),
    		c = $('#expiredate_cvv').val(),
    		d = $('#expiredate_zip').val(),
    		e = $('#clique_input_creditcardnumber').val().toLowerCase();
    		
    	if(a && b && c && d && e && e.indexOf('x') == -1 && a != variables.clique_expiredatemonth_label && b != variables.clique_expiredateyear_label && c != variables.clique_expiredatecvv_label && d != variables.clique_expiredatezip_label) {
    		// information has been entered for all payment fields, display "Review Order" button
    		$('#clique_revieworder').show();
    	}
    	*/
    },
    blur_inputexpiredate: function(event){
    	$('#expiredatecontainer').css('background-color','black');
    	$('#creditcardnumbercontainer').css('background-color','transparent');
    },
    inputfocus_expiredate_month: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == variables.clique_expiredatemonth_label) {
    		elem.attr('value','');
    	}
    },
    inputfocus_expiredate_year: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == variables.clique_expiredateyear_label) {
    		elem.attr('value','');
    	}
    },
    inputfocus_expiredate_cvv: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == variables.clique_expiredatecvv_label) {
    		elem.attr('value','');
    	}
    },
    inputfocus_expiredate_zip: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == variables.clique_expiredatezip_label) {
    		elem.attr('value','');
    	}
    },
    inputblur_expiredate_month: function(event){
    	var elem = $(event.currentTarget);
    	if(!elem.val()) {
    		elem.attr('value', variables.clique_expiredatemonth_label);
    	}
    	
    	
    	checkCCInfo();
    	/*
    	// display "Review Order" button if credit card information is entered
    	var a = $('#expiredate_month').val().toLowerCase(),
    		b = $('#expiredate_year').val().toLowerCase(),
    		c = $('#expiredate_cvv').val().toLowerCase(),
    		d = $('#expiredate_zip').val().toLowerCase(),
    		e = elem.val().toLowerCase();
    	
    	if(a && b && c && d && e && e.indexOf('x') == -1 && a != 'mm' && b != 'yy' && c != 'cvv' && d != 'zipcode') {
    		// information has been entered for all payment fields, display "Review Order" button
    		$('#clique_revieworder').show();
    	}
    	*/
    },
    inputblur_expiredate_year: function(event){
    	var elem = $(event.currentTarget);
    	if(!elem.val()) {
    		elem.attr('value', variables.clique_expiredateyear_label);
    	}
    	
    	checkCCInfo();
    	/*
    	// display "Review Order" button if credit card information is entered
    	var a = $('#expiredate_month').val().toLowerCase(),
    		b = $('#expiredate_year').val().toLowerCase(),
    		c = $('#expiredate_cvv').val().toLowerCase(),
    		d = $('#expiredate_zip').val().toLowerCase(),
    		e = elem.val().toLowerCase();
    	
    	if(a && b && c && d && e && e.indexOf('x') == -1 && a != 'mm' && b != 'yy' && c != 'cvv' && d != 'zipcode') {
    		// information has been entered for all payment fields, display "Review Order" button
    		$('#clique_revieworder').show();
    	}
    	*/
    },
    inputblur_expiredate_cvv: function(event){
    	var elem = $(event.currentTarget);
    	if(!elem.val()) {
    		elem.attr('value', variables.clique_expiredatecvv_label);
    	}
    	
    	checkCCInfo();
    	/*
    	// display "Review Order" button if credit card information is entered
    	var a = $('#expiredate_month').val().toLowerCase(),
    		b = $('#expiredate_year').val().toLowerCase(),
    		c = $('#expiredate_cvv').val().toLowerCase(),
    		d = $('#expiredate_zip').val().toLowerCase(),
    		e = elem.val().toLowerCase();
    	
    	if(a && b && c && d && e && e.indexOf('x') == -1 && a != 'mm' && b != 'yy' && c != 'cvv' && d != 'zipcode') {
    		// information has been entered for all payment fields, display "Review Order" button
    		$('#clique_revieworder').show();
    	}
    	*/
    },
    inputblur_expiredate_zip: function(event){
    	var elem = $(event.currentTarget);
    	if(!elem.val()) {
    		elem.attr('value', variables.clique_expiredatezip_label);
    	}
    	
    	checkCCInfo();
    	/*
    	// display "Review Order" button if credit card information is entered
    	var a = $('#expiredate_month').val().toLowerCase(),
    		b = $('#expiredate_year').val().toLowerCase(),
    		c = $('#expiredate_cvv').val().toLowerCase(),
    		d = $('#expiredate_zip').val().toLowerCase(),
    		e = elem.val().toLowerCase();
    	
    	if(a && b && c && d && e && e.indexOf('x') == -1 && a != 'mm' && b != 'yy' && c != 'cvv' && d != 'zipcode') {
    		// information has been entered for all payment fields, display "Review Order" button
    		$('#clique_revieworder').show();
    	}
    	*/
    },
    click_revieworder: function(event){
    	//******

    	var elemsToHide = 
    		'#clique_logo, .bowtie, #clique_to, #amtwrapper, #clique_from, .flip-container, #clique_code, #clique_occasion, #clique_occasion_selection, ' + 
    		'#clique_senddate, #clique_paymenttype, #clique_paymenttypeselectedcheck, #clique_paymenttypeselectedcard, #clique_revieworder';
    	
    	$(elemsToHide).hide();	
    	$('#clique_ordersummary').show();
    	
    	// populate with user data
    	$('span.recipientname').html($('#clique_input_to').val());
    	$('span.purchasername').html($('#clique_input_from').val());
    	$('span.chosengiftamt').html('$' + $('#clique_amt span.heart').html());
    },
    inputfocus_phonenumber: function(event){
    	var elem = $(event.currentTarget);
    	$('.summaryphonenumber').removeClass('filledin').addClass('currentinput');
    	if(elem.val() == variables.clique_ordersummaryphone_label)
    		elem.prop('value','');
    },
    inputblur_phonenumber: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == '' || !elem.val())
    		elem.prop('value', variables.clique_ordersummaryphone_label);
    	else
    		$('.summaryphonenumber').removeClass('currentinput').addClass('filledin');
    },
    inputfocus_email: function(event){
    	var elem = $(event.currentTarget);
    	$('.summaryemail').removeClass('nextinput').removeClass('filledin').addClass('currentinput');
    	elem.css('color','#000000');
    	$('.summaryemail span.inputlabel').html('<img class="emailsignblack" alt="Enter Email Address" src="../public/demo23_files/emailsign_blk.png" style="height:25px;margin-top:-2px;" />');
    	
    	if(elem.val() == variables.clique_ordersummaryemail_label)
    		elem.prop('value','');
    },
    inputblur_email: function(event){
    	var elem = $(event.currentTarget);
    	if(elem.val() == '' || !elem.val())
    		elem.prop('value', variables.clique_ordersummaryemail_label);
    	else {
    		$('.summaryemail').removeClass('currentinput').addClass('filledin');
    		$('#clique_schedulegift').show();
    	}
    },
    click_schedulegift: function(event){
      $('body').addClass('overlay');
      $('#finalOverlay').fadeIn(1000);
      $('#finalOverlay').show();

      // data object
    	var postObj = {
    		To: $('#clique_input_to').val(),
    		Amount: $('#clique_amt span.heart').html(),
    		From: $('#clique_input_from').val(),
    		Code: $('#clique_input_code').val(),
    		Occasion: $('#clique_input_occasion').val(),
    		Date: $('#clique_input_date').val(),
    		CreditCardNumber: $('#clique_input_creditcardnumber').val(),
    		ExpireMonth: $('#expiredate_month').val(),
    		ExpireYear: $('#expiredate_year').val(),
    		ExpireCVV: $('#expiredate_cvv').val(),
    		PhoneNumber: $('#clique_input_phonenumber').val(),
    		Email: $('#clique_input_email').val(),
        Icon: $('#occasion_icon').val(),
        UniqueLink: uniqueLink
    	};

      // balanced.js callback to create card
      function handleResponse(response) {

        // if card is validated
        if (response.status_code === 201) {
          
          // get BP credit card href for buyer and store postObj
          var fundingInstrument = response.cards != null ? response.cards[0] : response.bank_accounts[0];
          postObj.fundingInstrument = fundingInstrument;
          
          // create Buyer and Recipient Personas and Cards
          $.ajax({
            type: "POST",
            url: "/buyer",
            data: postObj,
            success: function() {
              $.ajax({
                type: "POST",
                url: "/recipient",
                data: postObj
              });
            }
          });    

        } 
        else {
          console.log(' handleResponse failed');
          // change UI based off failed verification
          // this logic may be placed in the ajax call of /bp-create
        }
      }

      // data object BP needs to validate/create card
      var payload = {
        name: postObj.From,
        number: postObj.CreditCardNumber,
        expiration_month: postObj.ExpireMonth,
        expiration_year: '20'+postObj.ExpireYear,
        cvv: postObj.ExpireCVV,
        address: {
          postal_code: $('#expiredate_zip').val()
        }
      };

      // Create credit card
      balanced.card.create(payload, handleResponse);

    },
    amtfocus: function(event){
    	// blur background image and display "from" field with opacity
    	
    	var elem = event.currentTarget;
    	$('#clique_amt').hide();
    	$('#clique_amt_scrollwindow, span.rightarrow, span.leftarrow').show();
    },
    amtchoose: function(event){
    	var elem = $(event.currentTarget);
    	elem.parent().find('div').removeClass('active');
    	elem.addClass('active');
    	
    	
    	if(!$('#clique_from').is(':visible'))
    		$('#clique_from').slideDown(3000);
    		
    	/* hide logo
      	if($('#clique_logo').is(':visible'))
      		$('#clique_logo').slideUp(300);
      	*/
      	
    	$('#clique_amt_scrollwindow').hide();
    	$('#clique_amt').find('span.heart').html(elem.attr('name'));
    	$('#clique_amt').removeClass('currentinput').addClass('filledin').show();
    	if($('#clique_from').hasClass('nextinput'))
    		$('#clique_from').removeClass('nextinput').addClass('currentinput');
    		
    	$('.wrapper #localstreet img').addClass('blur');
    	$('span.rightarrow, span.leftarrow').hide();
    	
    	// add focus to "from" field
    	$('#clique_from').removeClass('inactive');
    	$('#clique_input_from').focus();
    }
});

var clique_view = new AppView({ el: $("#container") });

function checkCCInfo() {
	// display "Review Order" button if credit card information is entered
	var a = $('#expiredate_month').val(),
		b = $('#expiredate_year').val(),
		c = $('#expiredate_cvv').val(),
		d = $('#expiredate_zip').val(),
		e = $('#clique_input_creditcardnumber').val().toLowerCase();

    if(a && b && c && d && e && e.indexOf('x') == -1 && a != variables.clique_expiredatemonth_label && b != variables.clique_expiredateyear_label && c != variables.clique_expiredatecvv_label && d != variables.clique_expiredatezip_label) {
		// information has been entered for all payment fields, display "Review Order" button
        $('#clique_revieworder').show();
        var div = $('#clique_revieworder');
        var div2 = $('#clique_paymenttypeselectedcard');
        var height = div[0].scrollHeight + div2[0].scrollHeight;
        $('body').scrollTop(height);
        // $('#clique_revieworder').slideDown(1000);
	}
}

function convertMonth(m) {
	if(m == 1) {
		return 'Jan';
	} else if(m == 2) {
		return 'Feb';
	} else if(m == 3) {
		return 'Mar';
	} else if(m == 4) {
		return 'Apr';
	} else if(m == 5) {
		return 'May';
	} else if(m == 6) {
		return 'Jun';
	} else if(m == 7) {
		return 'Jul';
	} else if(m == 8) {
		return 'Aug';
	} else if(m == 9) {
		return 'Sep';
	} else if(m == 10) {
		return 'Oct';
	} else if(m == 11) {
		return 'Nov';
	} else if(m == 12) {
		return 'Dec';
	} else {
		return 'invalid month';
	}
}