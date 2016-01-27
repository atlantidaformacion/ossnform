//<script>
/**
 * 	Open Source Social Network
 *
 * @package   (Informatikon.com).ossn
 * @author    OSSN Core Team <info@opensource-socialnetwork.org>
 * @copyright 2014 iNFORMATIKON TECHNOLOGIES
 * @license   General Public Licence http://www.opensource-socialnetwork.org/licence
 * @link      http://www.opensource-socialnetwork.org/licence
 */
var Ossn = Ossn || {};
Ossn.Startups = new Array();
/**
 * Register a startup function
 *
 * @return void
 */
Ossn.RegisterStartupFunction = function($func) {
	Ossn.Startups.push($func);
};
/**
 * Register a ajax request
 *
 * @param $data['form'] = form id
 *        $data['callback'] = call back function
 *        $data['error'] = on error function
 *        $data['beforeSend'] = before send function
 *        $data['url'] = form action url
 *
 * @return bool
 */
Ossn.ajaxRequest = function($data) {
	$(function() {
		var $form_name = $data['form'];
		var url = $data['url'];
		var callback = $data['callback'];
		var error = $data['error'];
		var befsend = $data['beforeSend'];
		var action = $data['action'];
		var containMedia = $data['containMedia'];
		var $xhr = $data['xhr'];
		if (url == true) {
			url = $($form_name).attr('action');
		}
		$($form_name).submit(function(event) {

			event.preventDefault();
			if (!callback) {
				return false;
			}
			if (!befsend) {
				befsend = function() {}
			}
			if (!action) {
				action = false;
			}
			if (action == true) {
				url = Ossn.AddTokenToUrl(url);
			}

			if (!error) {
				error = function(xhr, status, error) {
					if (error == 'Internal Server Error' || error !== '') {
						Ossn.MessageBox('syserror/unknown');
					}
				};
			}
			if (!$xhr) {
				$xhr = function() {
					var xhr = new window.XMLHttpRequest();
					return xhr;
				};
			}
			var $form = $(this);
			if (containMedia == true) {
				$vars = {
					xhr: $xhr,
					async: true,
					cache: false,
					contentType: false,
					type: 'post',
					beforeSend: befsend,
					url: url,
					error: error,
					data: new FormData($form[0]),
					processData: false,
					success: callback,
				};
			} else {
				$vars = {
					xhr: $xhr,
					async: true,
					type: 'post',
					beforeSend: befsend,
					url: url,
					error: error,
					data: $form.serialize(),
					success: callback,
				};
			}

			$.ajax($vars);
		});
	});
};
/**
 * Register a post request
 *
 * @param $data['callback'] = call back function
 *        $data['error'] = on error function
 *        $data['beforeSend'] = before send function
 *        $data['url'] = form action url
 *
 * @return bool
 */
Ossn.PostRequest = function($data) {
	var url = $data['url'];
	var callback = $data['callback'];
	var error = $data['error'];
	var befsend = $data['beforeSend'];
	var $fdata = $data['params'];
	var action = $data['action'];
	var $xhr = $data['xhr'];
	if (!callback) {
		return false;
	}
	if (!befsend) {
		befsend = function() {}
	}
	if (!action) {
		action = true;
	}
	if (action == true) {
		url = Ossn.AddTokenToUrl(url);
	}
	if (!error) {
		error = function() {};
	}
	if (!$xhr) {
		$xhr = function() {
			var xhr = new window.XMLHttpRequest();
			return xhr;
		};
	}
	$.ajax({
		xhr: $xhr,
		async: true,
		type: 'post',
		beforeSend: befsend,
		url: url,
		error: error,
		data: $fdata,
		success: callback,
	});
};
/**
 * Message done
 *
 * @param $message = message
 *
 * @return mix data
 */
Ossn.MessageDone = function($message) {
	return "<div class='ossn-message-done'>" + $message + "</div>";
};
/**
 * Redirect user to other page
 *
 * @param $url = path
 *
 * @return void
 */
Ossn.redirect = function($url) {
	window.location = Ossn.site_url + $url;
};
/**
 * Setup a profile cover buttons
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.profile-cover').hover(function() {
			$('.profile-cover-controls').find('a').show();
		}, function() {
			$('.profile-cover-controls').find('a').hide();
		});
	});
});
/**
 * Setup a profile photo buttons
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.profile-photo').hover(function() {
			$('.upload-photo').slideDown();
		}, function() {
			$('.upload-photo').slideUp();
		});
	});
});
/**
 * Setup ajax request for user register
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	Ossn.ajaxRequest({
		url: Ossn.site_url + "action/user/register",
		form: '#ossn-home-signup',

		beforeSend: function(request) {
			var failedValidate = false;
			$('#ossn-submit-button').show();
			$('#ossn-home-signup .ossn-loading').addClass("ossn-hidden");

			$('#ossn-home-signup').find('#ossn-signup-errors').hide();
			$('#ossn-home-signup input').filter(function() {
				$(this).closest('span').removeClass('ossn-required');
				if (this.type == 'radio') {
					if (!$("input[name='gender']:checked").val()) {
						$(this).closest('span').addClass('ossn-required');
						failedValidate = true;
					}
				}
				if (this.value == "") {
					$(this).addClass('ossn-red-borders');
					failedValidate = true;
					request.abort();
					return false;
				}
			});
			if (failedValidate == false) {
				$('#ossn-submit-button').hide();
				$('#ossn-home-signup .ossn-loading').removeClass("ossn-hidden");
			}
		},
		callback: function(callback) {
			if (callback['dataerr']) {
				$('#ossn-home-signup').find('#ossn-signup-errors').html(callback['dataerr']).fadeIn();
				$('#ossn-submit-button').show();
				$('#ossn-home-signup .ossn-loading').addClass("ossn-hidden");
			} else if (callback['success'] == 1) {
				$('#ossn-home-signup').html(Ossn.MessageDone(callback['datasuccess']));
			} else {
				$('#ossn-home-signup .ossn-loading').addClass("ossn-hidden");
				$('#ossn-submit-button').attr('type', 'submit')
				$('#ossn-submit-button').attr('style', 'opacity:1;');
			}
		}
	});
});
/**
 * Setup system messages
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		if ($('.ossn-system-messages').find('a').length) {
			$('.ossn-system-messages').find('.ossn-system-messages-inner').show();
			$('.ossn-system-messages').find('.ossn-system-messages-inner').animate({
				opacity: 0.9
			}, 10000, function() {
				$('.ossn-system-messages').find('.ossn-system-messages-inner').empty();
			}).slideUp('slow');
		}
	});
});
/**
 * Add a system messages for users
 *
 * @param string $messages Message for user
 * @param string $type Message type success (default) or error
 *
 * @return void
 */
Ossn.trigger_message = function($message, $type) {
	$type = $type || 'success';
	if ($type == 'error') {
		//compitable to bootstrap framework
		$type = 'danger';
	}
	if ($message == '') {
		return false;
	}
	$html = "<div class='alert alert-" + $type + "'><a href=\"#\" class=\"close\" data-dismiss=\"alert\">&times;</a>" + $message + "</div>";
	$('.ossn-system-messages').find('.ossn-system-messages-inner').append($html);
	if ($('.ossn-system-messages').find('.ossn-system-messages-inner').is(":not(:visible)")) {
		$('.ossn-system-messages').find('.ossn-system-messages-inner').slideDown('slow');
	}
	$('.ossn-system-messages').find('.ossn-system-messages-inner').animate({
		opacity: 0.9
	}, 10000, function() {
		$('.ossn-system-messages').find('.ossn-system-messages-inner').empty();
	}).slideUp('slow');
};

/**
 * Topbar dropdown button
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.ossn-topbar-dropdown-menu-button').click(function() {
			if ($('.ossn-topbar-dropdown-menu-content').is(":not(:visible)")) {
				$('.ossn-topbar-dropdown-menu-content').show();
			} else {
				$('.ossn-topbar-dropdown-menu-content').hide();
			}
		});

	});
});
/**
 * Show exception on component delete
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		//show a confirmation mssage before delete component #444
		$('.ossn-com-delete-button').click(function(e) {
			e.preventDefault();
			var del = confirm(Ossn.Print('ossn:component:delete:exception'));
			if (del == true) {
				var actionurl = $(this).attr('href');
				window.location = actionurl;
			}
		});
	});
});
/**
 * Show exception , are you sure?
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.ossn-make-sure').click(function(e) {
			e.preventDefault();
			var del = confirm(Ossn.Print('ossn:exception:make:sure'));
			if (del == true) {
				var actionurl = $(this).attr('href');
				window.location = actionurl;
			}
		});
	});
});
/**
 * Show exception on user delete
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.userdelete').click(function(e) {
			e.preventDefault();
			var del = confirm(Ossn.Print('ossn:user:delete:exception'));
			if (del == true) {
				var actionurl = $(this).attr('href');
				window.location = actionurl;
			}

		});
	});
});
/**
 * Close a Ossn message box
 *
 * @return void
 */
Ossn.MessageBoxClose = function() {
	$('.ossn-message-box').hide();
	$('.ossn-halt').removeClass('ossn-light').hide();
	$('.ossn-halt').attr('style', '');

};
/**
 * Load Message box
 *
 * @return void
 */
Ossn.MessageBox = function($url) {
	Ossn.PostRequest({
		url: Ossn.site_url + $url,
		beforeSend: function() {
			$('.ossn-halt').addClass('ossn-light');
			$('.ossn-halt').attr('style', 'height:' + $(document).height() + 'px;');
			$('.ossn-halt').show();
			$('.ossn-message-box').html('<div class="ossn-loading ossn-box-loading"></div>');
			$('.ossn-message-box').fadeIn('slow');
		},
		callback: function(callback) {
			$('.ossn-message-box').html(callback).fadeIn();
		},
	});

};
/**
 * Load a media viewer
 *
 * @return void
 */
Ossn.Viewer = function($url) {
	Ossn.PostRequest({
		url: Ossn.site_url + $url,

		beforeSend: function() {
			$('.ossn-halt').removeClass('ossn-light');
			$('.ossn-halt').show();
			$('.ossn-viewer').html('<table class="ossn-container"><tr><td class="image-block" style="text-align: center;width:100%;"><div class="ossn-viewer-loding">Loading...</div></td></tr></table>');
			$('.ossn-viewer').show();
		},
		callback: function(callback) {
			$('.ossn-viewer').html(callback).show();
		},
	});
};
/**
 * Close a media viewer
 *
 * @return void
 */
Ossn.ViewerClose = function($url) {
	$('.ossn-halt').addClass('ossn-light');
	$('.ossn-halt').hide();
	$('.ossn-viewer').html('');
	$('.ossn-viewer').hide();
};
/**
 * Click on element
 *
 * @param $elem = element;
 *
 * @return void
 */
Ossn.Clk = function($elem) {
	$($elem).click();
};
/**
 * Get url paramter
 *
 * @param name Parameter name;
 *        url complete url
 *
 * @return string
 */
Ossn.UrlParams = function(name, url) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
	if (!results) {
		return 0;
	}
	return results[1] || 0;
};
/**
 * Returns an object with key/values of the parsed query string.
 *
 * @param  {String} string The string to parse
 * @return {Object} The parsed object string
 */
Ossn.ParseStr = function(string) {
	var params = {},
		result,
		key,
		value,
		re = /([^&=]+)=?([^&]*)/g,
		re2 = /\[\]$/;

	while (result = re.exec(string)) {
		key = decodeURIComponent(result[1].replace(/\+/g, ' '));
		value = decodeURIComponent(result[2].replace(/\+/g, ' '));

		if (re2.test(key)) {
			key = key.replace(re2, '');
			if (!params[key]) {
				params[key] = [];
			}
			params[key].push(value);
		} else {
			params[key] = value;
		}
	}

	return params;
};
/**
 * Parse a URL into its parts. Mimicks http://php.net/parse_url
 *
 * @param {String} url       The URL to parse
 * @param {Int}    component A component to return
 * @param {Bool}   expand    Expand the query into an object? Else it's a string.
 *
 * @return {Object} The parsed URL
 */
Ossn.ParseUrl = function(url, component, expand) {
	// Adapted from http://blog.stevenlevithan.com/archives/parseuri
	// which was release under the MIT
	// It was modified to fix mailto: and javascript: support.
	expand = expand || false;
	component = component || false;

	var re_str =
		// scheme (and user@ testing)
		'^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?://)?'

		// possibly a user[:password]@
		+ '((?:(([^:@]*)(?::([^:@]*))?)?@)?'
		// host and port
		+ '([^:/?#]*)(?::(\\d*))?)'
		// path
		+ '(((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[?#]|$)))*/?)?([^?#/]*))'
		// query string
		+ '(?:\\?([^#]*))?'
		// fragment
		+ '(?:#(.*))?)',
		keys = {
			1: "scheme",
			4: "user",
			5: "pass",
			6: "host",
			7: "port",
			9: "path",
			12: "query",
			13: "fragment"
		},
		results = {};

	if (url.indexOf('mailto:') === 0) {
		results['scheme'] = 'mailto';
		results['path'] = url.replace('mailto:', '');
		return results;
	}

	if (url.indexOf('javascript:') === 0) {
		results['scheme'] = 'javascript';
		results['path'] = url.replace('javascript:', '');
		return results;
	}

	var re = new RegExp(re_str);
	var matches = re.exec(url);

	for (var i in keys) {
		if (matches[i]) {
			results[keys[i]] = matches[i];
		}
	}

	if (expand && typeof(results['query']) != 'undefined') {
		results['query'] = ParseStr(results['query']);
	}

	if (component) {
		if (typeof(results[component]) != 'undefined') {
			return results[component];
		} else {
			return false;
		}
	}
	return results;
};
/**
 * Add action token to url
 *
 * @param string data Full complete url
 */
Ossn.AddTokenToUrl = function(data) {
	// 'http://example.com?data=sofar'
	if (typeof data === 'string') {
		// is this a full URL, relative URL, or just the query string?
		var parts = Ossn.ParseUrl(data),
			args = {},
			base = '';

		if (parts['host'] === undefined) {
			if (data.indexOf('?') === 0) {
				// query string
				base = '?';
				args = Ossn.ParseStr(parts['query']);
			}
		} else {
			// full or relative URL
			if (parts['query'] !== undefined) {
				// with query string
				args = Ossn.ParseStr(parts['query']);
			}
			var split = data.split('?');
			base = split[0] + '?';
		}
		args["ossn_ts"] = Ossn.Config.token.ossn_ts;
		args["ossn_token"] = Ossn.Config.token.ossn_token;

		return base + jQuery.param(args);
	}
};
/**
 * sprintf() for JavaScript 0.7-beta1
 * http://www.diveintojavascript.com/projects/javascript-sprintf
 */
var sprintf = (function() {
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}

	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) { /* do nothing */ }
		return output.join('');
	}

	var str_format = function() {
		if (!str_format.cache.hasOwnProperty(arguments[0])) {
			str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
		}
		return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
	};

	str_format.format = function(parse_tree, argv) {
		var cursor = 1,
			tree_length = parse_tree.length,
			node_type = '',
			arg, output = [],
			i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			} else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw (sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				} else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				} else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw (sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch (match[8]) {
					case 'b':
						arg = arg.toString(2);
						break;
					case 'c':
						arg = String.fromCharCode(arg);
						break;
					case 'd':
						arg = parseInt(arg, 10);
						break;
					case 'e':
						arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
						break;
					case 'f':
						arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
						break;
					case 'o':
						arg = arg.toString(8);
						break;
					case 's':
						arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
						break;
					case 'u':
						arg = Math.abs(arg);
						break;
					case 'x':
						arg = arg.toString(16);
						break;
					case 'X':
						arg = arg.toString(16).toUpperCase();
						break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+' + arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	str_format.cache = {};

	str_format.parse = function(fmt) {
		var _fmt = fmt,
			match = [],
			parse_tree = [],
			arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			} else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			} else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [],
						replacement_field = match[2],
						field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							} else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							} else {
								throw ('[sprintf] huh?');
							}
						}
					} else {
						throw ('[sprintf] huh?');
					}
					match[2] = field_list;
				} else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw ('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			} else {
				throw ('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	return str_format;
})();

var vsprintf = function(fmt, argv) {
	argv.unshift(fmt);
	return sprintf.apply(null, argv);
};
/**
 * Ossn Print
 * Print a langauge string
 */
Ossn.Print = function(str, args) {
	if (OssnLocale[str]) {
		if (!args) {
			return OssnLocale[str];
		} else {
			return vsprintf(OssnLocale[str], args);
		}
	}
	return str;
};
/**
 * Get a available update version
 * 
 * @added in v3.0 
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		if ($('.avaiable-updates').length) {
			Ossn.PostRequest({
				url: Ossn.site_url + "administrator/version",
				action: false,
				callback: function(callback) {
					if (callback['version']) {
						$('.avaiable-updates').html(callback['version']);
					}
				}
			});
		}
	});
});
/**
 * Initialize ossn startup functions
 *
 * @return void
 */
Ossn.Init = function() {
	for (var i = 0; i <= Ossn.Startups.length; i++) {
		if (typeof Ossn.Startups[i] !== "undefined") {
			Ossn.Startups[i]();
		}
	}
};//<script>
$(document).ready(function() {
	$(document).on('click', '#sidebar-toggle', function() {
		var $toggle = $(this).attr('data-toggle');
		if ($toggle == 0) {
			$(this).attr('data-toggle', 1);
			$('.sidebar').addClass('sidebar-open');
			$('.ossn-page-container').addClass('sidebar-open-page-container');
			$('.topbar .right-side').addClass('right-side-space');
			$('.topbar .right-side').addClass('sidebar-hide-contents-xs');
			$('.ossn-inner-page').addClass('sidebar-hide-contents-xs');
		}
		if ($toggle == 1) {
			$(this).attr('data-toggle', 0);
			$('.sidebar').removeClass('sidebar-open');
			$('.ossn-page-container').removeClass('sidebar-open-page-container');
			$('.topbar .right-side').removeClass('right-side-space');
			$('.topbar .right-side').removeClass('sidebar-hide-contents-xs');
			$('.ossn-inner-page').removeClass('sidebar-hide-contents-xs');

			$('.topbar .right-side').addClass('right-side-nospace');
			$('.sidebar').addClass('sidebar-close');
			$('.ossn-page-container').addClass('sidebar-close-page-container');

		}
		var document_height = $(document).height();
		$(".sidebar").height(document_height);
	});
	var $chatsidebar = $('.ossn-chat-windows-long .inner');
	if($chatsidebar.length){
		$chatsidebar.css('height', $(window).height() - 45);
	}
	$(document).scroll(function() {
		if($chatsidebar.length){
			if ($(document).scrollTop() >= 50) {
				$chatsidebar.addClass('ossnchat-scroll-top');
				$chatsidebar.css('height', $(window).height());
			} else if ($(document).scrollTop() == 0) {
				$chatsidebar.removeClass('ossnchat-scroll-top');
				$chatsidebar.css('height', $(window).height() - 45);
			}
		}
	});
});
/**
 * Open Source Social Network
 *
 * @package   (Informatikon.com).ossn
 * @author    OSSN Core Team <info@opensource-socialnetwork.org>
 * @copyright 2014 iNFORMATIKON TECHNOLOGIES
 * @license   General Public Licence http://www.opensource-socialnetwork.org/licence
 * @link      http://www.opensource-socialnetwork.org/licence
 */
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		var cYear = (new Date).getFullYear();
		$("input[name='birthdate']").datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: 'dd/mm/yy',
			yearRange: '1950:' + cYear,
		});
		/**
		 * Reposition cover
		 */
		$('#reposition-cover').click(function() {
			$('#profile-menu').hide();
			$('#cover-menu').show();
			$(function() {
				$.globalVars = {
					originalTop: 0,
					originalLeft: 0,
					maxHeight: $("#draggable").height() - $("#container").height(),
					maxWidth: $("#draggable").width() - $("#container").width()
				};
				$("#draggable").draggable({
					start: function(event, ui) {
						if (ui.position != undefined) {
							$.globalVars.originalTop = ui.position.top;
							$.globalVars.originalLeft = ui.position.left;
						}
					},
					drag: function(event, ui) {
						var newTop = ui.position.top;
						var newLeft = ui.position.left;
						if (ui.position.top < 0 && ui.position.top * -1 > $.globalVars.maxHeight) {
							newTop = $.globalVars.maxHeight * -1;
						}
						if (ui.position.top > 0) {
							newTop = 0;
						}
						if (ui.position.left < 0 && ui.position.left * -1 > $.globalVars.maxWidth) {
							newLeft = $.globalVars.maxWidth * -1;
						}
						if (ui.position.left > 0) {
							newLeft = 0;
						}
						ui.position.top = newTop;
						ui.position.left = newLeft;

						Ossn.ProfileCover_top = newTop;
						Ossn.ProfileCover_left = newLeft;
					}
				});
			});
		});
		$("#upload-photo").submit(function(event) {
			event.preventDefault();
			var formData = new FormData($(this)[0]);
			var $url = Ossn.site_url + 'action/profile/photo/upload';
			$.ajax({
				url: Ossn.AddTokenToUrl($url),
				type: 'POST',
				data: formData,
				async: true,
				beforeSend: function() {
					$('.upload-photo').attr('class', 'user-photo-uploading');
				},
				error: function(xhr, status, error) {
					if (error == 'Internal Server Error' || error !== '') {
						Ossn.MessageBox('syserror/unknown');
					}
				},
				cache: false,
				contentType: false,
				processData: false,
				success: function(callback) {
					$time = $.now();
					$('.user-photo-uploading').attr('class', 'upload-photo').hide();
					$imageurl = $('.profile-photo').find('img').attr('src') + '?' + $time;
					$('.profile-photo').find('img').attr('src', $imageurl);
					$topbar_icon_url = $('.ossn-topbar-menu').find('img').attr('src') + '?' + $time;
					$('.ossn-topbar-menu').find('img').attr('src', $topbar_icon_url);
				}
			});

			return false;
		});

		$("#upload-cover").submit(function(event) {
			event.preventDefault();
			var formData = new FormData($(this)[0]);
			var $url = Ossn.site_url + 'action/profile/cover/upload';
			$.ajax({
				url: Ossn.AddTokenToUrl($url),
				type: 'POST',
				data: formData,
				async: true,
				cache: false,
				contentType: false,
				processData: false,
				beforeSend: function(xhr, obj) {
					$('.profile-cover-img').attr('class', 'user-cover-uploading');

					var fileInput = $('#upload-cover').find("input[type=file]")[0],
						file = fileInput.files && fileInput.files[0];

					if (file) {
						var img = new Image();

						img.src = window.URL.createObjectURL(file);

						img.onload = function() {
							var width = img.naturalWidth,
								height = img.naturalHeight;

							window.URL.revokeObjectURL(img.src);
							if (width < 850 || height < 300) {
								xhr.abort();
								Ossn.trigger_message(Ossn.Print('profile:cover:err1:detail'), 'error');
								return false;
							}
						};
					}
				},
				success: function(callback) {
					$time = $.now();
					$('.profile-cover').find('img').removeClass('user-cover-uploading');
					$imageurl = $('.profile-cover').find('img').attr('src') + '?' + $time;
					$('.profile-cover').find('img').attr('src', $imageurl);
					$('.profile-cover').find('img').attr('style', '');
				},
			});
			return false;
		});

		/* Profile extra menu */
		$('#profile-extra-menu').on('click', function() {
			$div = $('.ossn-profile-extra-menu').find('div');
			if ($div.is(":not(:visible)")) {
				$div.show();
			} else {
				$div.hide();
			}
		});
	});

});

Ossn.repositionCOVER = function() {
	var $pcover_top = $('.profile-cover-img').css('top');
	var $pcover_left = $('.profile-cover-img').css('left');
	$url = Ossn.site_url + "action/profile/cover/reposition";
	$.ajax({
		async: true,
		type: 'post',
		data: '&top=' + $pcover_top + '&left=' + $pcover_left,
		url: Ossn.AddTokenToUrl($url),
		success: function(callback) {
			$('#profile-menu').show();
			$('#cover-menu').hide();
			$("#draggable").draggable({
				drag: function() {
					return false;
				}
			});
		},
	});
};/**
 * 	Open Source Social Network
 *
 * @package   (Informatikon.com).ossn
 * @author    OSSN Core Team <info@opensource-socialnetwork.org>
 * @copyright 2014 iNFORMATIKON TECHNOLOGIES
 * @license   General Public Licence http://www.opensource-socialnetwork.org/licence 
 * @link      http://www.opensource-socialnetwork.org/licence
 */
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
        $('.ossn-wall-container').find('.ossn-wall-friend').click(function() {
            $('#ossn-wall-location').hide();
            $('#ossn-wall-photo').hide();
            $('#ossn-wall-friend').show();
        });
        $('.ossn-wall-container').find('.ossn-wall-location').click(function() {
            $('#ossn-wall-friend').hide();
            $('#ossn-wall-photo').hide();
            $('#ossn-wall-location').show();
        });
        $('.ossn-wall-container').find('.ossn-wall-photo').click(function() {
            $('#ossn-wall-friend').hide();
            $('#ossn-wall-location').hide();
            $('#ossn-wall-photo').show();

        });
        
        $('.ossn-wall-post-delete').click(function(e) {
            $url = $(this);
            e.preventDefault();
            Ossn.PostRequest({
                url: $url.attr('href'),
                beforeSend: function(request) {
                    $('#activity-item-' + $url.attr('data-guid')).attr('style', 'opacity:0.5;');
                },
                callback: function(callback) {
                    if (callback == 1) {
                        $('#activity-item-' + $url.attr('data-guid')).fadeOut();
                        $('#activity-item-' + $url.attr('data-guid')).remove();
                    } else {
                        $('#activity-item-' + $url.attr('data-guid')).attr('style', 'opacity:1;');
                    }
                }
            });
        });
        
     	$('body').delegate('.ossn-wall-post-edit', 'click', function(){
        	var $dataguid = $(this).attr('data-guid');
            Ossn.MessageBox('post/edit/'+$dataguid);
        });       
    });
    
});
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
        if ($.isFunction($.fn.tokenInput)) {
            $("#ossn-wall-friend-input").tokenInput(Ossn.site_url + "friendpicker", {
                placeholder: Ossn.Print('tag:friends'),
                hintText: false,
                propertyToSearch: "first_name",
                resultsFormatter: function(item) {
                    return "<li>" + "<img src='" + item.imageurl + "' title='" + item.first_name + " " + item.last_name + "' height='25px' width='25px' />" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name' style='font-weight:bold;color:#2B5470;'>" + item.first_name + " " + item.last_name + "</div></div></li>"
                },
                tokenFormatter: function(item) {
                    return "<li><p>" + item.first_name + " " + item.last_name + "</p></li>"
                },
            });
        }
    });
});
Ossn.PostMenu = function($id) {
    $element = $($id).find('.menu-links');
    if ($element.is(":not(:visible)")) {
        $element.show();
    } else {
        $element.hide();
    }
};
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
        $('.ossn-wall-privacy').on('click', function(e) {
            Ossn.MessageBox('post/privacy');
        });
        $('#ossn-wall-privacy').on('click', function(e) {
            var wallprivacy = $('#ossn-wall-privacy-container').find('input[name="privacy"]:checked').val();
            $('#ossn-wall-privacy').val(wallprivacy);
            Ossn.MessageBoxClose();
        });
        //ajax post
        $url = $('#ossn-wall-form').attr('action');
        Ossn.ajaxRequest({
            url: $url,
            action: true,
            containMedia: true,
            form: '#ossn-wall-form',

            beforeSend: function(request) {
                $('#ossn-wall-form').find('input[type=submit]').hide();
                $('#ossn-wall-form').find('.ossn-loading').removeClass('ossn-hidden');            
            },
            callback: function(callback) {
                if (callback['success']) {
                    Ossn.trigger_message(callback['success']);
                    if (callback['data']['post']) {
                        $('.user-activity').prepend(callback['data']['post']).fadeIn();
                    }
                }
                if (callback['error']) {
                    Ossn.trigger_message(callback['error'], 'error');
                }
                
                //need to clear file path after uploading the file #626
                var $file = $("#ossn-wall-form").find("input[type='file']");
                $file.replaceWith($file.val('').clone(true));
                
                //Tagged friend(s) and location should be cleared, too - after posting #641
                $("#ossn-wall-location-input").val('');
                $(".token-input-list").find('.token-input-token').remove();
                $('#ossn-wall-friend-input').val('');
                                              
                $('#ossn-wall-form').find('input[type=submit]').show();
                $('#ossn-wall-form').find('.ossn-loading').addClass('ossn-hidden');
                $('#ossn-wall-form').find('textarea').val("");
            }
        });
    });

});
/**
 * Setup Google Location input
 *
 * @return void
 */
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
        if ($('#ossn-wall-location-input').length) {
            var autocomplete;
            if (typeof google === 'object') {
                autocomplete = new google.maps.places.Autocomplete(
                    /** @type {HTMLInputElement} */
                    (document.getElementById('ossn-wall-location-input')), {
                        types: ['geocode']
                    });
                google.maps.event.addListener(autocomplete, 'place_changed', function() {});
            }
        }
    });
});/**
 * Open Source Social Network
 *
 * @packageOpen Source Social Network
 * @author    Open Social Website Core Team <info@informatikon.com>
 * @copyright 2014 iNFORMATIKON TECHNOLOGIES
 * @license   General Public Licence http://www.opensource-socialnetwork.org/licence
 * @link      http://www.opensource-socialnetwork.org/licence
 */
Ossn.PostComment = function($container) {
    Ossn.ajaxRequest({
        url: Ossn.site_url + 'action/post/comment',
        form: '#comment-container-' + $container,
        beforeSend: function(request) {
            $('#comment-box-' + $container).attr('readonly', 'readonly');
        },
        callback: function(callback) {
            if (callback['process'] == 1) {
                $('#comment-box-' + $container).removeAttr('readonly');
                $('#comment-box-' + $container).val('');
                $('.ossn-comments-list-' + $container).append(callback['comment']);
                $('#comment-attachment-container-' + $container).hide();
                $('#ossn-comment-attachment-' + $container).find('.image-data').html('');
                //commenting pic followed by text gives warnings #664 $dev.githubertus
                $('#comment-container-' + $container).find('input[name="comment-attachment"]').val('');
            }
            if (callback['process'] == 0) {
                $('#comment-box-' + $container).removeAttr('readonly');
                Ossn.MessageBox('syserror/unknown');
            }
        }
    });
};
Ossn.EntityComment = function($container) {
    Ossn.ajaxRequest({
        url: Ossn.site_url + 'action/post/entity/comment',
        form: '#comment-container-' + $container,
        beforeSend: function(request) {
            $('#comment-box-' + $container).attr('readonly', 'readonly');
        },
        callback: function(callback) {
            if (callback['process'] == 1) {
                $('#comment-box-' + $container).removeAttr('readonly');
                $('#comment-box-' + $container).val('');
                $('.ossn-comments-list-' + $container).append(callback['comment']);
                $('#comment-attachment-container-' + $container).hide();
                $('#ossn-comment-attachment-' + $container).find('.image-data').html('');
                $('#comment-container-' + $container).find('input[name="comment-attachment"]').val('');
            }
            if (callback['process'] == 0) {
                $('#comment-box-' + $container).removeAttr('readonly');
                Ossn.MessageBox('syserror/unknown');
            }
        }
    });
};
Ossn.CommentMenu = function($id) {
    $element = $($id).find('.menu-links');
    if ($element.is(":not(:visible)")) {
        $element.show();
        $($id).find('.drop-down-arrow').attr('style', 'display:block;');
    } else {
        $element.hide();
        $($id).find('.drop-down-arrow').attr('style', '');
    }
};
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
        $(document).delegate('.ossn-delete-comment', 'click', function(e) {
            e.preventDefault();
            $comment = $(this);
            $url = $comment.attr('href');
            $comment_id = Ossn.UrlParams('comment', $url);

            Ossn.PostRequest({
                url: $url,
                action: false,
                beforeSend: function() {
                    $('#comments-item-' + $comment_id).attr('style', 'opacity:0.6;');
                },
                callback: function(callback) {
                    if (callback == 1) {
                        $('#comments-item-' + $comment_id).fadeOut().remove();
                    }
                    if (callback == 0) {
                        $('#comments-item-' + $comment_id).attr('style', 'opacity:0.6;');
                    }
                }
            });
        });
    });
});
Ossn.CommentImage = function($container) {
    $(document).ready(function() {
        $("#ossn-comment-image-file-" + $container).on('change', function(event) {
            event.preventDefault();
            var formData = new FormData($('#ossn-comment-attachment-' + $container)[0]);
            $.ajax({
                url: Ossn.site_url + 'comment/attachment',
                type: 'POST',
                data: formData,
                async: true,
                beforeSend: function() {
                    $('#ossn-comment-attachment-' + $container).find('.image-data')
                        .html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" style="width:30px;border:none;" />');
                    $('#comment-attachment-container-' + $container).show();

                },
                cache: false,
                contentType: false,
                processData: false,
                success: function(callback) {
                    if (callback['type'] == 1) {
                        $('#comment-container-' + $container).find('input[name="comment-attachment"]').val(callback['file']);
                        $('#ossn-comment-attachment-' + $container).find('.image-data')
                            .html('<img src="' + Ossn.site_url + 'comment/staticimage?image=' + callback['file'] + '" />');
                    }
                    if (callback['type'] == 0) {
                        $('#comment-container-' + $container).find('input[name="comment-attachment"]').val('');
                        $('#comment-attachment-container-' + $container).hide();
                        Ossn.MessageBox('syserror/unknown');
                    }

                },
            });

        });
    });

};
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
    	$('body').delegate('.comment-post', 'click', function(){
        	var $guid = $(this).attr('data-guid');
            if($guid){
            	$("#comment-box-"+$guid).focus();
            }
        });
    	$('body').delegate('.ossn-edit-comment', 'click', function(){
        	var $dataguid = $(this).attr('data-guid');
            Ossn.MessageBox('comment/edit/'+$dataguid);
        });        
    });
});
/**
 * Open Source Social Network
 *
 * @packageOpen Source Social Network
 * @author    Open Social Website Core Team <info@informatikon.com>
 * @copyright 2014 iNFORMATIKON TECHNOLOGIES
 * @license   General Public Licence http://www.opensource-socialnetwork.org/licence
 * @link      http://www.opensource-socialnetwork.org/licence
 */
Ossn.ViewLikes = function($post, $type) {
    if (!$type) {
        $type = 'post';
    }
    Ossn.MessageBox('likes/view?guid=' + $post + '&type=' + $type);
};

Ossn.PostUnlike = function(post) {
    Ossn.PostRequest({
        url: Ossn.site_url + 'action/post/unlike',
        beforeSend: function() {
            $('#ossn-like-' + post).html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
        },
        params: '&post=' + post,
        callback: function(callback) {
            if (callback['done'] !== 0) {
                $('#ossn-like-' + post).html(callback['button']);
                $('#ossn-like-' + post).attr('onclick', 'Ossn.PostLike(' + post + ');');
            } else {
                $('#ossn-like-' + post).html(Ossn.Print('unlike'));
            }
        },
    });

};
Ossn.PostLike = function(post) {
    Ossn.PostRequest({
        url: Ossn.site_url + 'action/post/like',
        beforeSend: function() {
            $('#ossn-like-' + post).html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
        },
        params: '&post=' + post,
        callback: function(callback) {
            if (callback['done'] !== 0) {
                $('#ossn-like-' + post).html(callback['button']);
                $('#ossn-like-' + post).attr('onClick', 'Ossn.PostUnlike(' + post + ');');
            } else {
                $('#ossn-like-' + post).html(Ossn.Print('like'));
            }
        },
    });

};

Ossn.EntityUnlike = function(entity) {
    Ossn.PostRequest({
        url: Ossn.site_url + 'action/post/unlike',
        beforeSend: function() {
            $('#ossn-like-' + entity).html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
        },
        params: '&entity=' + entity,
        callback: function(callback) {
            if (callback['done'] !== 0) {
                $('#ossn-like-' + entity).html(callback['button']);
                $('#ossn-like-' + entity).attr('onclick', 'Ossn.EntityLike(' + entity + ');');
            } else {
                $('#ossn-like-' + entity).html(Ossn.Print('unlike'));
            }
        },
    });

};
Ossn.EntityLike = function(entity) {
    Ossn.PostRequest({
        url: Ossn.site_url + 'action/post/like',
        beforeSend: function() {
            $('#ossn-like-' + entity).html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
        },
        params: '&entity=' + entity,
        callback: function(callback) {
            if (callback['done'] !== 0) {
                $('#ossn-like-' + entity).html(callback['button']);
                $('#ossn-like-' + entity).attr('onClick', 'Ossn.EntityUnlike(' + entity + ');');
            } else {
                $('#ossn-like-' + post).html(Ossn.Print('like'));
            }
        },
    });

};
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
        $(document).delegate('.ossn-like-comment', 'click', function(e) {
            e.preventDefault();
            var $item = $(this);
            var $type = $.trim($item.attr('data-type'));
            var $url = $item.attr('href');
            Ossn.PostRequest({
                url: $url,
                action: false,
                beforeSend: function() {
                    $item.html('<img src="' + Ossn.site_url + 'components/OssnComments/images/loading.gif" />');
                },
                callback: function(callback) {
                    if (callback['done'] == 1) {
                        $total_guid = Ossn.UrlParams('annotation', $url);
                        $total = $('.ossn-total-likes-' + $total_guid).attr('data-likes');
                        if ($type == 'Like') {
                            $item.html(Ossn.Print('unlike'));
                            $item.attr('data-type', 'Unlike');                            
                            var unlike = $url.replace("like", "unlike");
                            $item.attr('href', unlike);
                            $total_likes = $total;
                            $total_likes++;
                            $('.ossn-total-likes-' + $total_guid).attr('data-likes', $total_likes);
                            $('.ossn-total-likes-' + $total_guid).html('<i class="fa fa-thumbs-up"></i>' + $total_likes);
                        }
                        if ($type == 'Unlike') {
                            $item.html(Ossn.Print('like'));
                            $item.attr('data-type', 'Like');                            
                            var like = $url.replace("unlike", "like");
                            $item.attr('href', like);
                            if ($total > 1) {
                                $like_remove = $total;
                                0
                                $like_remove--;
                                $('.ossn-total-likes-' + $total_guid).attr('data-likes', $like_remove);
                                $('.ossn-total-likes-' + $total_guid).html('<i class="fa fa-thumbs-up"></i>' + $like_remove);
                            }
                            if ($total == 1) {
                                $('.ossn-total-likes-' + $total_guid).attr('data-likes', 0);
                                $('.ossn-total-likes-' + $total_guid).html('');

                            }
                        }
                    }
                    if (callback['done'] == 0) {
                        if ($type == 'Like') {
                            $item.html(Ossn.Print('like'));
                            $item.attr('data-type', 'Like');
                            Ossn.MessageBox('syserror/unknown');
                        }
                        if ($type == 'Unlike') {
                            $item.html(Ossn.Print('unlike'));
                            $item.attr('data-type', 'Unlike');
                            Ossn.MessageBox('syserror/unknown');

                        }
                    }
                },
            });
        });
    });
});
/**
 * 	Open Source Social Network
 *
 * @package   (Informatikon.com).ossn
 * @author    OSSN Core Team <info@opensource-socialnetwork.org>
 * @copyright 2014 iNFORMATIKON TECHNOLOGIES
 * @license   General Public Licence http://www.opensource-socialnetwork.org/licence 
 * @link      http://www.opensource-socialnetwork.org/licence
 */
Ossn.RegisterStartupFunction(function(){
   $(document).ready(function(){
	     $('#ossn-add-album').click(function(){
                      Ossn.MessageBox('album/add');
         }); 
          $('#album-add').click(function(){
                      Ossn.MessageBox('album/add');
           }); 
         $('#ossn-add-photos').click(function(){
                      $dataurl = $(this).attr('data-url');
                      Ossn.MessageBox('photos/add'+$dataurl);
         }); 
	});
});//<script>
/**
 * 	Open Source Social Network
 *
 * @package   (Informatikon.com).ossn
 * @author    OSSN Core Team <info@opensource-socialnetwork.org>
 * @copyright 2014 iNFORMATIKON TECHNOLOGIES
 * @license   General Public Licence http://www.opensource-socialnetwork.org/licence
 * @link      http://www.opensource-socialnetwork.org/licence
 */
Ossn.NotificationBox = function($title, $meta, $type, height, $extra) {
	//trigger notification box again:
  	Ossn.NotificationsCheck();
    
    $extra = $extra || '';
    if (height == '') {
        //height = '540px';
    }
    if ($type) {
        $('.selected').addClass($type);
    }
    if ($title) {
        $('.ossn-notifications-box').show()
        $('.ossn-notifications-box').find('.type-name').html($title+$extra);
    }
    if ($meta) {
        $('.ossn-notifications-box').find('.metadata').html($meta);
        $('.ossn-notifications-box').css('height', height);
    }
};
Ossn.NotificationBoxClose = function() {
    $('.ossn-notifications-box').hide()
    $('.ossn-notifications-box').find('.type-name').html('');
    $('.ossn-notifications-box').find('.metadata').html('<div><div class="ossn-loading ossn-notification-box-loading"></div></div><div class="bottom-all"><a href="#">'+Ossn.Print('see:all')+'</a></div>');
    //$('.ossn-notifications-box').css('height', '140px');
    $('.selected').attr('class', 'selected');

};
Ossn.NotificationShow = function($div) {
    $($div).attr('onClick', 'Ossn.NotificationClose(this)');
    Ossn.PostRequest({
        url: Ossn.site_url + "notification/notification",
        action:false,
        beforeSend: function(request) {
            Ossn.NotificationBoxClose();
            $('.ossn-notifications-friends').attr('onClick', 'Ossn.NotificationFriendsShow(this)');
            $('.ossn-notifications-messages').attr('onClick', 'Ossn.NotificationMessagesShow(this)');
            Ossn.NotificationBox(Ossn.Print('notifications'), false, 'notifications');
        },
        callback: function(callback) {
            var data = '';
            var height = '';
            if (callback['type'] == 1) {
                data = callback['data'];
               // height = '540px';
            }
            if (callback['type'] == 0) {
                data = callback['data'];
                //height = '100px';
            }
            Ossn.NotificationBox(Ossn.Print('notifications'), data, 'notifications', height,  callback['extra']);
        }
    });
};


Ossn.NotificationClose = function($div) {
    Ossn.NotificationBoxClose();
    $($div).attr('onClick', 'Ossn.NotificationShow(this)');
};

Ossn.NotificationFriendsShow = function($div) {
    $($div).attr('onClick', 'Ossn.NotificationFriendsClose(this)');
    Ossn.PostRequest({
        url: Ossn.site_url + "notification/friends",
        action:false,
        beforeSend: function(request) {
            Ossn.NotificationBoxClose();
            $('.ossn-notifications-notification').attr('onClick', 'Ossn.NotificationShow(this)');
            $('.ossn-notifications-messages').attr('onClick', 'Ossn.NotificationMessagesShow(this)');
            Ossn.NotificationBox(Ossn.Print('friend:requests'), false, 'firends');

        },
        callback: function(callback) {
            var data = '';
            var height = '';
            if (callback['type'] == 1) {
                data = callback['data'];
            }
            if (callback['type'] == 0) {
                data = callback['data'];
                //height = '100px';
            }
            Ossn.NotificationBox(Ossn.Print('friend:requests'), data, 'firends', height);
        }
    });
};


Ossn.NotificationFriendsClose = function($div) {
    Ossn.NotificationBoxClose();
    $($div).attr('onClick', 'Ossn.NotificationFriendsShow(this)');
};

Ossn.AddFriend = function($guid) {
    action = Ossn.site_url + "action/friend/add?user=" + $guid;
    Ossn.ajaxRequest({
        url: action,
        form: '#add-friend-' + $guid,
        action:true,

        beforeSend: function(request) {
            $('#notification-friend-item-' + $guid).find('form').hide();
            $('#ossn-nfriends-' + $guid).append('<div class="ossn-loading"></div>');
        },
        callback: function(callback) {
            if (callback['type'] == 1) {
                $('#notification-friend-item-' + $guid).addClass("ossn-notification-friend-submit");
                $('#ossn-nfriends-' + $guid).addClass('friends-added-text').html(callback['text']);
            }
            if (callback['type'] == 0) {
                $('#notification-friend-item-' + $guid).find('form').show();
                $('#ossn-nfriends-' + $guid).find('.ossn-loading').remove();
            }
            Ossn.NotificationsCheck();
        }
    });
};

Ossn.removeFriendRequset = function($guid) {
    action = Ossn.site_url + "action/friend/remove?user=" + $guid;
    Ossn.ajaxRequest({
        url: action,
        form: '#remove-friend-' + $guid,
        action:true,

        beforeSend: function(request) {
            $('#notification-friend-item-' + $guid).find('form').hide();
            $('#ossn-nfriends-' + $guid).append('<div class="ossn-loading"></div>');
        },
        callback: function(callback) {
            if (callback['type'] == 1) {
                $('#notification-friend-item-' + $guid).addClass("ossn-notification-friend-submit");
                $('#ossn-nfriends-' + $guid).addClass('friends-added-text').html(callback['text']);
            }
            if (callback['type'] == 0) {
                $('#notification-friend-item-' + $guid).find('form').show();
                $('#ossn-nfriends-' + $guid).find('.ossn-loading').remove();
            }
            Ossn.NotificationsCheck();
        }
    });
};

Ossn.NotificationMessagesShow = function($div) {
    $($div).attr('onClick', 'Ossn.NotificationMessagesClose(this)');
    Ossn.PostRequest({
        url: Ossn.site_url + "notification/messages",
        action:false,
        beforeSend: function(request) {
            Ossn.NotificationBoxClose();
            $('.ossn-notifications-notification').attr('onClick', 'Ossn.NotificationShow(this)');
            $('.ossn-notifications-friends').attr('onClick', 'Ossn.NotificationFriendsShow(this)');

        },
        callback: function(callback) {
            var data = '';
            var height = '';
            if (callback['type'] == 1) {
                data = callback['data'];
                height = '';
            }
            if (callback['type'] == 0) {
                data = callback['data'];
               // height = '100px';
            }
            Ossn.NotificationBox(Ossn.Print('messages'), data, 'messages', height);
        }
    });
};


Ossn.NotificationMessagesClose = function($div) {
    Ossn.NotificationBoxClose();
    $($div).attr('onClick', 'Ossn.NotificationMessagesShow(this)');
};
Ossn.NotificationsCheck = function() {
    Ossn.PostRequest({
        url: Ossn.site_url + "notification/count",
        action:false,
        callback: function(callback) {
            $notification = $('#ossn-notif-notification');
            $notification_count = $notification.find('.ossn-notification-container');

            $friends = $('#ossn-notif-friends');
            $friends_count = $friends.find('.ossn-notification-container');

            $messages = $('#ossn-notif-messages');
            $messages_count = $messages.find('.ossn-notification-container');

            if (callback['notifications'] > 0) {
                $notification_count.html(callback['notifications']);
                $notification.find('.ossn-icon').addClass('ossn-icons-topbar-notifications-new');
                $notification_count.attr('style', 'display:inline-block !important;');
            }
            if (callback['notifications'] <= 0) {
                $notification_count.html('');
                $notification.find('.ossn-icon').removeClass('ossn-icons-topbar-notifications-new');
                $notification.find('.ossn-icon').addClass('ossn-icons-topbar-notification');
                $notification_count.hide();
            }

            if (callback['messages'] > 0) {
                $messages_count.html(callback['messages']);
                $messages.find('.ossn-icon').addClass('ossn-icons-topbar-messages-new');
                $messages_count.attr('style', 'display:inline-block !important;');
            }
            if (callback['messages'] <= 0) {
                $messages_count.html('');
                $messages.find('.ossn-icon').removeClass('ossn-icons-topbar-messages-new');
                $messages.find('.ossn-icon').addClass('ossn-icons-topbar-messages');
                $messages_count.hide();
            }

            if (callback['friends'] > 0) {
                $friends_count.html(callback['friends']);
                $friends.find('.ossn-icon').addClass('ossn-icons-topbar-friends-new');
                $friends_count.attr('style', 'display:inline-block !important;');
            }
            if (callback['friends'] <= 0) {
                $friends_count.html('');
                $friends.find('.ossn-icon').removeClass('ossn-icons-topbar-friends-new');
                $friends.find('.ossn-icon').addClass('ossn-icons-topbar-friends');
                $friends_count.hide();
            }
        }
    });
};
Ossn.RegisterStartupFunction(function() {
    $(document).ready(function() {
    		$('.ossn-topbar-dropdown-menu').click(function(){
                    Ossn.NotificationBoxClose();
        	});
		$(document).on('click','.ossn-notification-mark-read', function(e){
				e.preventDefault();
   				Ossn.PostRequest({
        				url: Ossn.site_url + "action/notification/mark/allread",
        				action:false,
        				beforeSend: function(request) {
							$('.ossn-notification-mark-read').attr('style', 'opacity:0.5;');
 	       				},
        				callback: function(callback) {
           					if(callback['success']){
								Ossn.trigger_message(callback['success']);
							}
							if(callback['error']){
								Ossn.trigger_message(callback['error']);								
							}
							$('.ossn-notification-mark-read').attr('style', '1;');								
        				}
    			 });
		});
		
    });
});
/**
 * 	Open Source Social Network
 *
 * @package   (Informatikon.com).ossn
 * @author    OSSN Core Team <info@opensource-socialnetwork.org>
 * @copyright 2014 iNFORMATIKON TECHNOLOGIES
 * @license   General Public Licence http://www.opensource-socialnetwork.org/licence
 * @link      http://www.opensource-socialnetwork.org/licence
 */
Ossn.SendMessage = function($user) {
    Ossn.ajaxRequest({
        url: Ossn.site_url + "action/message/send",
        form: '#message-send-' + $user,
        action:true,
        beforeSend: function(request) {
            $('#message-send-' + $user).find('input[type=submit]').hide();
            $('#message-send-' + $user).find('.ossn-loading').removeClass('ossn-hidden');
        },
        callback: function(callback) {
            $('#message-append-' + $user).append(callback);
            $('#message-send-' + $user).find('textarea').val('');
            $('#message-send-' + $user).find('input[type=submit]').show();
            $('#message-send-' + $user).find('.ossn-loading').addClass('ossn-hidden');
            Ossn.message_scrollMove($user);

        }
    });

};
Ossn.getMessages = function($user, $guid) {
    Ossn.PostRequest({
        url: Ossn.site_url + "messages/getnew/" + $user,
        action: false,
        callback: function(callback) {
            $('#message-append-' + $guid).append(callback);
            if(callback){
            	//Unwanted refresh in message window #416 , there is no need to scroll if no new message.
	            Ossn.message_scrollMove($guid);
            }
        }
    });
};
Ossn.getRecent = function($user) {
    Ossn.PostRequest({
        url: Ossn.site_url + "messages/getrecent/" + $user,
        action: false,
        callback: function(callback) {
            $('#get-recent').html(callback);
            $('#get-recent').addClass('inner');
            $('.messages-from').find('.inner').remove();
            $('#get-recent').appendTo('.messages-from');
            $('#get-recent').show();
        }
    });
};
Ossn.playSound = function() {
    document.getElementById('ossn-chat-sound').play();
};
Ossn.message_scrollMove = function(fid) {
    var message = document.getElementById('message-append-' + fid);
    if (message) {
        message.scrollTop = message.scrollHeight;
        return message.scrollTop;
    }
};
Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('#ossn-group-add').click(function() {
			Ossn.MessageBox('groups/add');
		});
	});
});

Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$("#group-upload-cover").submit(function(event) {
			event.preventDefault();
			var formData = new FormData($(this)[0]);
			var $url = Ossn.site_url + 'action/group/cover/upload';
			$.ajax({
				url: Ossn.AddTokenToUrl($url),
				type: 'POST',
				data: formData,
				async: true,
				beforeSend: function(xhr, obj) {
					if ($('.ossn-group-cover').length == 0) {
						$('.header-users').attr('style', 'opacity:0.7;');
					} else {
						$('.ossn-group-cover').attr('style', 'opacity:0.7;');
					}
					var fileInput = $('#group-upload-cover').find("input[type='file']")[0],
						file = fileInput.files && fileInput.files[0];

					if (file) {
						var img = new Image();

						img.src = window.URL.createObjectURL(file);

						img.onload = function() {
							var width = img.naturalWidth,
								height = img.naturalHeight;

							window.URL.revokeObjectURL(img.src);
							if (width < 850 || height < 300) {
								xhr.abort();
								Ossn.trigger_message(Ossn.Print('profile:cover:err1:detail'), 'error');
								return false;
							}
						};
					}
				},
				cache: false,
				contentType: false,
				processData: false,
				success: function(callback) {
					if (callback['type'] == 1) {
						if ($('.ossn-group-cover').length == 0) {
							location.reload();
						} else {
							$('.ossn-group-cover').attr('style', '');
							$('.ossn-group-cover').find('img').attr('style', '');
							$('.ossn-group-cover').find('img').attr('src', callback['url']);
						}
					}
					if (callback['type'] == 0) {
						Ossn.MessageBox('syserror/unknown');
					}
				}
			});
			return false;
		});

		$('#add-cover-group').click(function(e) {
			e.preventDefault();
			$('#group-upload-cover').find('.coverfile').click();
		});
	});
});




Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('#reposition-cover').click(function() {
			$('.group-c-position').attr('style', 'display:inline-block !important;');
			$(function() {
				$.globalVars = {
					originalTop: 0,
					originalLeft: 0,
					maxHeight: $("#draggable").height() - $("#container").height(),
					maxWidth: $("#draggable").width() - $("#container").width()
				};
				$("#draggable").draggable({
					start: function(event, ui) {
						if (ui.position != undefined) {
							$.globalVars.originalTop = ui.position.top;
							$.globalVars.originalLeft = ui.position.left;
						}
					},
					drag: function(event, ui) {
						var newTop = ui.position.top;
						var newLeft = ui.position.left;
						if (ui.position.top < 0 && ui.position.top * -1 > $.globalVars.maxHeight) {
							newTop = $.globalVars.maxHeight * -1;
						}
						if (ui.position.top > 0) {
							newTop = 0;
						}
						if (ui.position.left < 0 && ui.position.left * -1 > $.globalVars.maxWidth) {
							newLeft = $.globalVars.maxWidth * -1;
						}
						if (ui.position.left > 0) {
							newLeft = 0;
						}
						ui.position.top = newTop;
						ui.position.left = newLeft;

						Ossn.GroupCover_top = newTop;
						Ossn.GroupCover_left = newLeft;
					}
				});
			});
		});
	});
});

Ossn.RegisterStartupFunction(function() {
	$(document).ready(function() {
		$('.ossn-group-cover').hover(function() {
			$('.ossn-group-cover-button').show();
		}, function() {
			$('.ossn-group-cover-button').hide();
		});
	});
});

Ossn.repositionGroupCOVER = function($group) {
	var $url = Ossn.site_url + "action/group/cover/reposition";
	$.ajax({
		async: true,
		type: 'post',
		data: '&top=' + Ossn.GroupCover_top + '&left=' + Ossn.GroupCover_left + '&group=' + $group,
		url: Ossn.AddTokenToUrl($url),
		success: function(callback) {
			$('.group-c-position').attr('style', 'display:none !important;');
			$("#draggable").draggable({
				drag: function() {
					return false;
				}
			});
		},
	});
};