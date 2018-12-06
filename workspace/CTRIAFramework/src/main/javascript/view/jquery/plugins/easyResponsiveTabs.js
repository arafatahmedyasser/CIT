// Easy Responsive Tabs Plugin
// Author: Samson.Onna <Email : samson3d@gmail.com>
(function ($) {
    $.fn.extend({
        easyResponsiveTabs: function (options) {
            //Set the default values, use comma to separate the settings, example:
            var defaults = {
                type: 'default', //default, vertical, accordion;
                width: 'auto',
                fit: true,
                closed: false,
                scope:this,
                activate: function(){},
                deactivate: function(){}
            }

            //Variables
            var options = $.extend(defaults, options);            
            var opt = options, jtype = opt.type, jfit = opt.fit, jwidth = opt.width, vtabs = 'vertical', accord = 'accordion';
            
            //Events
            $(this).bind('tabactivate', function(e, currentTab) {
                if(typeof options.activate === 'function') {
                	e.scope=options.scope;
                    options.activate.call(currentTab, e)
                }
            });
            //Events
            $(this).bind('tabdeactivate', function(e, lastTab) {
                if(typeof options.deactivate === 'function') {
                	e.scope=options.scope;
                	e.target=lastTab;
                    options.deactivate.call(lastTab, e);
                }
            });
            
            $(this).bind('activations', function(e) {
            		e.scope=options.scope;
            		e.scope.tabActiveById= setActiveById;
            		e.scope.tabScope=e.scope
            });
            
			var me= this;
			setTimeout(function(){
				main.apply(me);					
			}, 1000);
			
			
			var setActiveById=function(id) 
			{
				LOGGER.info('arguments ',[arguments[0],arguments[1]])
				respTabsActivation.apply(me,[me,id]);		 
			};
			var respTabsActivation =function(){
				var index=arguments[1];
				this.each(function () {
					var $respTabs = $(this);
					$respTabs.find('ul.resp-tabs-list').find("[role=tab]").each(function () {
						//var $currentTab = $(this).find('[aria-controls="tab_item-1"]')
						var $currentTab = $(this)
						LOGGER.info('$currentTab ',$currentTab)
						
						var $tabAria = $currentTab.attr('aria-controls');
						if($tabAria=="tab_item-"+index){
						if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
							$respTabs.find('.resp-tab-content-active').slideUp('', function () { $(this).addClass('resp-accordion-closed'); });
							$currentTab.removeClass('resp-tab-active');
							LOGGER.info("clicked accordian is the current accordian. closing it now")
							return false;
						}
						if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
							//Trigger tab de-activation event
							$currentTab.trigger('tabdeactivate', $respTabs.find('.resp-tab-active'));
							$respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
							$respTabs.find('.resp-tab-content-active').slideUp().removeClass('resp-tab-content-active resp-accordion-closed');
							$respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');

							$respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').slideDown().addClass('resp-tab-content-active');
						} else {
							//Checking if the clicked tab is the current tab
							if($currentTab.hasClass('resp-tab-active')){
								return false;
							}
							//Trigger tab de-activation event
							$currentTab.trigger('tabdeactivate', $respTabs.find('.resp-tab-active'));
							$respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
							$respTabs.find('.resp-tab-content-active').removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed');
							$respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');
							$respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').addClass('resp-tab-content-active').attr('style', 'display:block');
						}
						//Trigger tab activation event
						$currentTab.trigger('tabactivate', $currentTab);
					}
				});
					
			});
			};
			
            //Main function
			var main= function(){
				
				this.each(function () {
					var $respTabs = $(this);
					var $respTabsList = $respTabs.find('ul.resp-tabs-list');
					$respTabs.find('ul.resp-tabs-list li').addClass('resp-tab-item');
					var tab=$respTabs[0];
					var totalW=tab.clientWidth;
					var iArr=$respTabs.find('ul.resp-tabs-list li')
					var fItem=iArr[0];
					var iWidth=(typeof fItem === 'undefined'?1:fItem.clientWidth);
					var iCount=iArr.length;
					
						var iPadd= parseInt(iArr.css('padding-left'))+parseInt(iArr.css('padding-right'));
						var iBorder=parseInt(iArr.css('border-left-width'))+parseInt(iArr.css('border-right-width'));
						var tPadd= iPadd*iCount;
						var usableW=totalW-tPadd-(iBorder*iCount);
						var usableP= (usableW*100)/totalW;
						var ip=Math.round(usableP/iCount);
						if((iWidth*iCount)>totalW){
							iArr.css({
								'width': ip+'%'
							});
						}else{
							iArr.css({
								'max-width': ip+'%'
							});
						}
					//	console.info('usableP', iArr.css('border-left-width'));
						
					
					//console.info(totalW, iCount, fItem.clientWidth)
					 /*$respTabs.find('ul.resp-tabs-list li').css({
						'width': '14%'
					 });*/
					$respTabs.css({
						'display': 'block',
						'width': jwidth
					});

					$respTabs.find('.resp-tabs-container > div').addClass('resp-tab-content');
					jtab_options();
					//Properties Function
					function jtab_options() {
						if (jtype == vtabs) {
							$respTabs.addClass('resp-vtabs');
						}
						if (jfit == true) {
							$respTabs.css({ width: '100%', margin: '0px' });
						}
						if (jtype == accord) {
							$respTabs.addClass('resp-easy-accordion');
							$respTabs.find('.resp-tabs-list').css('display', 'none');
						}
					}
					
					

					//Assigning the h2 markup to accordion title
					var $tabItemh2;
					$respTabs.find('.resp-tab-content').before("<h2 class='resp-accordion' role='tab'><span class='resp-arrow'></span></h2>");

					var itemCount = 0;
					$respTabs.find('.resp-accordion').each(function () {
						$tabItemh2 = $(this);
						var innertext = $respTabs.find('.resp-tab-item:eq(' + itemCount + ')').html();
						$respTabs.find('.resp-accordion:eq(' + itemCount + ')').append(innertext);
						$tabItemh2.attr('aria-controls', 'tab_item-' + (itemCount));
						itemCount++;
					});
					
					//Assigning the 'aria-controls' to Tab items
					var count = 0,
						$tabContent;
					$respTabs.find('.resp-tab-item').each(function () {
						$tabItem = $(this);
						$tabItem.attr('aria-controls', 'tab_item-' + (count));
						$tabItem.attr('role', 'tab');

						//First active tab, keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode 
						/*if(options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {                  
							$respTabs.find('.resp-tab-item').first().addClass('resp-tab-active');
							$respTabs.find('.resp-accordion').first().addClass('resp-tab-active');
							$respTabs.find('.resp-tab-content').first().addClass('resp-tab-content-active').attr('style', 'display:block');
						}*/

                         if(options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {                  

							  var index=$($respTabs.find('.resp-tab-active')).index();
							  if(index>0){
							   $respTabs.find('.resp-tab-item:eq('+index+')').addClass('resp-tab-active');
							   $respTabs.find('.resp-accordion:eq('+index+')').addClass('resp-tab-active');
							   $respTabs.find('.resp-tab-content:eq('+index+')').addClass('resp-tab-content-active').attr('style', 'display:block');
							  }else{
							   $respTabs.find('.resp-tab-item').first().addClass('resp-tab-active');
							   $respTabs.find('.resp-accordion').first().addClass('resp-tab-active');
							   $respTabs.find('.resp-tab-content').first().addClass('resp-tab-content-active').attr('style', 'display:block');
							  }
							  $respTabs.trigger('activations', this);
                    }
						//Assigning the 'aria-labelledby' attr to tab-content
						var tabcount = 0;
						$respTabs.find('.resp-tab-content').each(function () {
							$tabContent = $(this);
							$tabContent.attr('aria-labelledby', 'tab_item-' + (tabcount));
							tabcount++;
						});
						count++;
					});

					//Tab Click action function
					$respTabs.find("[role=tab]").each(function () {
						var $currentTab = $(this);
						$currentTab.click(function () {

							var $tabAria = $currentTab.attr('aria-controls');

							if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
								$respTabs.find('.resp-tab-content-active').slideUp('', function () { $(this).addClass('resp-accordion-closed'); });
								$currentTab.removeClass('resp-tab-active');
								LOGGER.info("clicked accordian is the current accordian. closing it now")
								return false;
							}
							if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
								//Trigger tab de-activation event
								$currentTab.trigger('tabdeactivate', $respTabs.find('.resp-tab-active'));
								$respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
								$respTabs.find('.resp-tab-content-active').slideUp().removeClass('resp-tab-content-active resp-accordion-closed');
								$respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');

								$respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').slideDown().addClass('resp-tab-content-active');
							} else {
								//Checking if the clicked tab is the current tab
								if($currentTab.hasClass('resp-tab-active')){
									return false;
								}
								//Trigger tab de-activation event
								$currentTab.trigger('tabdeactivate', $respTabs.find('.resp-tab-active'));
								$respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
								$respTabs.find('.resp-tab-content-active').removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed');
								$respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');
								$respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').addClass('resp-tab-content-active').attr('style', 'display:block');
							}
							//Trigger tab activation event
							$currentTab.trigger('tabactivate', $currentTab);
						});
						//Window resize function                   
						$(window).resize(function () {
							$respTabs.find('.resp-accordion-closed').removeAttr('style');
						});
					});
				});
				
			}
        }
    });
})(jQuery);

