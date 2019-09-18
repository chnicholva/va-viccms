/*
 * SOL - Searchable Option List jQuery plugin
 * Version 2.0.0
 * https://pbauerochse.github.io/searchable-option-list/
 *
 * Copyright 2015, Patrick Bauerochse
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 */

/*jslint nomen: true */
function initializeSolLibrary($, window, document) {
    'use strict';

    var KEY_CODE = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46
    };

    // constructor
    var SearchableOptionList = function ($element, options) {
        this.$originalElement = $element;
        this.options = options;

        // allow setting options as data attribute
        // e.g. <select data-sol-options="{'allowNullSelection':true}">
        this.metadata = this.$originalElement.data('sol-options');
    };

    // plugin prototype
    SearchableOptionList.prototype = {

        SOL_OPTION_FORMAT: {
            type: 'option',        // fixed
            value: undefined,       // value that will be submitted
            selected: false,           // boolean selected state
            disabled: false,           // boolean disabled state
            label: undefined,       // label string
            tooltip: undefined        // tooltip string
        },
        SOL_OPTIONGROUP_FORMAT: {
            type: 'optiongroup',    // fixed
            label: undefined,        // label string
            tooltip: undefined,        // tooltip string
            disabled: false,            // all children disabled boolean property
            children: undefined         // array of SOL_OPTION_FORMAT objects
        },

        DATA_KEY: 'sol-element',
        WINDOW_EVENTS_KEY: 'sol-window-events',

        // default option values
        defaults : {
            data : undefined,
            name: undefined,           // name attribute, can also be set as name="" attribute on original element or data-sol-name=""
            defaultMaxRowsInCurrentSelections: undefined,
            isRTL: undefined,
            shouldDefaultFocusonInput: undefined,
            isControlDisabled: false,
            key : undefined,
            texts : {
                noItemsAvailable: 'No entries found',
                selectAll: 'Select all',
                quickDelete: 'x',
                searchplaceholder: 'Click here to search',
                expand: "{0} more",
                collapse: "less",
                optionSetItemAriaLabel: "{0} {1} of {2}",
                typeSomethingInputAriaLabel: "Enter a value to filter on, or select enter to show available options.",
                selectedListNavigation: "In selected list, use left right arrow keys to navigate, press delete key to remove selection",
                displayItemsRemoved: "{0} Removed",
                moreLinkTitle: "{0} results. Select Enter to show all results in the list.",
                lessLinkTitle: "Show less. Select enter to include fewer results the list.",
                selectAllFocusTitle: "Select all. List includes {0} items. Use the arrow keys to move up or down in the list.",
                selectAllDeselect: "{0} items removed",
                selectAllSelect: "{0} items selected",
                totalItems: "{0} items",
                deleteItemTitle: "Remove the value"
            },

            events: {
                onInitialized: undefined,
                onRendered: undefined,
                onOpen: undefined,
                onClose: undefined,
                onChange: undefined,
                onScroll: function () {

                    var posY = Math.floor(this.$input.offset().top) - Math.floor(this.config.scrollTarget.scrollTop()) + Math.floor(this.$input.outerHeight()),
                        selectionContainerWidth = this.$innerContainer.outerWidth(false);

                    if (this.$innerContainer.css('display') !== 'block') {
                        // container has a certain width
                        // make selection container a bit wider
                        selectionContainerWidth = Math.ceil(selectionContainerWidth * 1.2);
                    } else {
                        // no border radius on top
                        this.$selectionContainer
                            .css('border-top-right-radius', 'initial');

                        if (this.$actionButtons) {
                            this.$actionButtons
                                .css('border-top-right-radius', 'initial');
                        }
                    }

                    this.$selectionContainer
                        .css('top', Math.floor(posY))
                        .css('left', Math.floor(this.$container.offset().left))
                        .css('width', selectionContainerWidth);
                }
            },

            useBracketParameters: false,
            multiple: undefined,
            showSelectAll: false,
            showSelectionBelowList: false,
            allowNullSelection: false,
            scrollTarget: undefined,
            maxHeight: undefined,
            converter: undefined
        },

        // initialize the plugin
        init: function () {
            this.config = $.extend(true, {}, this.defaults, this.options, this.metadata);

            var originalName = this._getNameAttribute();
            if (!originalName) {
                this._showErrorLabel('name attribute is required');
                return;
            }

            this.config.multiple = this.config.multiple || this.$originalElement.attr('multiple');

            if (!this.config.scrollTarget) {
                this.config.scrollTarget = $(window);
            }

            this._registerWindowEventsIfNeccessary();
            this._attachWindowResizeHandler();
            this._initializeUiElements();
            this._initializeInputEvents();
            this._initializeData();

            // take original form element out of form submission
            // by removing the name attribute
            this.$originalElement
                .data(this.DATA_KEY, this)
                .removeAttr('name')
                .data('sol-name', originalName)
                .hide();
            if (this.config.shouldDefaultFocusonInput) {
            	if (this.$input) {
            		this.$input.focus(); //Focus Input after Init
            	}
            }

            return this;
        },

        _getNameAttribute: function () {
            return this.config.name || this.$originalElement.data('sol-name') || this.$originalElement.attr('name');
        },

        // shows an error label
        _showErrorLabel: function (message) {
            var $errorMessage = $('<div style="color: red; font-weight: bold;" />').html(message);
            if (!this.$container) {
                $errorMessage.insertAfter(this.$originalElement);
            } else {
                this.$container.append($errorMessage);
            }
        },

        // Attach Window Resize handler
        _attachWindowResizeHandler: function () {
            $(window).resize(function (e) {
                this.refreshControl(this.getValues());
            }.bind(this));
        },

        // register click handler to determine when to trigger the close event
        _registerWindowEventsIfNeccessary: function () {
            if (!window[this.WINDOW_EVENTS_KEY]) {
                $(document).on('mousedown touchstart', function (event) {
                    // if clicked inside a sol element close all others
                    // else close all sol containers
                    var $closestSolContainer = $(event.target).closest('.sol-inner-container'),
                        $clickedWithinThisSolContainer = $closestSolContainer.first().parent('.sol-container');

                    $('.sol-container')
                        .not($clickedWithinThisSolContainer)
                        .each(function (index, item) {
                            $(item)
                                .data(SearchableOptionList.prototype.DATA_KEY)
                                .close();
                        });
                });

                // remember we already registered the global events
                window[this.WINDOW_EVENTS_KEY] = true;
            }
        },

        // add sol ui elements
        _initializeUiElements: function () {
            var self = this;

            this.internalScrollWrapper = function () {
                if ($.isFunction(self.config.events.onScroll)) {
                    self.config.events.onScroll.call(self);
                }
            };

            var inputElement = '<input id={0}_ledit type="text"/>';
            this.$input = $(inputElement.replace('{0}', this.config.key))
                .attr('placeholder', this.config.texts.searchplaceholder)
                .attr('aria-label', this.config.texts.typeSomethingInputAriaLabel)
                .attr('aria-haspopup', true)
                .attr('title', '')
        		.click(function () {
        		    self.clearAllSelections();
        		    this.focus();
        		});

            var noresultsContainer = '<div id={0} class="sol-no-results"/>';
            this.$noResultsItem = $(noresultsContainer.replace('{0}', (this.config.key + "_no-results")))
				.html(this.config.texts.noItemsAvailable).hide();

            this.$caret = $('<div class="sol-caret-container" title=""><b class="caret"/></div>').click(function () {
                self.clearAllSelections();
                self.toggle();
            });
            var $inputContainer = $('<div class="sol-input-container"/>').append(this.$input);

            this.$innerContainer = $('<div class="sol-inner-container"/>').append($inputContainer).append(this.$caret);
            this.$selection = $('<ul class="sol-selection" role="listbox"/>');
            this.$selectionContainer = $('<div class="sol-selection-container" role="application" aria-multiselectable="true"/>').append(this.$noResultsItem).append(this.$selection).appendTo(this.$innerContainer);
            var solContainer = '<div id={0}_i class="sol-container" aria-haspopup="true"/>';
            this.$container = $(solContainer.replace('{0}', this.config.key)).data(this.DATA_KEY, this).append(this.$innerContainer).insertBefore(this.$originalElement);

            var moreLessElementName = this.config.key + "_moreless-link";
            var moreLessLinkString = ('<div name={0} class="sol-moreless-link-normal" role="button" tabIndex="-1"/>').replace('{0}', moreLessElementName);
            this.$moreLink = $(moreLessLinkString).click(function () {
                self.clearAllSelections();
                self.expandAndShowLessLink(true);
            }).hide(),
            this.$lessLink = $(moreLessLinkString).html(this.config.texts.collapse).click(function () {
                self.clearAllSelections();
                if (self.$currentSelectionContainer.hasClass('sol-current-selection-expanded')) {
                    self.$currentSelectionContainer[0].scrollTop = 0;
                }
                self.collapseAndShowMoreLink();
            }).hide();
            this.$moreLink.blur(function (event) {
                $(this).removeClass("sol-moreless-link-focused");
                $(this).addClass("sol-moreless-link-normal");

            });
            this.$lessLink.blur(function (event) {
                $(this).removeClass("sol-moreless-link-focused");
                $(this).addClass("sol-moreless-link-normal");
            });
            this.$lessLink.attr('aria-label', this.config.texts.lessLinkTitle);
            this.$lessLink.attr('title', '');
            this.overflowingCurrentSelectionCount = 0;

            this.$moreLessContainer = $('<div class="sol-moreless-container"/>').append(this.$moreLink).append(this.$lessLink).hide();
            this.$moreLessContainer.click(function (event) {
                if (event.target.getAttribute("name") != moreLessElementName) {
                    self.$input.focus();
                }
            });
            // add selected items display container
            this.$currentSelectionContainer = $('<div class="sol-current-selection-normal" role="listbox"/>');
            if (this.config.showSelectionBelowList) {
                this.$moreLessContainer.insertAfter(this.$innerContainer);
                this.$currentSelectionContainer.insertAfter(this.$moreLessContainer);

            } else {
                this.$moreLessContainer.insertBefore(this.$innerContainer);
                this.$currentSelectionContainer.insertBefore(this.$moreLessContainer);
            }

            this.$innerContainer.click(function (e) {
                var element = $(e.target.parentElement);
                if (element.attr("name") != self.config.key + "sol-label") {
                    self.$input.focus();
                }
            });

            // multiple values selectable
            if (this.config.multiple) {

                // buttons for (de-)select all
                if (this.config.showSelectAll) {
                    var selectAllString = ('<input type="checkbox" class="sol-checkbox" id={0} >').replace('{0}', this.config.key + "_selectAll");
                    this.$selectAllCheckbox = $(selectAllString)
					.click(function (event) {
					    self.$alertContainer[0].innerHTML = "";
					    self.clearAllSelections();
					    self.toggleSelectAll(this);
					})
					.attr('aria-label', this.formatString(this.config.texts.selectAllFocusTitle, this.config.data.length));

                    var selectAllLabelElement = $(this.formatString('<label name={0} class="sol-label" for={1}>', this.config.key + "sol-label", this.config.key + "_selectAll"));
                    var selectAllDiv = ('<div class="sol-optionitem-text">{0}</div>').replace('{0}', this.config.texts.selectAll);
                    var numberOfItemsDiv = this.formatString('<div id={0} class="sol-optionitem-text">{1}</div>', this.config.key + "sol-no-of-Items", this.formatString(this.config.texts.totalItems, this.config.data.length));
                    var solLabelDivContainer = $('<div class="sol-label-text"></div></label>').append(selectAllDiv).append(numberOfItemsDiv);
                    var selectAllButtonContainer = $(selectAllLabelElement).append(this.$selectAllCheckbox).append(solLabelDivContainer);
                    this.$actionButtons = $('<div class="sol-action-buttons"/>').append(selectAllButtonContainer).append('<div class="sol-clearfix"/>');
                    this.$selectionContainer.prepend(this.$actionButtons);
                }
            }

            // dimensions
            if (this.config.maxHeight) {
                this.$selection.css('max-height', this.config.maxHeight);
            }

            this.currentSelectionContainerNonExpandedMaxHeight = 26 * this.config.defaultMaxRowsInCurrentSelections + 10; // height per row * number of default rows + padding
            this.currentSelectionContainerExpandedMaxHeight = 204;

            if ($.isFunction(this.config.events.onRendered)) {
                this.config.events.onRendered.call(this, this);
            }

            this.$alertContainer = $('<div class="sol-alert-text" aria-live="assertive" aria-atomic="true" aria-relevant="additions"></div>');
            this.$container.append(this.$alertContainer);
        },

        _initializeInputEvents: function () {
            // form event
            var self = this,
                $form = this.$input.parents('form').first();

            if ($form && $form.length === 1 && !$form.data(this.WINDOW_EVENTS_KEY)) {
                var resetFunction = function () {
                    var $changedItems = [];

                    $form.find('.sol-option input').each(function (index, item) {
                        var $item = $(item),
                            initialState = $item.data('sol-item').selected;

                        if ($item.prop('checked') !== initialState) {
                            $item
                                .prop('checked', initialState)
                                .trigger('change', initialState);
                            $changedItems.push($item);
                        }
                    });

                    if ($changedItems.length > 0 && $.isFunction(self.config.events.onChange)) {
                        self.config.events.onChange.call(self, self, $changedItems);
                    }
                };

                $form.on('reset', function (event) {
                    // unfortunately the reset event gets fired _before_
                    // the inputs are actually reset. The only possibility
                    // to overcome this is to set an interval to execute
                    // own scripts some time after the actual reset event

                    // before fields are actually reset by the browser
                    // needed to reset newly checked fields
                    resetFunction.call(self);

                    // timeout for selection after form reset
                    // needed to reset previously checked fields
                    setTimeout(function () {
                        resetFunction.call(self);
                    }, 100);
                });

                $form.data(this.WINDOW_EVENTS_KEY, true);
            }

            // text input events
            this.$input
                .on('input', function () {
                    self._applySearchTermFilter();
                    if ((self.$input.val() || '').length > 0) {
                        self.open();
                    }
                    self.repositionFlyOut();
                });

            // keyboard navigation
            this.$container
                .on('keydown', function (e) {
                    window.isKeyPressed = true;
                    var keyCode = e.keyCode,
                	preventDefault = false;

                    if (keyCode === window.KEY_CODE.ESC) {
                        if (self.$selectAllCheckbox.is(':visible')) {
                            // escape key
                            self._setKeyBoardNavigationMode(false);

                            // reset input and result filter
                            self.$input.val('').trigger('input');

                            // trigger closing of container
                            self.$caret.trigger('click');
                            self.$input.focus();

                            preventDefault = true;
                        } else {
                            //Close the Flyout
                            self.close();
                        }
                    }


                    // event handling for keyboard navigation
                    var $currentHighlightedOption,
                        $nextHighlightedOption,
                        $currentHighlightedSelection,
                        $nextHighlightedSelection,
                        directionValue,
                        currentHighlightedSelectionIndex,
                        currentHighlightedIndex,
                        $allVisibleOptions = self.$selection.find('.sol-option:visible'),
                        $allSelections = self.$currentSelectionContainer.find('.sol-selected-display-item'),
                        totalOptions = $allVisibleOptions.length,
                        totalSelections = $allSelections.length,
                        visibleSelections = $allSelections.not('.sol-visibility-hidden').length,
                        isSelectionContainerVisible = totalSelections > 0,
                        focusSelectionContainer = false,
                        focusMoreLessLink = false,
                        focusInput = false,
                        focusSelectAll = false;

                    self._setKeyBoardNavigationMode(true);

                    // Get currently highlighted option index
                    $currentHighlightedOption = self.$selection.find('.sol-option.keyboard-selection');
                    currentHighlightedIndex = $allVisibleOptions.index($currentHighlightedOption);

                    // Get currently highlighted selection option
                    $currentHighlightedSelection = self.$currentSelectionContainer.find('.sol-selected-display-item.keyboard-selection');
                    currentHighlightedSelectionIndex = $allSelections.index($currentHighlightedSelection);

                    var withinSelections = (currentHighlightedSelectionIndex >= 0 && currentHighlightedSelectionIndex <= totalSelections - 1);
                    var withinAvailableList = self.$selectAllCheckbox.is(':focus') || // If Select All is focused
                            (currentHighlightedIndex >= 0 && currentHighlightedIndex <= totalOptions - 1); // Or we are in available list

                    var isMoreLessLinkContainerVisible = self.$moreLessContainer.is(':visible');
                    var isMorelinkFocused = self.$moreLink.hasClass('sol-moreless-link-focused');
                    var isLesslinkFocused = self.$lessLink.hasClass('sol-moreless-link-focused');

                    var isInputFocused = self.$input.is(':focus');

                    if (keyCode === window.KEY_CODE.TAB) {
                        if (!e.shiftKey) {
                            focusSelectionContainer = !withinSelections // If not already in selections
                                && isSelectionContainerVisible // and the selection container should be visible
                                && withinAvailableList; // Moving within available list

                            focusMoreLessLink = isSelectionContainerVisible && withinSelections && isMoreLessLinkContainerVisible;

                            // If we are on the last element and TAB is pressed and selection container is not visible, focusInput
                            focusInput = (!isSelectionContainerVisible && withinAvailableList) // No selections container and within available list
                                || (isSelectionContainerVisible && withinSelections && !isMoreLessLinkContainerVisible)
                            // Or selections container is there and we are within the selections but more or less link is not available
                                || (isMoreLessLinkContainerVisible && (isMorelinkFocused || isLesslinkFocused));
                            // Or more or less link is focused

                            // If input text box is focused and Select All is not focused, focus it
                            focusSelectAll = self.$selectAllCheckbox.is(':visible') && !self.$selectAllCheckbox.is(':focus')
                                && isInputFocused;
                        }

                            // Reverse the focus logic if shift key is pressed
                        else {
                            focusSelectionContainer = (isSelectionContainerVisible && !isMoreLessLinkContainerVisible && isInputFocused)
                                // If more less link is not visible and input box is focused and the selection container is visible
                                 || (isSelectionContainerVisible && isMoreLessLinkContainerVisible && (isMorelinkFocused || isLesslinkFocused))
                            // Or more or less link is focused

                            focusMoreLessLink = isMoreLessLinkContainerVisible && isInputFocused; // If more less container is visible and input box is focused

                            // If we are on the last element and TAB is pressed and selection container is not visible, focusInput
                            focusInput = withinAvailableList; // If you are within available list

                            // If input text box is focused and Select All is not focused, focus it
                            focusSelectAll = self.$selectAllCheckbox.is(':visible') && !self.$selectAllCheckbox.is(':focus') // If Select All is not already selected
                            && ((withinSelections && !isInputFocused) // and we are within selections and input box is not focused
                            || (!isSelectionContainerVisible && isInputFocused)); // or selection container is not visible and input box is focused
                        }

                        // Clear all selections
                        self.clearAllSelections();

                        preventDefault = true;
                        if (focusSelectionContainer) {
                            // Select and focus the first element in the selection list
                            $nextHighlightedSelection = $($allSelections[0]).addClass('keyboard-selection');
                            $nextHighlightedSelection.focus();
                            $nextHighlightedSelection.attr('aria-label', $nextHighlightedSelection[0].firstChild.innerText + self.config.texts.selectedListNavigation);
                        }
                        else if (focusMoreLessLink) {
                            // Based on which link is visible, focus that link
                            if (self.$moreLink.is(':visible')) {
                                self.toggleMoreLessLinkFocus(self.$moreLink);
                            }
                            else if (self.$lessLink.is(':visible')) {
                                self.toggleMoreLessLinkFocus(self.$lessLink);
                            }
                        }
                        else if (focusInput) {
                            // Focus the input box
                            self.$input.focus();
                        }
                        else if (focusSelectAll) {
                            // Focus and select the Select All button
                            self.focusSelectAll();

                        }
                        else {
                            // If we are not focusing anything within Multiselect control, do not prevent default
                            self.close();
                            preventDefault = false;
                        }
                    }

                    // If we are navigating within selections
                    if ((keyCode === window.KEY_CODE.LEFT || keyCode === window.KEY_CODE.RIGHT) && withinSelections) {
                        // negative for up or shift+tab, positive for down or tab
                        directionValue = keyCode === window.KEY_CODE.LEFT ? -1 : 1;

                        var indexOfNextHighlightedSelection = currentHighlightedSelectionIndex + directionValue;

                        if (indexOfNextHighlightedSelection < 0) {
                            indexOfNextHighlightedSelection = 0;
                        } else if (indexOfNextHighlightedSelection >= visibleSelections) {
                            indexOfNextHighlightedSelection = visibleSelections - 1;
                        }

                        // Remove the highlight from the last item
                        $currentHighlightedSelection.removeClass('keyboard-selection');

                        // Focus and highlight the next selection
                        $nextHighlightedSelection = $($allSelections[indexOfNextHighlightedSelection]).addClass('keyboard-selection');
                        $nextHighlightedSelection.focus();

                        preventDefault = true;
                    }

                    // If we are navigating within selections and RIGHT ot LEFT key is pressed, close the available list
                    if ((keyCode === window.KEY_CODE.LEFT || keyCode === window.KEY_CODE.RIGHT) && withinAvailableList) {
                        self.close();
                        self.$input.focus();
                    }

                    // If we are navigating within the available list
                    if ((keyCode === window.KEY_CODE.UP || keyCode === window.KEY_CODE.DOWN) && withinAvailableList) {
                        // Remove other selections
                        self.$actionButtons.removeClass('keyboard-selection');

                        // negative for up or shift+tab, positive for down or tab
                        directionValue = keyCode === window.KEY_CODE.UP ? -1 : 1;

                        var indexOfNextHighlightedOption = currentHighlightedIndex + directionValue;

                        if (indexOfNextHighlightedOption < 0) {
                            // If we are trying to move above the last option, focus and select the Select All button
                            self.focusSelectAll();
                        } else if (indexOfNextHighlightedOption >= totalOptions) {
                            indexOfNextHighlightedOption = totalOptions - 1;
                        }

                        // Remove the highlight from the last item
                        $currentHighlightedOption.removeClass('keyboard-selection');

                        if (indexOfNextHighlightedOption >= 0) {
                            // If indexOfNextHighlightedOption is within range, focus and highlight it
                            $nextHighlightedOption = $($allVisibleOptions[indexOfNextHighlightedOption]).addClass('keyboard-selection');
                            $nextHighlightedOption.find('input').focus();
                            self.$selection.scrollTop(self.$selection.scrollTop() + $nextHighlightedOption.position().top);
                        }

                        // If shift key is pressed and we are navigating using UP or DOWN arrow key, then besides highlighting also select the next option
                        if (e.shiftKey && (keyCode === window.KEY_CODE.UP || keyCode === window.KEY_CODE.DOWN)) {
                            $currentHighlightedOption = self.$selection.find('.sol-option.keyboard-selection input');
                            if (!$currentHighlightedOption.prop('checked')) {
                                $currentHighlightedOption.trigger('change', true);
                            }
                        }

                        preventDefault = true;
                    }

                    if (keyCode === window.KEY_CODE.ENTER || keyCode === window.KEY_CODE.SPACE) {

                        preventDefault = true;

                        // For firefox, OnChange fires for SPACE which takes care of model updates.
                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && keyCode === window.KEY_CODE.SPACE) {
                            return;
                        }

                        // If more link is focused, click it on TAB or ENTER and focus less link
                        if (self.$moreLink.hasClass('sol-moreless-link-focused')) {
                            self.$moreLink.click();
                            self.$lessLink.addClass('sol-moreless-link-focused');
                        }

                            // If less link is focused, click it on TAB or ENTER and focus more link
                        else if (self.$lessLink.hasClass('sol-moreless-link-focused')) {
                            self.$lessLink.click();
                            self.$moreLink.addClass('sol-moreless-link-focused');
                        }

                            // If Enter is pressed and input box is focused, then open the available list
                        else if (keyCode === window.KEY_CODE.ENTER && self.$input.is(':focus')) {
                            self.toggle(); // Toogle available list flyout
                        }

                            // If Select All is focused call the click event to select all options for both enter and space
                        else if (self.$selectAllCheckbox.is(':focus')) {
                            self.$selectAllCheckbox.click();
                            if (keyCode === window.KEY_CODE.ENTER) {
                                self.close();			// After selecting all items, close the flyout
                                self.$input.focus();	// And focus the input box
                            }
                        }

                            // If any available option is focused select that option for both enter and space
                        else if (withinAvailableList) {
                            $currentHighlightedOption = self.$selection.find('.sol-option.keyboard-selection input');

                            // Do not close available list if space was pressed, but close it if it is enter
                            $currentHighlightedOption.trigger('change', !$currentHighlightedOption.prop('checked'));

                            if (keyCode === window.KEY_CODE.ENTER) {
                                // toggle current selected item with enter
                                // For space, change event is triggered by default
                                //$currentHighlightedOption.trigger('change', !$currentHighlightedOption.prop('checked'));

                                self.close();
                                self.$input.focus();
                            }
                        }
                        else {
                            // If the user meant to enter space probably in the input box
                            if (keyCode === window.KEY_CODE.SPACE) {
                                preventDefault = false;
                            }
                        }
                    }

                    if (keyCode === window.KEY_CODE.DELETE && withinSelections && !self.config.isControlDisabled) {
                        preventDefault = true;
                        self.$alertContainer[0].innerHTML = "";
                        self.$alertContainer[0].innerHTML = (self.config.texts.displayItemsRemoved).replace('{0}', $currentHighlightedSelection[0].firstChild.innerText);
                        $currentHighlightedSelection.find('.sol-quick-delete').click();
                    }

                    if (preventDefault) {
                        e.preventDefault();
                        return false;
                    }
                });
        },

        toggleMoreLessLinkFocus: function (link) {
            if (link.hasClass('sol-moreless-link-normal')) {
                link.removeClass('sol-moreless-link-normal');
                link.addClass('sol-moreless-link-focused');
                link.focus();
            }
            else {
                link.removeClass('sol-moreless-link-focused');
                link.addClass('sol-moreless-link-normal');
            }
        },

        clearAllSelections: function () {
            // Selected list
            this.$currentSelectionContainer.find('.sol-selected-display-item.keyboard-selection').removeClass('keyboard-selection');

            // More - Less links
            this.$moreLink.removeClass('sol-moreless-link-focused');
            this.$moreLink.addClass('sol-moreless-link-normal');
            this.$lessLink.removeClass('sol-moreless-link-focused');
            this.$lessLink.addClass('sol-moreless-link-normal');

            // Select All button
            this.$actionButtons.removeClass('keyboard-selection');

            // Available list
            this.$selection.find('.sol-option.keyboard-selection').removeClass('keyboard-selection');
        },

        _setKeyBoardNavigationMode: function (keyboardNavigationOn) {

            if (keyboardNavigationOn) {
                // on
                this.keyboardNavigationMode = true;
                this.$selection.addClass('sol-keyboard-navigation');
            } else {
                // off
                this.keyboardNavigationMode = false;
                this.$selection.find('.sol-option.keyboard-selection')
                this.$selection.removeClass('sol-keyboard-navigation');
                this.$selectionContainer.find('.sol-option.keyboard-selection').removeClass('keyboard-selection');
                this.$selection.scrollTop(0);
            }
        },

        _applySearchTermFilter: function () {
            if (!this.items || this.items.length === 0) {
                return;
            }

            var searchTerm = this.$input.val(),
                lowerCased = (searchTerm || '').toLowerCase();

            // show previously filtered elements again
            this.$selectionContainer.find('.sol-filtered-search').removeClass('sol-filtered-search');
            this._setNoResultsItemVisible(false);

            if (lowerCased.trim().length > 0) {
                this._findTerms(this.items, lowerCased);
            }

            var visibleOptions = this.getNonFilteredOptions().length;
            $('#' + this.config.key + "sol-no-of-Items").html(this.formatString(this.config.texts.totalItems, visibleOptions))
            // Handling for Select All Button
            this.$selectAllCheckbox.prop('checked', this.areAllOptionsChecked());
            this.$selectAllCheckbox.attr('aria-label', this.formatString(this.config.texts.selectAllFocusTitle, visibleOptions));
        },

        _findTerms: function (dataArray, searchTerm) {
            if (!dataArray || !$.isArray(dataArray) || dataArray.length === 0) {
                return;
            }

            var self = this;

            // reset keyboard navigation mode when applying new filter
            this._setKeyBoardNavigationMode(false);

            $.each(dataArray, function (index, item) {
                if (item.type === 'option') {
                    var $element = item.displayElement,
                        elementSearchableTerms = (item.label + ' ' + item.tooltip).trim().toLowerCase();

                    if (elementSearchableTerms.indexOf(searchTerm) === -1) {
                        $element.addClass('sol-filtered-search');
                    }
                } else {
                    self._findTerms(item.children, searchTerm);
                    var amountOfUnfilteredChildren = item.displayElement.find('.sol-option:not(.sol-filtered-search)');

                    if (amountOfUnfilteredChildren.length === 0) {
                        item.displayElement.addClass('sol-filtered-search');
                    }
                }
            });

            this._setNoResultsItemVisible(this.getNonFilteredOptions().length === 0);
        },

        _initializeData: function () {
            if (!this.config.data) {
                this.items = this._detectDataFromOriginalElement();
            } else if ($.isFunction(this.config.data)) {
                this.items = this._fetchDataFromFunction(this.config.data);
            } else if ($.isArray(this.config.data)) {
                this.items = this._fetchDataFromArray(this.config.data);
            } else if (typeof this.config.data === (typeof 'a string')) {
                this._loadItemsFromUrl(this.config.data);
            } else {
                this._showErrorLabel('Unknown data type');
            }

            if (this.items) {
                // done right away -> invoke postprocessing
                this._processDataItems(this.items);
            }
        },

        _detectDataFromOriginalElement: function () {
            if (this.$originalElement.prop('tagName').toLowerCase() === 'select') {
                var self = this,
                    solData = [];

                $.each(this.$originalElement.children(), function (index, item) {
                    var $item = $(item),
                        itemTagName = $item.prop('tagName').toLowerCase(),
                        solDataItem;

                    if (itemTagName === 'option') {
                        solDataItem = self._processSelectOption($item);
                        if (solDataItem) {
                            solData.push(solDataItem);
                        }
                    } else if (itemTagName === 'optgroup') {
                        solDataItem = self._processSelectOptgroup($item);
                        if (solDataItem) {
                            solData.push(solDataItem);
                        }
                    } else {
                        self._showErrorLabel('Invalid element found in select: ' + itemTagName + '. Only option and optgroup are allowed');
                    }
                });

                return this._invokeConverterIfNeccessary(solData);
            } else if (this.$originalElement.data('sol-data')) {
                var solDataAttributeValue = this.$originalElement.data('sol-data');
                return this._invokeConverterIfNeccessary(solDataAttributeValue);
            } else {
                this._showErrorLabel('Could not determine data from original element. Must be a select or data must be provided as data-sol-data="" attribute');
            }
        },

        _processSelectOption: function ($option) {
            return $.extend({}, this.SOL_OPTION_FORMAT, {
                value: $option.val(),
                selected: $option.prop('selected'),
                disabled: $option.prop('disabled'),
                label: $option.html(),
                tooltip: $option.attr('title'),
                element: $option
            });
        },

        _processSelectOptgroup: function ($optgroup) {
            var self = this,
                solOptiongroup = $.extend({}, this.SOL_OPTIONGROUP_FORMAT, {
                    label: $optgroup.attr('label'),
                    tooltip: $optgroup.attr('title'),
                    disabled: $optgroup.prop('disabled'),
                    children: []
                }),
                optgroupChildren = $optgroup.children('option');

            $.each(optgroupChildren, function (index, item) {
                var $child = $(item),
                    solOption = self._processSelectOption($child);

                // explicitly disable children when optgroup is disabled
                if (solOptiongroup.disabled) {
                    solOption.disabled = true;
                }

                solOptiongroup.children.push(solOption);
            });

            return solOptiongroup;
        },

        _fetchDataFromFunction: function (dataFunction) {
            return this._invokeConverterIfNeccessary(dataFunction(this));
        },

        _fetchDataFromArray: function (dataArray) {
            return this._invokeConverterIfNeccessary(dataArray);
        },

        _loadItemsFromUrl: function (url) {
            var self = this;
            $.ajax(url, {
                success: function (actualData) {
                    self.items = self._invokeConverterIfNeccessary(actualData);
                    if (self.items) {
                        self._processDataItems(self.items);
                    }
                },
                error: function (xhr, status, message) {
                    self._showErrorLabel('Error loading from url ' + url + ': ' + message);
                }
            });
        },

        _invokeConverterIfNeccessary: function (dataItems) {
            if ($.isFunction(this.config.converter)) {
                return this.config.converter.call(this, this, dataItems);
            }
            return dataItems;
        },

        _processDataItems: function (solItems) {
            if (!solItems) {
                this._showErrorLabel('Data items not present. Maybe the converter did not return any values');
                return;
            }

            if (solItems.length === 0) {
                this._setNoResultsItemVisible(true);
                return;
            }

            var self = this;
            var items = solItems;
            $.each(solItems, function (index, item) {
                if (item.type === SearchableOptionList.prototype.SOL_OPTION_FORMAT.type) {
                    self._renderOption(item, index, items.length);
                } else if (item.type === SearchableOptionList.prototype.SOL_OPTIONGROUP_FORMAT.type) {
                    self._renderOptiongroup(item);
                } else {
                    self._showErrorLabel('Invalid item type found ' + item.type);
                    return;
                }
            });

            if (this.$selectionContainer.find('input[type="checkbox"]:not([disabled]):checked').length === solItems.length) {
                this.$selectAllCheckbox.prop('checked', true);
            }

            if ($.isFunction(this.config.events.onInitialized)) {
                this.config.events.onInitialized.call(this, this, solItems);
            }
        },

        _renderOption: function (solOption, index, length, $optionalTargetContainer) {
            var self = this,
                $actualTargetContainer = $optionalTargetContainer || this.$selection,
                $inputElement,
                $labelText = $('<div class="sol-label-text sol-optionitem-text"/>').html(solOption.label.trim().length === 0 ? '&nbsp;' : solOption.label),
                $label,
                $displayElement,
                inputName = this._getNameAttribute();

            if (this.config.multiple) {
                // use checkboxes
                var optionCheckboxString = ('<input type="checkbox" id={0} class="sol-checkbox" name={0} >').split('{0}').join(this.config.key + "_checkbox");
                $inputElement = $(optionCheckboxString);

                if (this.config.useBracketParameters) {
                    inputName += '[]';
                }
            } else {
                // use radio buttons
                $inputElement = $('<input type="radio" class="sol-radio"/>')
                    .on('change', function () {
                        // when selected notify all others of being deselected
                        self.$selectionContainer.find('input[type="radio"][name="' + inputName + '"]').not($(this)).trigger('sol-deselect');
                    })
                    .on('sol-deselect', function () {
                        // remove display selection item
                        // TODO also better show it inline instead of above or below to save space
                        self._removeSelectionDisplayItem($(this));
                    });
            }

            $inputElement
                .on('change', function (event, check) {
                    self.checkUncheckOption($(this), check, index);
                })
                .data('sol-item', solOption)
                .prop('checked', solOption.selected)
                .prop('disabled', solOption.disabled)
                .attr('name', inputName)
                .attr('id', this.config.key + "_item" + (index + 1))
                .val(solOption.value);
            var ariaLabelString = this.formatString(this.config.texts.optionSetItemAriaLabel, solOption.tooltip, index + 1, length);

            var labelString = this.formatString('<label name={0} class="sol-label">', this.config.key + "sol-label");
            $label = $(labelString)
                        .attr('title', solOption.tooltip)
                        .attr('aria-label', ariaLabelString)
                        .append($inputElement)
                        .append($labelText);

            $displayElement = $('<li class="sol-option" role="option"/>').append($label);
            solOption.displayElement = $displayElement;

            $actualTargetContainer.append($displayElement);

            if (solOption.selected) {
                $displayElement.addClass('sol-option-selected');
                this._addSelectionDisplayItem($inputElement, index);
            }
        },

        _renderOptiongroup: function (solOptiongroup) {
            var self = this,
                $groupCaption = $('<div class="sol-optiongroup-label"/>')
                                    .attr('title', solOptiongroup.tooltip)
                                    .html(solOptiongroup.label),
                $groupItem = $('<div class="sol-optiongroup"/>').append($groupCaption);

            if (solOptiongroup.disabled) {
                $groupItem.addClass('disabled');
            }
            var group = solOptiongroup;
            if ($.isArray(solOptiongroup.children)) {
                $.each(solOptiongroup.children, function (index, item) {
                    self._renderOption(item, index, group.children.length, $groupItem);
                });
            }

            solOptiongroup.displayElement = $groupItem;
            this.$selection.append($groupItem);
        },

        _selectionChange: function ($changeItem, index, skipCallback) {
            if ($changeItem.prop('checked')) {
                this._addSelectionDisplayItem($changeItem, index);
                $changeItem.closest('.sol-option').addClass('sol-option-selected');
            } else {
                this._removeSelectionDisplayItem($changeItem);
                $changeItem.closest('.sol-option').removeClass('sol-option-selected');
            }
            $changeItem.closest('.sol-option').attr('aria-selected', $changeItem.prop('checked'));

            if (this.config.multiple) {
                // update position of selection container
                // to allow selecting more entries
                this.config.scrollTarget.trigger('scroll');
            } else {
                // only one option selectable
                // close selection container
                this.close();
            }

            if (!skipCallback && $.isFunction(this.config.events.onChange)) {
                this.config.events.onChange.call(this, this, $changeItem);
            }
        },

        _addSelectionDisplayItem: function ($changedItem, index) {
            var solOptionItem = $changedItem.data('sol-item'),
                $existingDisplayItem = solOptionItem.displaySelectionItem,
				self = this,
                $displayItemText;

            if (!$existingDisplayItem) {
                $displayItemText = $('<span class="sol-selected-display-item-text" role="option"/>').html(solOptionItem.label);
                var displaySelectedItemString = ('<div name={0} class="sol-selected-display-item" role="option" tabIndex="0"/>').replace('{0}', this.config.key + "_selected-item");
                $existingDisplayItem = $(displaySelectedItemString)
                    .append($displayItemText)
                    .attr('title', '')
                    .attr('data-value', solOptionItem.value)
					.attr('aria-label', solOptionItem.label)
                    .appendTo(this.$currentSelectionContainer)
					.click(function () {
					    self.clearAllSelections();
					    $(this).addClass('keyboard-selection');
					    $(this).focus();
					})
                    .blur(function (event) {
                        $(this).removeClass('keyboard-selection');
                    });

                // show remove button on display items if not disabled and null selection allowed
                if ((this.config.multiple || this.config.allowNullSelection) && !$changedItem.prop('disabled')) {
                    $('<span class="sol-quick-delete" role="button"/>')
                        .attr('title', this.config.texts.deleteItemTitle)
                        .attr('id', (this.config.key + (index + 1)) + "-selected-item-delete")
                        .html(this.config.texts.quickDelete)
                        .click(function () {
                            var $currentSelectedItem = $changedItem.data('sol-item').displaySelectionItem;
                            var $nextItemTobeHighlighted = self.getNextItemTobeHighlighted($currentSelectedItem);
                            self.clearAllSelections();
                            $changedItem.trigger('change', false);

                            if ($nextItemTobeHighlighted === null) {
                                self.$input.focus();
                            }

                            var $nextHighlightedOption = $($nextItemTobeHighlighted).addClass('keyboard-selection');
                            $nextHighlightedOption.focus();

                        })
                        .appendTo($existingDisplayItem);
                }

                solOptionItem.displaySelectionItem = $existingDisplayItem;
            }

            this.handleMoreLessLink(true, $existingDisplayItem);
        },

        _removeSelectionDisplayItem: function ($changedItem) {
            var solOptionItem = $changedItem.data('sol-item'),
                   $myDisplayItem = solOptionItem.displaySelectionItem;

            if ($myDisplayItem) {
                $myDisplayItem.remove();
                solOptionItem.displaySelectionItem = undefined;
            }

            // Unhide the first hidden item
            this.$currentSelectionContainer.find('.sol-selected-display-item.sol-visibility-hidden').first().removeClass('sol-visibility-hidden');

            this.handleMoreLessLink(false, $myDisplayItem);
        },

        handleMoreLessLink: function (adding, currentItem) {
            // Normal state
            if (this.$currentSelectionContainer.hasClass('sol-current-selection-normal')) {
                // Height more than threshold
                if (this.$currentSelectionContainer.prop('scrollHeight') > this.currentSelectionContainerNonExpandedMaxHeight) {
                    // Show More link
                    this.computeOverflowCount(adding);
                    this.showMoreLink();
                    currentItem.addClass('sol-visibility-hidden');
                }
                    // Height less than threshold
                else {
                    // Hide more less container
                    this.hideMoreLessContainer();
                }
            }
                // Expanded state
            else {
                // Height more than threshold
                if (this.$currentSelectionContainer.prop('scrollHeight') > this.currentSelectionContainerNonExpandedMaxHeight) {
                    // Show less link
                    this.computeOverflowCount(adding);
                    this.showLessLink();
                }
                    // Height less than threshold
                else {
                    // Change to normal state
                    this.$currentSelectionContainer.removeClass('sol-current-selection-expanded');
                    this.$currentSelectionContainer.addClass('sol-current-selection-normal');
                    // Hide more less container
                    this.hideMoreLessContainer();
                }
            }
        },

        computeOverflowCount: function (adding) {
            if (adding) {
                // Increment the count if we are adding
                this.overflowingCurrentSelectionCount += 1;
            }
            else {
                // Decrement the count if we are removing
                this.overflowingCurrentSelectionCount -= 1;
            }
        },

        showMoreLink: function () {
            this.$moreLessContainer.show();
            var moreLinkText = this.formatString(this.config.texts.expand, this.overflowingCurrentSelectionCount);
            this.$moreLink.html(moreLinkText);
            var moreLinkAriaLabel = (this.config.texts.moreLinkTitle).replace('{0}', moreLinkText);
            this.$moreLink.attr('aria-label', moreLinkAriaLabel);
            this.$moreLink.attr('title', '');
            this.$lessLink.hide();
            this.$moreLink.show();
        },

        showLessLink: function () {
            this.$moreLessContainer.show();
            this.$moreLink.hide();
            this.$lessLink.show();
        },

        hideMoreLessContainer: function () {
            this.overflowingCurrentSelectionCount = 0;

            this.$moreLessContainer.hide();

            var moreLinkText = this.formatString(this.config.texts.expand, this.overflowingCurrentSelectionCount);
            this.$moreLink.html(moreLinkText).hide();

            this.$lessLink.hide();
        },

        expandAndShowLessLink: function (shouldFocus) {
            this.$currentSelectionContainer.removeClass('sol-current-selection-normal');
            this.$currentSelectionContainer.addClass('sol-current-selection-expanded');
            this.$moreLink.hide();
            this.$lessLink.show();
            if (shouldFocus) {
                this.$lessLink.focus();
                this.$lessLink.removeClass('sol-moreless-link-normal');
                this.$lessLink.addClass('sol-moreless-link-focused');
            }
            // Show all the hidden items
            this.$currentSelectionContainer.find('.sol-selected-display-item.sol-visibility-hidden').each(function () { return $(this).removeClass('sol-visibility-hidden'); });
        },

        collapseAndShowMoreLink: function () {
            this.$currentSelectionContainer.removeClass('sol-current-selection-expanded');
            this.$currentSelectionContainer.addClass('sol-current-selection-normal');
            this.$lessLink.hide();
            this.showMoreLink();
            this.$moreLink.removeClass('sol-moreless-link-normal');
            this.$moreLink.addClass('sol-moreless-link-focused');
            this.$moreLink.focus();
            // Hide overflow count number of items
            var allItems = this.$currentSelectionContainer.find('.sol-selected-display-item');
            var hideFromIndex = allItems.length - this.overflowingCurrentSelectionCount;
            allItems.each(function (index) { if (index >= hideFromIndex) { $(this).addClass('sol-visibility-hidden'); } });
        },

        _setNoResultsItemVisible: function (visible) {
            if (visible) {
                this.$alertContainer[0].innerHTML = "";
                this.$alertContainer[0].innerHTML = this.config.texts.noItemsAvailable;
                this.$noResultsItem.show();

                if (this.$actionButtons) {
                    this.$actionButtons.hide();
                }

                this.$selection.addClass('sol-selection-hidden');

            } else {
                this.$noResultsItem.hide();

                if (this.$actionButtons) {
                    this.$actionButtons.show();
                }

                this.$selection.removeClass('sol-selection-hidden');
            }
        },

        isOpen: function () {
            return this.$container.hasClass('sol-active');
        },

        isClosed: function () {
            return !this.isOpen();
        },

        toggle: function () {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
            this.$input.focus();
        },

        open: function () {
            if (this.isClosed()) {
                this.clearAllSelections();

                this.$container.addClass('sol-active');
                this.$container.attr('aria-expanded', true);
                this.config.scrollTarget.bind('scroll', this.internalScrollWrapper).trigger('scroll');
                $(window).on('resize', this.internalScrollWrapper);

                if ($.isFunction(this.config.events.onOpen)) {
                    this.config.events.onOpen.call(this, this);
                }
                this.$input.focus();
            }
        },

        formatString : function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var returnValue = format;
            for (var i = 1; i < arguments.length; i++) {
                var actualValue = typeof (arguments[i]) == "undefined" || arguments[i] == null ? "" : arguments[i].toString();
                returnValue = returnValue.replace(new RegExp("\\{" + (i - 1) + "\\}", 'g'), actualValue);
            }
            return returnValue;
        },

        close: function () {
            if (this.isOpen()) {
                this._setKeyBoardNavigationMode(false);


                this.$container.removeClass('sol-active');
                this.$container.attr('aria-expanded', false);
                this.$selectionContainer.removeClass('sol-selection-container-reduced-height');
                this.$selection.removeClass('sol-selection-reduced-height');;
                this.config.scrollTarget.unbind('scroll', this.internalScrollWrapper);
                $(window).off('resize', this.internalScrollWrapper);

                // reset search on close
                this.$input.val('');
                this._applySearchTermFilter();

                if ($.isFunction(this.config.events.onClose)) {
                    this.config.events.onClose.call(this, this);
                }
            }
        },

        toggleSelectAll: function (selectAllCheckbox) {
            if (selectAllCheckbox.checked) {
                this.selectAll();
            }
            else {
                this.deselectAll();
            }
            this.focusSelectAll();
        },

        selectAll: function () {
            if (this.config.showSelectAll && this.config.multiple) {
                var $changedInputs = this.getNonFilteredOptions()
					.find('input[type="checkbox"]:not([disabled], :checked)')
					.trigger('change', true);
                if ($.isFunction(this.config.events.onChange)) {
                    this.config.events.onChange.call(this, this, $changedInputs);
                }
                var titleOnSelectAllClick = (this.config.texts.selectAllSelect).replace('{0}', this.getNonFilteredOptions().length);
                this.$alertContainer[0].innerHTML = titleOnSelectAllClick;
            }
        },

        focusSelectAll: function () {
            // Focus and select the Select All button
            this.$selectAllCheckbox.focus();
            this.$actionButtons.addClass('keyboard-selection');
        },

        deselectAll: function (deselectAllRecords) {
            if (this.config.showSelectAll && this.config.multiple) {
                var $changedInputs = ((deselectAllRecords) ? this.$selectionContainer : this.getNonFilteredOptions())
				.find('input[type="checkbox"]:not([disabled]):checked')
				.trigger('change', false);

                if ($.isFunction(this.config.events.onChange)) {
                    this.config.events.onChange.call(this, this, $changedInputs);
                }
                var titleOnSelectAllClick = (this.config.texts.selectAllDeselect).replace('{0}', this.getNonFilteredOptions().length);
                this.$alertContainer[0].innerHTML = titleOnSelectAllClick;
            }
        },
        getValues: function () {
            var selectedValues = [];
            this.$currentSelectionContainer.find('.sol-selected-display-item').each(function (item) {
                selectedValues.push($(this).data('value'));
            })
            return selectedValues;
        },
        setValues: function (valuesToSelect) {
            if (!valuesToSelect || !valuesToSelect.length) {
                return;
            }

            var self = this;
            var values = valuesToSelect;

            values.forEach(function (item) {
                var valueItem = item;
                var checkboxToSelect = self.$selectionContainer.find('.sol-checkbox').filter(function () {
                    var checkboxDataItem = $(this).data('sol-item');
                    if (checkboxDataItem !== null && checkboxDataItem !== undefined) {
                        return $(this).data('sol-item').value === valueItem;
                    }
                });
                checkboxToSelect.trigger('change', true);
            });
        },
        toggleControlState: function (isControlDisabled) {
            this.config.isControlDisabled = isControlDisabled;
            if (this.config.isControlDisabled) {
                //Hide Inner Container
                this.$innerContainer.hide();

                // Style Selection Container
                this.$container.addClass('sol-container-Disabled');

                this.$moreLessContainer.addClass('sol-moreless-container-Disabled');

                // Get collection of all cross buttons and hide them
                this.$currentSelectionContainer.find('.sol-quick-delete').each(function (item) {
                    $(this).addClass('sol-visibility-hidden');
                });
            } else {
                this.$innerContainer.show();
                this.$container.removeClass('sol-container-Disabled');
                this.$moreLessContainer.removeClass('sol-moreless-container-Disabled');
                this.$currentSelectionContainer.find('.sol-quick-delete').each(function (item) {
                    $(this).removeClass('sol-visibility-hidden');
                });
            }
        },
        checkUncheckOption: function ($currentHighlightedOption, check, index) {
            if (check !== undefined) {
                // If the value for check is passed as true of false use it,
                // else the checkbox would already be checked (as default click action)
                $currentHighlightedOption.prop('checked', check);
            }

            this._selectionChange($currentHighlightedOption, index);

            // If we just unselected one of the available options, we should uncheck the Select All checkbox
            this.$selectAllCheckbox.prop('checked', this.areAllOptionsChecked());
        },

        areAllOptionsChecked: function() {
            return this.getNonFilteredOptions().find('input[type="checkbox"]:not([disabled], :checked)').length === 0;
        },

        getNonFilteredOptions: function() {
            return this.$selectionContainer.find('.sol-option:not(.sol-filtered-search)');
        },

        getSelection: function () {
            return this.$selection.find('input:checked');
        },

        storeControlState: function () {
            this.currentHighlightedSelectionIndex = -1;
            if (this.$currentSelectionContainer != null) {
                var $currentHighlightedSelection = this.$currentSelectionContainer.find('.sol-selected-display-item.keyboard-selection');
                if ($currentHighlightedSelection.length > 0) {
                    var $allSelections = this.$currentSelectionContainer.find('.sol-selected-display-item');
                    this.currentHighlightedSelectionIndex = $allSelections.index($currentHighlightedSelection);
                }
                this.expanded = this.$lessLink.is(':visible');
            }
        },

        restoreControlState: function () {
            if (this.currentHighlightedSelectionIndex > -1) {
                var $allSelections = this.$currentSelectionContainer.find('.sol-selected-display-item');
                var $nextHighlightedOption = $($allSelections[this.currentHighlightedSelectionIndex]).addClass('keyboard-selection');
                $nextHighlightedOption.focus();
            }

            if (this.expanded) {
                this.expandAndShowLessLink(false);
            }

            if (this.isOpen()) {
                this.repositionFlyOut();
            }
        },

        refreshControl: function (valuesToSelect) {
            // If selected values are not null, store state, refresh ui and restore state
            if (valuesToSelect.length > 0) {
                this.storeControlState();
                this.deselectAll(true);
                this.setValues(valuesToSelect);
                this.restoreControlState();
            }
            else {
                if (this.getValues().length > 0) {
                    // If selected value is null , We perform deselect All only when there were any previous selections
                    this.deselectAll(true);
                }
            }
        },

        repositionFlyOut: function () {
            this.config.scrollTarget.bind('scroll', this.internalScrollWrapper).trigger('scroll');
            $(window).on('resize', this.internalScrollWrapper);
        },

        getNextItemTobeHighlighted: function ($currentSelectedItem) {
            if ($currentSelectedItem === null) {
                return null;
            }

            var $allSelections = this.$currentSelectionContainer.find('.sol-selected-display-item');
            var currentHighlightedSelectionIndex = $allSelections.index($currentSelectedItem);
            if (currentHighlightedSelectionIndex < $allSelections.length - 1) {
                // If there is any select option available in the list use currentHighlightedSelectionIndex + 1 (since delete is not complete at this point) itself to highlight the select option
                return $allSelections[currentHighlightedSelectionIndex + 1];
            }

            return null;
        }
    };

    // jquery plugin boiler plate code
    SearchableOptionList.defaults = SearchableOptionList.prototype.defaults;
    window.SearchableOptionList = SearchableOptionList;
    window.KEY_CODE = KEY_CODE;

    $.fn.searchableOptionList = function (options) {
        var result = [];
        this.each(function () {
            var $this = $(this),
                $alreadyInitializedSol = $this.data(SearchableOptionList.prototype.DATA_KEY);

            if ($alreadyInitializedSol) {
                result.push($alreadyInitializedSol);
            } else {
                result.push(new SearchableOptionList($this, options).init());
            }
        });

        if (result.length === 1) {
            return result[0];
        }

        return result;
    };
};

(function() {
	initializeSolLibrary(jQuery, window, document);
})();
