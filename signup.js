/*HW9_signin of web2.0, qiangbo_14331229,group 11*/
/*the .js of the signin*/

$(document).ready(function () {

	var inputbotton = $('form div input');
	var submit = $('#submit');
	inputbotton.blur(Rexfun);

	$('#reset').click(clearfun); 
	$('form').submit(function () {
		inputbotton.blur();
		$('h2').html('');
		return checkfun();
	});

	var Rex = [/^[a-zA-Z]{1}[a-zA-Z_0-9]{5,17}$/, /^[1-9][0-9]{7}$/, /^[1-9][0-9]{10}$/, /^[a-zA-Z_0-9\-]+@(([a-zA-Z_0-9\-])+\.)+[a-zA-Z]{2,4}$/];
	var infom = ['The first one is the English letter(6~10bit)！',
	                   'The first one can\'t be number 0（8bit）！', 
					  'The first one can\'t be number 0（11bit）！',
					            'The E-mail address is not legal!'];


	function Rexfun () {
		var value = $(this).val(), i = inputbotton.index($(this));
 		var valid = Rex[i].test(value);
		var tip = "Down!";
		$(this).next().addClass('right');
		if (!valid) {
			tip = '?!' + infom[i];
			$(this).next().removeClass('right');
		}
		$(this).next().html(tip);
	}

	
	function clearfun () {
		inputbotton.prop('defaultValue', '');
		$('form p').html('');
		$('h2').html('');
	}

	
	function checkfun () {
		var valid = true;
		for (var i = 0; i < inputbotton.length; i++) {
			var value = inputbotton.eq(i).val(), tip = inputbotton.eq(i).next().html();
			if (value == "" || tip && tip != "Down!")
				valid = false;
		};
		return valid;
	}
});

