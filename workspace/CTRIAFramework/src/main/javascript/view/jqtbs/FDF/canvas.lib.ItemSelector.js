cbx.ns('ct.lib.formElement');
ct.lib.formElement.ItemSelector = Class(canvas.lib.FormElements,{
	
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "ct.lib.formElement.ItemSelector"
	 * @description This method is responsible for creating the element specific functions.
	 */
	
	generateFieldSpecificEvents:function(){
		$("li[data-item-type=itemSelectorItemCont]").bind('click',function(e){
			var itemClicked = $(e.currentTarget).find('span[data-item-type=itemSelectorItem]');
			itemClicked.hasClass("ct-form__item-selected") ? itemClicked.removeClass("ct-form__item-selected") : itemClicked.addClass("ct-form__item-selected");
		});
		$("span[data-item-type=itemselector_up]").bind('click',function(e){
			e.stopPropagation();
			var prevItemCont=$(e.currentTarget).closest("li[data-item-type=itemSelectorItemCont]").prev("li[data-item-type=itemSelectorItemCont]");
			var currItemCont=$(e.currentTarget).closest("li[data-item-type=itemSelectorItemCont]");
			if($(prevItemCont).length!=0){
				var currItem= $(e.currentTarget).closest("span[data-item-type=itemSelectorItem]");
				$(prevItemCont).append($(currItem));
				var prevElem=$(prevItemCont).find('span[data-item-type=itemSelectorItem]:first').detach();
				$(currItemCont).append($(prevElem));
			}
		});
		$("span[data-item-type=itemselector_down]").bind('click',function(e){
			e.stopPropagation();
			var nextItemCont=$(e.currentTarget).closest("li[data-item-type=itemSelectorItemCont]").next("li[data-item-type=itemSelectorItemCont]");
			var currItemCont=$(e.currentTarget).closest("li[data-item-type=itemSelectorItemCont]");
			if($(nextItemCont).length!=0){
				var currItem= $(e.currentTarget).closest("span[data-item-type=itemSelectorItem]");
				$(nextItemCont).append($(currItem));
				var prevElem=$(nextItemCont).find('span[data-item-type=itemSelectorItem]:first').detach();
				$(currItemCont).append($(prevElem));
			}
		});
	}

});

CFCR.registerFormCmp({'COMP_TYPE' : 'FORM_FIELDS','COMP_NAME':'cbx-itemselector' },ct.lib.formElement.ItemSelector);