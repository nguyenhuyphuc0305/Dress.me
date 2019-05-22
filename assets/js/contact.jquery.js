// -------------------------------------------------------
// -------------------------------------------------------
//
// Copyright © Keith Driessen.
//
// -------------------------------------------------------
// -------------------------------------------------------




$(document).ready(function() {
	var $win = $(window),
	$loading = $('#loading'),
	$splash = $('#splash'),
	$slideshow = $('.slide-show'),
	ss_length = $slideshow.length,
	current_ss = 0,
	ss_looper,
	remove_ss = false,
	remove_splash = false,
	$nav = $('nav'),
	$nav_item = $('.nav-item'),
	$current = $('.current-scene'),
	$slider = $('.slider'),
	$slide = $('.slide'),
	$photo = $('.photo'),
	$img = $('.photo img'),
	$prev_btn = $('#prev-btn'),
	$next_btn = $('#next-btn'),
	$nav_btn = $('#nav-btn'),
	$control_bar = $('#controls-bar'),
	$controls = $('.controls'),
	$current_cnt = $('#current-cnt'),
	$new_cnt = $('#new-cnt'),
	$caption = $('#caption'),
	$new_caption = $('#new-caption'),
	$next_qt = $('#next-qt'),
	$prev_qt = $('#prev-qt'),
	$quote = $('.quote-slide'),
	$name = $('#your-name'),
	$phone = $('#phone-number'),
	phone,
	$email = $('#email-address'),
	$option_field = $('#option-field'),
	$drop_option = $('.drop-option'),
	$options_box = $('#options-box'),
	subject = 'General Inquiry',
	$comment = $('#text-area'),
	$submit = $('#submit-btn'),
	$message = $('#form-message'),
	first_quote = $quote.first(),
	last_quote = $quote.last(),
	ww = $win.width(),
	cur_ww = ww,
	resizetime,
	$scene,
	$title_card,
	subtext,
	$first_photo,
	current_cnt,
	total_cnt,
	active = false,
	total_w,
	photo_w,
	photo_h,
	img_w,
	img_h,
	ratio,
	slide_w,
	inmotion,
	keyboard = false;
	
	
	
	
	// ---------------------------------------------------
	// SET EACH PHOTO'S SIZE AS NEEDED
	// ---------------------------------------------------
	function _photoSizer() {
		$img.each(function(index, el) {
			var $el = $(el);
			
			photo_w = $el.parent().width();
			photo_h = $el.parent().height();
			img_w = $el.attr('width');
			img_h = $el.attr('height');
			ratio = img_h / img_w;
			
			if ((photo_h / photo_w) > ratio) {
				$el.height(photo_h);
				$el.width(photo_h / ratio);
			} else {
				$el.width(photo_w);
				$el.height(photo_w * ratio);
			};
			
			$el.css({'left': (photo_w - $el.width()) / 2, 'top': (photo_h - $el.height()) / 2});
		});
	};
	
	
	
	
	// ---------------------------------------------------
	// SET EACH GELLERY'S SLIDER WIDTH
	// ---------------------------------------------------
	function _sliderSizer() {
		var $current_slider = $('.current-scene > .slider');
		
		ww = $win.width();
		
		$slider.each(function() {
			var $t = $(this),
			$s = $t.find($slide);
			
			total_w = $s.length * ww;
			$t.css('width', total_w + 'px');
			
			$s.each(function() {
				var $t = $(this);
				
				if($t.hasClass('portrait')) slide_w = Math.floor(ww * 0.4);
				else slide_w = ww;
				
				$t.css('width', slide_w + 'px');
			});
		});
		
		if(cur_ww !== ww && $current_slider.length > 0 && $current_slider.position().left < 0) {
			clearTimeout(resizetime);
			
			resizetime = setTimeout(function() {
				if(inmotion) return false;
				else inmotion = true;
				
				$slide.removeClass('current-photo');
				$current_slider.find($slide).first().addClass('current-photo');
				$caption.css('top', '0%').text($('.current-photo').data('caption'));
				$new_caption.css('top', '-100%').text($('.current-photo').data('caption'));
				$current_cnt.css('top', '0%').text('01');
				$new_cnt.css('top', '-100%').text('01');

				$current_slider.stop().animate({left: '0px'}, 666,  'easeInOutExpo', function() {
					inmotion = false;
				});
				
				cur_ww = ww;
			}, 500);
		}
	};
	
	
	
	
	// ---------------------------------------------------
	// ADD INSET BORDERS TO PORTRAIT IMAGES
	// ---------------------------------------------------
	$slide.each(function() {
		var $t = $(this),
		overlay = '<section class="overlay"></section>',
		borders = '<span class="lb"></span><span class="rb"></span>';
		
		if($t.hasClass('portrait')) $t.append(overlay + borders);
		else $t.append(overlay);
	});
	
	
	
	
	// ---------------------------------------------------
	// SHOW OR HIDE THE NAV BAR
	// ---------------------------------------------------
	function _showTheNavBar() {
		$control_bar.stop().animate({bottom: '-52px'}, 666, 'easeInOutExpo');
		$nav.stop().animate({bottom: '0px'}, 666, 'easeInOutExpo');
	};
	
	function _hideTheNavBar() {
		if($('.current-scene').attr('id') === 'about' || $('.current-scene').attr('id') === 'contact') {
			if(active === false) {
				$controls.hide();
				$nav_btn.show();
				$caption.text('');
				$new_caption.text('');
				if($('.current-scene').attr('id') === 'about') _resetTestimonials();
			}
			$control_bar.stop().animate({bottom: '0px'}, 666, 'easeInOutExpo');
		} else {
			if(active === true) {
				$control_bar.stop().animate({bottom: '0px'}, 666, 'easeInOutExpo');
			} else {
				$controls.show();
				$current = $scene;
				$current.find($slider).css('left', '0px');
				_initNewTitleCard();
			}
		}
		
		$nav.stop().animate({bottom: '-152px'}, 666, 'easeInOutExpo');
	};
	
	
	
	
	// ---------------------------------------------------
	// BUILD A NEW SCENE
	// ---------------------------------------------------
	function _initNewScene() {
		remove_ss = true;
		keyboard = false;
		
		if(inmotion) return false;
		else inmotion = true;
		
		var $t = $(this);
		
		$scene = $('#' + $t.data('target'));
		
		if($t.hasClass('current')) {
			active = true;
			inmotion = false;
			_hideTheNavBar();
		} else {
			active = false;
			
			$nav_item.removeClass('current');
			$t.addClass('current');
			
			$('.current-scene').removeClass('current-scene').stop().animate({top: '100%'}, 666, 'easeInOutExpo');
			$scene.addClass('current-scene').css('top', '-100%').stop().animate({top: '0%'}, 666, 'easeInOutExpo', function() {
				$slide.removeClass('current-photo');
				$scene.find($slide).first().addClass('current-photo first-photo');
				inmotion = false;
				
				if(remove_ss === true) {
					if(remove_splash !== true) {
						clearInterval(ss_looper);
						$splash.remove();
						remove_splash = true;
					}
				}
			});
			
			_hideTheNavBar();
		}
	};
	
	
	
	
	// ---------------------------------------------------
	// CREATE A TITLE CARD FOR THE CURRENT GALLERY
	// ---------------------------------------------------
	function _initNewTitleCard() {
		total_cnt = $current.find($slide).length;
		
		var title = $current.attr('id'),
		photo_cnt = '01',
		tick = 100,
		num = 1,
		cnt_timer;
		
		if($current.attr('id') === 'portfolio1') subtext = 'Qualities in a person or thing that gives pleasure to the senses.';
		if($current.attr('id') === 'portfolio2') subtext = 'Beauty as a way of life of an individual, group, or culture.';
		if($current.attr('id') === 'portfolio3') subtext = 'An expression of beauty that resembles that of opinions.';
		if($current.attr('id') === 'bridal') subtext = 'Artistry married to a wedding, festival or ceremony.';
		
		$title_card = '<section id="title-card" class="title-card"><section class="overlay"></section><section class="title-content"><div class="title-content-inner"><span id="photo-cnt" class="photo-cnt">'+photo_cnt+'</span><h1>'+title+'</h1><p>'+ subtext +'</p></div></section></section>';
		$current.append($title_card);
		
		_resetCounterAndResetPhotos();
		
		$current.find('.logo').hide();
		
		setTimeout(function() {
			clearInterval(cnt_timer);
			cnt_timer = setInterval(function() {
				var $photo_cnt = $('#photo-cnt');
			
				if(num === total_cnt) {
					clearInterval(cnt_timer);
					setTimeout(_removeTitleCard, 666);
					return false;
				} else {
					num++
					if(num < 10) photo_cnt = '0' + num;
					else photo_cnt = num;
					
					$photo_cnt.text(photo_cnt);
				}
			}, tick);
		}, 666);
	};
	
	function _removeTitleCard() {
		$('#title-card').fadeOut(666, 'easeInOutExpo', function() {
			$(this).remove();
			keyboard = true;
		});
		$current.find('.logo').fadeIn(666, 'easeInOutExpo');
		$control_bar.stop().animate({bottom: '0px'}, 666, 'easeInOutExpo');
	};
	
	
	
	
	// ---------------------------------------------------
	// RESET COUNTER AND PHOTOS
	// ---------------------------------------------------
	function _resetCounterAndResetPhotos() {
		$scene.find($slide).first().addClass('first-photo current-photo');
		$caption.css('top', '0%').text($scene.find($slide).first().data('caption'));
		$new_caption.css('top', '-100%').text($scene.find($slide).first().data('caption'));
		$current_cnt.css('top', '0%').text('01');
		$new_cnt.css('top', '-100%').text('01');
	};
	
	function _nextPhotoPlease() {
		if(inmotion) return false;
		else inmotion = true;
		
		var $current_slider = $current.children('.slider'),
		$current_photo = $('.current-photo'),
		$next_photo = $current_photo.next(),
		next_distance = Math.round(($current_photo.width() + $next_photo.width()) / 2);
		
		if($next_photo.length === 0) {
			$current_slider.stop().animate({'margin-left': '-110px'}, 150, function() {
				$(this).stop().animate({'margin-left': '0px'}, 150, function() {
					inmotion = false;
				});
			});
		} else {
			$slide.removeClass('current-photo first-photo');
			$next_photo.addClass('current-photo');
			
			current_cnt = $current_photo.index() + 1;
			if(current_cnt < 10) $current_cnt.text('0' + current_cnt);
			else $current_cnt.text(current_cnt);
			if($.browser.msie && $.browser.version < 9) $current_cnt.css('top', '100%');
			else $current_cnt.css('top', '0%').stop().animate({top: '100%'}, 666, 'easeInOutExpo');
			
			current_cnt++;
			
			if(current_cnt < 10) $new_cnt.text('0' + current_cnt);
			else $new_cnt.text(current_cnt);
			if($.browser.msie && $.browser.version < 9) $new_cnt.css('top', '0%');
			else $new_cnt.css('top', '-100%').stop().animate({top: '0%'}, 666, 'easeInOutExpo');
			
			if($.browser.msie && $.browser.version < 9) {
				$caption.css('top', '100%');
				$new_caption.css('top', '0%').text($next_photo.data('caption'));
			} else {
				$caption.css('top', '0%').stop().animate({top: '100%'}, 666, 'easeInOutExpo');
				$new_caption.css('top', '-100%').text($next_photo.data('caption')).stop().animate({top: '0%'}, 666, 'easeInOutExpo');
			}
			
			$current_slider.stop().animate({left: '-=' + next_distance + 'px'}, 666, 'easeInOutExpo', function() {
				$caption.text($new_caption.text());
				inmotion = false;
			});
		}
	};
	
	function _prevPhotoPlease() {
		if(inmotion) return false;
		else inmotion = true;
		
		var $current_slider = $current.children('.slider'),
		$current_photo = $('.current-photo'),
		$prev_photo = $current_photo.prev(),
		prev_distance = Math.round(($current_photo.width() + $prev_photo.width()) / 2);
		
		if($prev_photo.length === 0) {
			$current_slider.stop().animate({'margin-left': '110px'}, 150, function() {
				$(this).stop().animate({'margin-left': '0px'}, 150, function() {
					inmotion = false;
				});
			});
		} else {
			$slide.removeClass('current-photo');
			$prev_photo.addClass('current-photo');
			
			current_cnt = $current_photo.index() + 1;
			if(current_cnt < 10) $current_cnt.text('0' + current_cnt);
			else $current_cnt.text(current_cnt);
			if($.browser.msie && $.browser.version < 9) $current_cnt.css('top', '-100%');
			else $current_cnt.css('top', '0%').stop().animate({top: '-100%'}, 666, 'easeInOutExpo');
			
			current_cnt--;
			
			if(current_cnt < 10) $new_cnt.text('0' + current_cnt);
			else $new_cnt.text(current_cnt);
			if($.browser.msie && $.browser.version < 9) $new_cnt.css('top', '0%');
			else $new_cnt.css('top', '100%').stop().animate({top: '0%'}, 666, 'easeInOutExpo');
			
			if($.browser.msie && $.browser.version < 9) {
				$caption.css('top', '-100%');
				$new_caption.css('top', '0%').text($prev_photo.data('caption'));
			} else {
				$caption.css('top', '0%').stop().animate({top: '-100%'}, 666, 'easeInOutExpo');
				$new_caption.css('top', '100%').text($prev_photo.data('caption')).stop().animate({top: '0%'}, 666, 'easeInOutExpo');
			}
			
			$current_slider.stop().animate({left: '+=' + prev_distance + 'px'}, 666, 'easeInOutExpo', function() {
				$caption.text($new_caption.text());
				inmotion = false;
			});
		}
	};
	
	
	
	
	// ---------------------------------------------------
	// TESTIMONIALS SLIDER
	// ---------------------------------------------------
	function _resetTestimonials() {
		$quote.removeClass('active-slide').css('top', '-100%');
		first_quote.addClass('active-slide').css('top', '0%');
	};
	
	function _nextTestimonial() {
		if(inmotion) return false;
		else inmotion = true;
		
		var	active = $('.active-slide'),
		nextslide =  active.next().length ? active.next() : first_quote;
		
		active.removeClass('active-slide').stop().animate({'top':'-100%'}, 333, 'easeInOutExpo', function() {
			inmotion = false;
		});
		
		nextslide.css('top','100%').addClass('active-slide').stop().animate({top:'0%'}, 333, 'easeInOutExpo');
	};
	
	function _prevTestimonial() {
		if(inmotion) return false;
		else inmotion = true;
		
		var	active = $('.active-slide'),
		prevslide =  active.prev().length ? active.prev() : last_quote;
		
		active.removeClass('active-slide').stop().animate({'top':'100%'}, 333, 'easeInOutExpo', function() {
			inmotion = false;
		});
		
		prevslide.css('top','-100%').addClass('active-slide').stop().animate({top:'0%'}, 333, 'easeInOutExpo');
	};
	
	
	
	
	// ---------------------------------------------------
	// CONTACT FORM
	// ---------------------------------------------------
	$name.focus(function() {
		var $t = $(this);
		if($t.val() === 'Your name*') $t.val('');
		$t.css('color', '#615a4b');
	}).blur(function() {
		var $t = $(this);
		if($t.val() === '') {
			$t.val('Your name*');
			$t.css('color', '#aea69b');
		}
	});
	
	$phone.focus(function() {
		var $t = $(this);
		if($t.val() === 'Phone number') $t.val('');
		$t.css('color', '#615a4b');
	}).blur(function() {
		var $t = $(this);
		if($t.val() === '') {
			$t.val('Phone number');
			$t.css('color', '#aea69b');
		}
	});
	
	$email.focus(function() {
		var $t = $(this);
		if($t.val() === 'Email address*') $t.val('');
		$t.css('color', '#615a4b');
	}).blur(function() {
		var $t = $(this);
		if($t.val() === '') {
			$t.val('Email address*');
			$t.css('color', '#aea69b');
		}
	});
	
	$comment.focus(function() {
		var $t = $(this);
		if($t.val() === 'Message*') $t.val('');
		$t.css('color', '#615a4b');
	}).blur(function() {
		var $t = $(this);
		if($t.val() === '' || $t.val() === 'Message*') {
			$t.val('Message*');
			$t.css('color', '#aea69b');
		}
	});
	
	function _viewDropDown() {
		$options_box.show().stop().animate({height: '174px'}, 666, 'easeInOutExpo', function() {
			$(document).one('click', _hideDropDown);
		});
	};
	
	function _updateSubject() {
		var $t = $(this),
		subject_name = $t.text();
		
		$drop_option.removeClass('selected');
		$t.addClass('selected');
		
		subject = subject_name;
		$option_field.css('color', '#615a4b').text(subject);
	};
	
	function _hideDropDown() {
		$options_box.stop().animate({height: '0px'}, 666, 'easeInOutExpo', function() {
			$options_box.hide();
			$option_field.one('click', _viewDropDown);
		});
	};
	
	function _submitLoveMail(e) {
		e.preventDefault();
		
		var mail_regex = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,6})$/,
		response,
		good_name = true,
		good_email = true,
		good_message = true;
		
		$message.html('');
		
		if($name.val() === 'Your name*' || $name.val() === '') {
			good_name = false;
			$message.css('color', '#990000');
			response = 'Please enter your name.'
			$name.focus();
		}
		
		if(!mail_regex.test($email.val())) {
			good_email = false;
			$message.css('color', '#990000');
			response = 'Please enter a valid email address.'
			$email.focus();
		}
		
		if($comment.val() === 'Message*' || $comment.val() === '') {
			good_message = false;
			$message.css('color', '#990000');
			response = 'Please type a message.'
			$comment.focus();
		}
		
		if(good_name === false && good_email === false && good_message === false) {
			response = 'Please fill out all required fields.'
			$name.focus();
		}
		
		if(good_name === true && good_email === true && good_message === true) {
			if($phone.val() === 'Phone number' || $phone.val() === '') phone = 'n/a';
			else phone = $phone.val();
			
			var capture = {
				name: $name.val(),
				phone: phone,
				email: $email.val(),
				subject: subject,
				comment: $comment.val()
			}
			
			$.ajax({
				type: 'POST',
				url: 'love-mail.php',
				data: capture,
				success: function(msg) {
					if(msg = 'sent') {
						$message.css('color', '#339933');
						response = 'Thank you! I will get back to you within 24-48 hours.'
					} else if(msg = 'failed') {
						$message.css('color', '#990000');
						response = 'Oops! An error occured. Please try again later.'
					}
					$message.html(response);
				}
			});	
		}
		
		$message.html(response);
		
	};
	
	
	
	
	// ---------------------------------------------------
	// AUTO SLIDESHOW
	// ---------------------------------------------------
	function _initAutoSlideshow() {
		ss_looper = setInterval(function() {
			$('.current-ss').removeClass('current-ss').fadeOut(1349, 'easeInOutExpo');
			
			if(current_ss === ss_length - 1) current_ss = 0;
			else current_ss++;
			
			$photo.eq(current_ss).addClass('current-ss').css('display','none').fadeIn(1349, 'easeInOutExpo');
		}, 5000);
	};
	
	$photo.eq(current_ss).addClass('current-ss').css('display','block');
	
	
	
	
	// ---------------------------------------------------
	// CLICK THIS, DO THAT
	// ---------------------------------------------------
	$nav_item.click(_initNewScene);
	$prev_btn.click(_prevPhotoPlease);
	$next_btn.click(_nextPhotoPlease);
	$nav_btn.click(_showTheNavBar);
	
	$next_qt.click(_nextTestimonial);
	$prev_qt.click(_prevTestimonial);
	
	$option_field.one('click', _viewDropDown);
	$drop_option.click(_updateSubject);
	$submit.click(_submitLoveMail);
	
	$(document).keydown(function(e) {
		if(keyboard === true) {
			if(e.keyCode === 37) {
				_prevPhotoPlease();
				return false;
			}
			
			if(e.keyCode === 39) {
				_nextPhotoPlease();
				return false;
			}
		}
	});
	
	
	
	
	// ---------------------------------------------------
	// WINDOW RESIZE
	// ---------------------------------------------------
	$win.resize(function() {
		_photoSizer();
		_sliderSizer();
	});
	
	
	
	
	// ---------------------------------------------------
	// TOTALLY LOADED!
	// ---------------------------------------------------
	function _loadComplete() {
		$loading.find('img').fadeOut(666, 'easeInOutExpo', function() {
			$nav.animate({bottom: '0px'}, 666, 'easeInOutExpo');
			$splash.stop().animate({top: '0%'}, 666, 'easeInOutExpo', function() {
				$loading.remove();
			});
		});
		
		_initAutoSlideshow();
	};
	
	$win.load(function() {
		setTimeout(_loadComplete, 1000);
	}).trigger('resize');
	
	
	
	
});