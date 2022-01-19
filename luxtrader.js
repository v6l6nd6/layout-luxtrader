
"use strict";

let headSlider= new Swiper(".swiper-container", {
  navigation: {
    nextEl:".arrow-right",
    prevEl:".arrow-left",
  },
  loop:true,
  slidesPerView:1,
  cssMode: true,
  slideToClickedSlide:true,
  grabCursor:true,
  
  speed:2000,
  
});



$(document).ready(function() {
    $('.slider-lots__body').on('init reInit',function(e,slick){
        if(slick.slideCount<=slick.options.slidesToShow){
          slick.slickAdd(slick.$slides.clone())
        }
      })
    $(".slider-lots__body").slick(
        {
            arrows:true,
            dots:false,
            infinite:true,
            slidesToShow:3,
            
            appendArrows:".slider-lots__control",
            prevArrow:".control-slider-lots__arrowprev",
            nextArrow:".control-slider-lots__arrownext"
            
        }
    )
    
})


 new Swiper(".quotes__slider", {
  observer:true,
  observerParents:true,
  slidesPerView:1,
  loop:true,
  arrows:true,
  effect : 'fade',
  spaceBetween: 0 ,

  navigation: {
    nextEl:".control__circle",
    
  },
  
})


///////////////////////////////////////////////////////// 
// Dynamic Adapt v.1
// HTML data-move="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-move="item,2,992"
// Andrikanych Yevhen 2020
var move_array = [];
var move_objects = document.querySelectorAll("[data-move]");

if (move_objects.length > 0) {
	for (var _index10 = 0; _index10 < move_objects.length; _index10++) {
		var _el6 = move_objects[_index10];

		var data_move = _el6.getAttribute("data-move");

		if (data_move != "" || data_move != null) {
			_el6.setAttribute("data-move-index", _index10);

			move_array[_index10] = {
				parent: _el6.parentNode,
				index: index_in_parent(_el6)
			};
		}
	}
}

function dynamic_adapt() {
	var w = document.querySelector("body").offsetWidth;

	if (move_objects.length > 0) {
		for (var _index11 = 0; _index11 < move_objects.length; _index11++) {
			var _el7 = move_objects[_index11];

			var _data_move = _el7.getAttribute("data-move");

			if (_data_move != "" || _data_move != null) {
				var data_array = _data_move.split(",");

				var data_parent = document.querySelector("." + data_array[0]);
				var data_index = data_array[1];
				var data_bp = data_array[2];

				if (w < data_bp) {
					if (!_el7.classList.contains("js-move_done_" + data_bp)) {
						if (data_index > 0) {
							//insertAfter
							var actual_index = index_of_elements(data_parent)[data_index];
							data_parent.insertBefore(_el7, data_parent.childNodes[actual_index]);
						} else {
							data_parent.insertBefore(_el7, data_parent.firstChild);
						}

						_el7.classList.add("js-move_done_" + data_bp);
					}
				} else {
					if (_el7.classList.contains("js-move_done_" + data_bp)) {
						dynamic_adaptive_back(_el7);

						_el7.classList.remove("js-move_done_" + data_bp);
					}
				}
			}
		}
	}

	custom_adapt(w);
}

function dynamic_adaptive_back(el) {
	var index_original = el.getAttribute("data-move-index");
	var move_place = move_array[index_original];
	var parent_place = move_place["parent"];
	var index_place = move_place["index"];

	if (index_place > 0) {
		//insertAfter
		var actual_index = index_of_elements(parent_place)[index_place];
		parent_place.insertBefore(el, parent_place.childNodes[actual_index]);
	} else {
		parent_place.insertBefore(el, parent_place.firstChild);
	}
}

function index_in_parent(node) {
	var children = node.parentNode.childNodes;
	var num = 0;

	for (var _i2 = 0; _i2 < children.length; _i2++) {
		if (children[_i2] == node) return num;
		if (children[_i2].nodeType == 1) num++;
	}

	return -1;
}

function index_of_elements(parent) {
	var children = [];

	for (var _i3 = 0; _i3 < parent.childNodes.length; _i3++) {
		if (parent.childNodes[_i3].nodeType == 1 && parent.childNodes[_i3].getAttribute("data-move") == null) {
			children.push(_i3);
		}
	}

	return children;
}

window.addEventListener("resize", function (event) {
	dynamic_adapt();
});
dynamic_adapt();

function custom_adapt(w) { }

var btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');

if (btn) {
	for (var _index12 = 0; _index12 < btn.length; _index12++) {
		var _el8 = btn[_index12];

		_el8.addEventListener('click', form_submit);
	}
}

function form_submit() {
	var error = 0;
	var btn = event.target;
	var form = btn.closest('form');
	var form_req = form.querySelectorAll('._req');

	if (form_req) {
		for (var _index13 = 0; _index13 < form_req.length; _index13++) {
			var _el9 = form_req[_index13];
			error += form_validate(_el9);
		}
	}

	if (error == 0) {
		//SendForm
		form_clean(form);
		popup_close(); //popup_open('message');
		//event.preventDefault();
	} else {
		var form_error = form.querySelectorAll('._error');

		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}

		event.preventDefault();
	}
}

function form_validate(input) {
	var error = 0;
	var input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			var em = input.value.replace(" ", "");
			input.value = em;
		}

		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}

	return error;
}

function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');
	var input_error = input.parentElement.querySelector('.form__error');

	if (input_error) {
		input.parentElement.removeChild(input_error);
	}

	var input_error_text = input.getAttribute('data-error');

	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}

function form_remove_error(input) {
	input.classList.remove('_error');
	input.parentElement.classList.remove('_error');
	var input_error = input.parentElement.querySelector('.form__error');

	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
}

function form_clean(form) {
	var inputs = form.querySelectorAll('input,textarea');

	for (var _index14 = 0; _index14 < inputs.length; _index14++) {
		var _el10 = inputs[_index14];

		_el10.parentElement.classList.remove('_focus');

		_el10.classList.remove('_focus');

		_el10.value = _el10.getAttribute('data-value');
	}

	var selects = form.querySelectorAll('select');

	if (inputs.length > 0) {
		for (var _index15 = 0; _index15 < selects.length; _index15++) {
			var select = selects[_index15];
			var select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}

var selects = document.querySelectorAll('select');

if (selects.length > 0) {
	selects_init();
} //Select


function selects_init() {
	for (var _index16 = 0; _index16 < selects.length; _index16++) {
		var select = selects[_index16];
		select_init(select);
	} //select_callback();


	document.addEventListener('click', function (e) {
		selects_close(e);
	});
	document.addEventListener('keydown', function (e) {
		if (e.which == 27) {
			selects_close(e);
		}
	});
}

function selects_close(e) {
	var selects = document.querySelectorAll('.select');

	if (!e.target.closest('.select')) {
		for (var _index17 = 0; _index17 < selects.length; _index17++) {
			var select = selects[_index17];
			select.classList.remove('_active');
		}
	}
}

function select_init(select) {
	var select_parent = select.parentElement;
	var select_modifikator = select.getAttribute('class');
	var select_selected_option = select.querySelector('option:checked');
	select.setAttribute('data-default', select_selected_option.value);
	select.style.display = 'none';
	select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');
	var new_select = select.parentElement.querySelector('.select');
	new_select.append(select);
	select_item(select);
}

function select_item(select) {
	var select_parent = select.parentElement;
	var select_items = select_parent.querySelector('.select__item');
	var select_options = select.querySelectorAll('option');
	var select_selected_option = select.querySelector('option:checked');
	var select_selected_text = select_selected_option.text;
	var select_type = select.getAttribute('data-type');

	if (select_items) {
		select_items.remove();
	}

	var select_type_content = '';

	if (select_type == 'input') {
		select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
	} else {
		select_type_content = '<div class="select__value icon-select-arrow">' + select_selected_text + '</div>';
	}

	select_parent.insertAdjacentHTML('beforeend', '<div class="select__item">' + '<div class="select__title">' + select_type_content + '</div>' + '<div class="select__options">' + select_get_options(select_options) + '</div>' + '</div></div>');
	select_actions(select, select_parent);
}

function select_actions(original, select) {
	var select_item = select.querySelector('.select__item');
	var select_body_options = select.querySelector('.select__options');
	var select_options = select.querySelectorAll('.select__option');
	var select_type = original.getAttribute('data-type');
	var select_input = select.querySelector('.select__input');
	select_item.addEventListener('click', function () {
		var selects = document.querySelectorAll('.select');

		for (var _index18 = 0; _index18 < selects.length; _index18++) {
			var _select = selects[_index18];

			if (_select != select_item.closest('.select')) {
				_select.classList.remove('_active');
			}
		}

		slideToggle(select_body_options, 100);
		select.classList.toggle('_active');
	});

	var _loop5 = function _loop5(_index19) {
		var select_option = select_options[_index19];
		var select_option_value = select_option.getAttribute('data-value');
		var select_option_text = select_option.innerHTML;

		if (select_type == 'input') {
			select_input.addEventListener('keyup', select_search);
		} else {
			if (select_option.getAttribute('data-value') == original.value) {
				select_option.style.display = 'none';
			}
		}

		select_option.addEventListener('click', function () {
			for (var _index20 = 0; _index20 < select_options.length; _index20++) {
				var _el11 = select_options[_index20];
				_el11.style.display = 'block';
			}

			if (select_type == 'input') {
				select_input.value = select_option_text;
				original.value = select_option_value;
			} else {
				select.querySelector('.select__value').innerHTML = select_option_text;
				original.value = select_option_value;
				select_option.style.display = 'none';
			}
		});
	};

	for (var _index19 = 0; _index19 < select_options.length; _index19++) {
		_loop5(_index19);
	}
}

function select_get_options(select_options) {
	if (select_options) {
		var select_options_content = '';

		for (var _index21 = 0; _index21 < select_options.length; _index21++) {
			var select_option = select_options[_index21];
			var select_option_value = select_option.value;

			if (select_option_value != '') {
				var select_option_text = select_option.text;
				select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
			}
		}

		return select_options_content;
	}
}

function select_search(e) {
	var select_block = e.target.closest('.select ').querySelector('.select__options');
	var select_options = e.target.closest('.select ').querySelectorAll('.select__option');
	var select_search_text = e.target.value.toUpperCase();

	for (var _i4 = 0; _i4 < select_options.length; _i4++) {
		var select_option = select_options[_i4];
		var select_txt_value = select_option.textContent || select_option.innerText;

		if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
			select_option.style.display = "";
		} else {
			select_option.style.display = "none";
		}
	}
}

function selects_update_all() {
	var selects = document.querySelectorAll('select');

	if (selects) {
		for (var _index22 = 0; _index22 < selects.length; _index22++) {
			var select = selects[_index22];
			select_item(select);
		}
	}
}
